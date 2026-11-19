export type OffenseBrief = {
  cite: string;
  heading: string;
  level: string;
  elements: string[];
  file: string;
  chapter: string;
};

const SKIP_HEADING =
  /^(penalt(y|ies)|punishment|applicability|short title|legislative declaration|severability|construction|costs|fees|notice|reporting requirements?)\b/i;

export function summarizeOffense(
  section: { cite: string; heading: string; text: string },
  file: string,
  chapter = "",
): OffenseBrief | null {
  const heading = section.heading.replace(/\s+/g, " ").trim();
  const text = section.text.replace(/\s+/g, " ").trim();
  if (text.length < 40 || heading.length === 0) return null;
  if (SKIP_HEADING.test(heading)) return null;
  if (!/\b(is guilty of|shall be punished|is unlawful|unlawful for any person)\b/i.test(text)) return null;

  const elements = conductElements(text);
  if (elements.length === 0) return null;
  return {
    cite: section.cite,
    heading,
    level: penaltyLevel(text),
    elements,
    file,
    chapter,
  };
}

function penaltyLevel(text: string) {
  const labels: string[] = [];
  for (const match of text.matchAll(/category\s+([a-e])\s+felony/gi)) {
    const label = `Cat ${match[1].toUpperCase()} felony`;
    if (!labels.includes(label)) labels.push(label);
  }
  if (/gross misdemeanor/i.test(text)) labels.push("Gross misdemeanor");
  if (/\bmisdemeanor\b/i.test(text.replace(/gross misdemeanor/gi, ""))) labels.push("Misdemeanor");
  if (labels.length === 0 && /felony/i.test(text)) labels.push("Felony");
  if (labels.length === 0 && /unlawful/i.test(text)) labels.push("Unlawful");
  if (labels.length === 0) labels.push("Offense");
  return labels.slice(0, 4).join(" · ");
}

function conductElements(text: string) {
  const chunks = text
    .split(/(?=(?:^|\s)\d{1,2}\.\s)/)
    .map((part) => part.trim().replace(/^\d{1,2}\.\s*/, ""))
    .filter((part) => part.length > 24);
  const pieces = chunks.length > 0 ? chunks : [text];
  const elements: string[] = [];
  for (const piece of pieces) {
    if (/^(a|any|every) person convicted\b/i.test(piece)) continue;
    if (/^(it is not a violation|the provisions of this section do not apply)\b/i.test(piece)) continue;
    if (/may be released on probation/i.test(piece)) continue;
    if (isPenaltyOnly(piece)) continue;
    if (/\bshall be punished\b/i.test(piece) && !/\bmeans\b/i.test(piece)) continue;
    if (!/\b(person who|who |unlawful|shall not|commits|takes|uses|enters|kills|sells|possesses|possess\b|drives|discharges|threatens|injures|steals|removes|makes|gives|receives|withholds|operates|carries|conceals|obtains|causes|inflicts)\b/i.test(piece)) {
      continue;
    }
    elements.push(clip(piece, 320));
    if (elements.length === 4) break;
  }
  return elements;
}

function isPenaltyOnly(text: string) {
  if (!/punished|guilty of|imprisonment|fine of|category\s+[a-e]/i.test(text)) return false;
  const conduct = text
    .replace(/category\s+[a-e]\s+felony/gi, "")
    .replace(/gross misdemeanors?/gi, "")
    .replace(/\b(?:misdemeanor|felony)s?\b/gi, "")
    .replace(/shall be punished[^.]+\./gi, "")
    .replace(/\bis guilty of[^.]+\./gi, "")
    .replace(/[^a-z]/gi, "");
  return conduct.length < 48;
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const stop = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("; "));
  return `${(stop > 80 ? slice.slice(0, stop + 1) : slice).trim()}…`;
}
