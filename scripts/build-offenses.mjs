import { writeFile } from "node:fs/promises";
import { parseNrsChapter, parseNrsIndex } from "../src/lib/nrs-parse.ts";
import { summarizeOffense } from "../src/lib/offense-elements.ts";

function decodeNrsBytes(bytes) {
  const head = new TextDecoder("latin1").decode(bytes.subarray(0, 900));
  const charset = head.match(/charset\s*=\s*["']?\s*([a-z0-9._-]+)/i)?.[1]?.toLowerCase() ?? "";
  if (/1252|latin1|iso-8859-1/.test(charset)) return new TextDecoder("windows-1252").decode(bytes);
  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  if (utf8.includes("\uFFFD")) return new TextDecoder("windows-1252").decode(bytes);
  return utf8;
}

async function readHtml(url) {
  const response = await fetch(url, { headers: { Accept: "text/html" } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return decodeNrsBytes(new Uint8Array(await response.arrayBuffer()));
}

const index = parseNrsIndex(await readHtml("https://www.leg.state.nv.us/nrs/"));
const chapters = [];
for (const title of index) {
  const crimesTitle = /CRIMES AND PUNISHMENTS/i.test(title.title);
  for (const chapter of title.chapters) {
    const extra = /controlled substance|driving under the influence|explosives|cannabis/i.test(chapter.name);
    if (crimesTitle || extra) chapters.push(chapter);
  }
}

const offenses = [];
let cursor = 0;
async function worker() {
  while (cursor < chapters.length) {
    const chapter = chapters[cursor];
    cursor += 1;
    try {
      const html = await readHtml(`https://www.leg.state.nv.us/nrs/${chapter.file}`);
      const doc = parseNrsChapter(chapter.file, html);
      const found = doc.sections
        .map((section) => summarizeOffense(section, chapter.file, `${chapter.code} ${chapter.name}`))
        .filter(Boolean);
      offenses.push(...found);
      console.log(`${chapter.code} ${found.length}/${doc.sections.length}`);
    } catch (error) {
      console.log(`FAIL ${chapter.file} ${error instanceof Error ? error.message : error}`);
    }
  }
}

await Promise.all([worker(), worker(), worker()]);
offenses.sort((a, b) => a.cite.localeCompare(b.cite, undefined, { numeric: true }));
await writeFile(new URL("../src/data/offenses.json", import.meta.url), JSON.stringify(offenses));
console.log(`wrote ${offenses.length} offenses from ${chapters.length} chapters`);
