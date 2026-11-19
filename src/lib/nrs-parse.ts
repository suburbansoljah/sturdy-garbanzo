export type NrsChapterLink = {
  file: string;
  code: string;
  name: string;
};

export type NrsTitle = {
  title: string;
  chapters: NrsChapterLink[];
};

export type NrsSection = {
  id: string;
  cite: string;
  heading: string;
  text: string;
};

export type NrsChapterDoc = {
  file: string;
  heading: string;
  revised: string | null;
  sections: NrsSection[];
};

const FILE_RE = /^NRS-[0-9A-Z]+\.html$/;

export function isNrsFile(file: string) {
  return FILE_RE.test(file);
}

function decode(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(Number(num)))
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"');
}

function plain(html: string) {
  return decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "))
    .replace(/\u00a0/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}

function classOf(attrs: string) {
  const match = attrs.match(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").toLowerCase();
}

export function parseNrsIndex(html: string): NrsTitle[] {
  const titles: NrsTitle[] = [];
  let current: NrsTitle = { title: "Preliminary", chapters: [] };
  titles.push(current);

  const blocks = html.matchAll(/<h3\b[^>]*>[\s\S]*?<\/h3>|<li\b[^>]*>[\s\S]*?<\/li>/gi);
  for (const block of blocks) {
    const chunk = block[0];
    const link = chunk.match(/href="(NRS-[0-9A-Z]+\.html)"/i);
    if (chunk.startsWith("<h3") || chunk.startsWith("<H3")) {
      if (!link) {
        const title = plain(chunk);
        if (title) {
          current = { title, chapters: [] };
          titles.push(current);
        }
        continue;
      }
    }
    if (!link) continue;
    const anchor = chunk.match(
      /<a\b[^>]*href="(NRS-[0-9A-Z]+\.html)"[^>]*>([\s\S]*?)<\/a>([\s\S]*)$/i,
    );
    if (!anchor) continue;
    const file = anchor[1];
    let code = plain(anchor[2]).replace(/^chapter\s+/i, "").trim();
    let name = plain(anchor[3].replace(/^\s*(?:—|–|-|&#8212;|&mdash;)\s*/i, ""));
    if (/^preliminary chapter$/i.test(code)) {
      code = "Prelim";
      name = "Preliminary Chapter";
    }
    if (!name) name = code;
    current.chapters.push({ file, code, name });
  }

  return titles.filter((title) => title.chapters.length > 0);
}

function spanText(html: string, className: string) {
  const match = html.match(new RegExp(`class="${className}"[^>]*>([\\s\\S]*?)</span>`, "i"));
  return match ? plain(match[1]) : "";
}

export function parseNrsChapter(file: string, html: string): NrsChapterDoc {
  const revisedMatch = html.match(/\[Rev\.\s*([^\]]+)\]/i);
  const chapterPara = html.match(/<p\b[^>]*class="[^"]*Chapter[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const heading = chapterPara ? plain(chapterPara[1]) : file.replace(/\.html$/i, "");
  const sections: NrsSection[] = [];
  let current: NrsSection | null = null;

  for (const para of html.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
    const kind = classOf(para[1]);
    if (!kind.includes("sectbody")) continue;
    const inner = para[2];
    const anchor = inner.match(/name=(?:"|')?(NRS[0-9A-Z]+Sec[0-9A-Z]+)/i)?.[1] ?? "";
    const cite = spanText(inner, "Section");
    const lead = spanText(inner, "Leadline");
    const full = plain(inner);
    if (anchor || cite) {
      let text = full;
      if (lead) {
        const at = text.toLowerCase().indexOf(lead.toLowerCase());
        if (at >= 0) text = text.slice(at + lead.length).trim();
      }
      text = text.replace(/^NRS\s+[\d.A-Z]+\s*/i, "").trim();
      current = {
        id: anchor || cite,
        cite: cite || anchor,
        heading: lead,
        text,
      };
      sections.push(current);
      continue;
    }
    if (current && full) current.text = current.text ? `${current.text}\n\n${full}` : full;
  }

  return {
    file,
    heading,
    revised: revisedMatch ? revisedMatch[1].replace(/\s+/g, " ").trim() : null,
    sections,
  };
}
