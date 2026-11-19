import { createServerFn } from "@tanstack/react-start";
import {
  isNrsFile,
  parseNrsChapter,
  parseNrsIndex,
  type NrsChapterDoc,
  type NrsTitle,
} from "@/lib/nrs-parse";

const INDEX_URL = "https://www.leg.state.nv.us/nrs/";
const TTL_MS = 6 * 60 * 60 * 1000;

let indexCache: { at: number; titles: NrsTitle[] } | null = null;
const chapterCache = new Map<string, { at: number; doc: NrsChapterDoc }>();

async function readHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": "NevadaFieldReference/1.0",
    },
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error(`Legislature site returned ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const head = new TextDecoder("latin1").decode(bytes.subarray(0, 900));
  const charset = head.match(/charset\s*=\s*["']?\s*([a-z0-9._-]+)/i)?.[1]?.toLowerCase() ?? "";
  if (/1252|latin1|iso-8859-1/.test(charset)) return new TextDecoder("windows-1252").decode(bytes);
  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  if (utf8.includes("\uFFFD")) return new TextDecoder("windows-1252").decode(bytes);
  return utf8;
}

export const loadNrsIndex = createServerFn({ method: "GET" }).handler(async () => {
  if (indexCache && Date.now() - indexCache.at < TTL_MS) return indexCache.titles;
  const titles = parseNrsIndex(await readHtml(INDEX_URL));
  if (titles.length === 0) throw new Error("The NRS index was empty.");
  indexCache = { at: Date.now(), titles };
  return titles;
});

export const loadNrsChapter = createServerFn({ method: "GET" })
  .validator((file: string) => {
    if (!isNrsFile(file)) throw new Error("Unknown chapter");
    return file;
  })
  .handler(async ({ data: file }) => {
    const cached = chapterCache.get(file);
    if (cached && Date.now() - cached.at < TTL_MS) return cached.doc;
    const doc = parseNrsChapter(file, await readHtml(`https://www.leg.state.nv.us/nrs/${file}`));
    chapterCache.set(file, { at: Date.now(), doc });
    if (chapterCache.size > 16) {
      const oldest = [...chapterCache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
      if (oldest) chapterCache.delete(oldest[0]);
    }
    return doc;
  });
