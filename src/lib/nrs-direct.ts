import { Capacitor, CapacitorHttp } from "@capacitor/core";
import {
  isNrsFile,
  parseNrsChapter,
  parseNrsIndex,
  type NrsChapterDoc,
  type NrsTitle,
} from "@/lib/nrs-parse";
import pack from "@/data/nrs-pack.json";

const INDEX_URL = "https://www.leg.state.nv.us/nrs/";
const saved = pack as {
  index: NrsTitle[];
  chapters: Record<string, NrsChapterDoc>;
};

function savedChapter(file: string) {
  return saved.chapters[file] ?? null;
}

function decodeNrsBytes(bytes: Uint8Array) {
  const head = new TextDecoder("latin1").decode(bytes.subarray(0, 900));
  const charset = head.match(/charset\s*=\s*["']?\s*([a-z0-9._-]+)/i)?.[1]?.toLowerCase() ?? "";
  if (/1252|latin1|iso-8859-1/.test(charset)) return new TextDecoder("windows-1252").decode(bytes);
  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  if (utf8.includes("\uFFFD")) return new TextDecoder("windows-1252").decode(bytes);
  return utf8;
}

function bytesFromBase64(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function readHtml(url: string) {
  if (Capacitor.isNativePlatform()) {
    const response = await CapacitorHttp.get({
      url,
      headers: { Accept: "text/html" },
      responseType: "arraybuffer",
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Legislature site returned ${response.status}`);
    }
    const data = response.data;
    if (typeof data !== "string") throw new Error("The Legislature site returned an unreadable page.");
    return decodeNrsBytes(bytesFromBase64(data));
  }

  const response = await fetch(url, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Legislature site returned ${response.status}`);
  return decodeNrsBytes(new Uint8Array(await response.arrayBuffer()));
}

export function fetchNrsIndex(): Promise<NrsTitle[]> {
  if (!navigator.onLine && saved.index.length > 0) return Promise.resolve(saved.index);
  return readHtml(INDEX_URL)
    .then((html) => {
      const titles = parseNrsIndex(html);
      if (titles.length === 0) throw new Error("The NRS index was empty.");
      return titles;
    })
    .catch((error: unknown) => {
      if (saved.index.length > 0) return saved.index;
      throw error;
    });
}

export function fetchNrsChapter(file: string): Promise<NrsChapterDoc> {
  if (!isNrsFile(file)) return Promise.reject(new Error("Unknown chapter"));
  const local = savedChapter(file);
  if (!navigator.onLine) {
    return local
      ? Promise.resolve(local)
      : Promise.reject(new Error("This chapter is not saved on this computer. Dock the MDC to load it."));
  }
  return readHtml(`${INDEX_URL}${file}`)
    .then((html) => parseNrsChapter(file, html))
    .catch((error: unknown) => {
      if (local) return local;
      throw error;
    });
}
