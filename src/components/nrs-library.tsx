import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { getNrsChapter, getNrsIndex } from "@/lib/nrs-api";
import { summarizeOffense } from "@/lib/offense-elements";
import { CrimeElements } from "@/components/crime-elements";
import type { NrsChapterDoc, NrsSection, NrsTitle } from "@/lib/nrs-parse";

const OFFICIAL = "https://www.leg.state.nv.us/nrs/";

function parseCite(value: string) {
  const match = value.trim().match(/^(?:NRS\s*)?(\d+[A-Z]?)(?:\.(\d+[A-Z]?))?$/i);
  if (!match) return null;
  return { chapter: match[1].toUpperCase(), section: match[2]?.toUpperCase() };
}

export function NrsLibrary() {
  const [titles, setTitles] = useState<NrsTitle[] | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [library, setLibrary] = useState<"chapters" | "elements">("chapters");
  const [query, setQuery] = useState("");
  const [openTitles, setOpenTitles] = useState<string[]>([]);
  const [doc, setDoc] = useState<NrsChapterDoc | null>(null);
  const [docError, setDocError] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [sectionQuery, setSectionQuery] = useState("");
  const [focusCite, setFocusCite] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getNrsIndex()
      .then((next) => {
        if (!cancelled) setTitles(next);
      })
      .catch(() => {
        if (!cancelled) setIndexError("The Legislature site did not respond.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cite = parseCite(query);
  const needle = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!titles) return [];
    if (!needle) return titles;
    return titles
      .map((title) => ({
        ...title,
        chapters: title.chapters.filter((chapter) => {
          const blob = `${title.title} ${chapter.code} ${chapter.name}`.toLowerCase();
          return blob.includes(needle) || chapter.code.toUpperCase() === cite?.chapter;
        }),
      }))
      .filter((title) => title.chapters.length > 0);
  }, [titles, needle, cite]);

  const chapterCount = titles?.reduce((sum, title) => sum + title.chapters.length, 0) ?? 0;

  async function openChapter(file: string, section?: string) {
    setDoc(null);
    setDocError(null);
    setLoadingFile(file);
    setSectionQuery("");
    setFocusCite(null);
    try {
      const next = await getNrsChapter(file);
      const wanted = section
        ? next.sections.find((item) => item.cite.toUpperCase() === `${chapterCode(file)}.${section}`.toUpperCase())
        : undefined;
      setFocusCite(wanted?.cite ?? null);
      setDoc(next);
    } catch {
      setDocError("That chapter did not load. Try it again.");
    } finally {
      setLoadingFile(null);
    }
  }

  function openCitation(raw: string) {
    const parsed = parseCite(raw);
    if (!parsed || !titles) return;
    const chapter = titles
      .flatMap((title) => title.chapters)
      .find((item) => item.code.toUpperCase() === parsed.chapter);
    if (!chapter) return;
    void openChapter(chapter.file, parsed.section);
  }

  useEffect(() => {
    if (!doc || !focusCite) return;
    const node = document.getElementById(`nrs-${focusCite}`);
    node?.scrollIntoView({ block: "start" });
  }, [doc, focusCite]);

  if (doc || loadingFile || docError) {
    return (
      <ChapterView
        doc={doc}
        loading={loadingFile !== null && !doc}
        error={docError}
        sectionQuery={sectionQuery}
        focusCite={focusCite}
        onSectionQuery={setSectionQuery}
        onBack={() => {
          setDoc(null);
          setDocError(null);
          setFocusCite(null);
        }}
        onOpenCite={openCitation}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-4 pb-10">
      <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="Statute library">
        <button
          type="button"
          role="tab"
          aria-selected={library === "chapters"}
          onClick={() => setLibrary("chapters")}
          className={`min-h-11 rounded-lg border text-sm font-semibold ${library === "chapters" ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-muted"}`}
        >
          Chapters
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={library === "elements"}
          onClick={() => setLibrary("elements")}
          className={`min-h-11 rounded-lg border text-sm font-semibold ${library === "elements" ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-muted"}`}
        >
          Crime elements
        </button>
      </div>
      {library === "elements" ? (
        <div className="mt-4">
          <CrimeElements onOpen={(file, section) => void openChapter(file, section)} />
        </div>
      ) : (
      <div>
      <div className="relative mt-3">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={18} />
        <label htmlFor="nrs-search" className="sr-only">
          Search the Nevada Revised Statutes
        </label>
        <input
          id="nrs-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && cite) openCitation(query);
          }}
          placeholder="Chapter, subject, or citation…"
          className="w-full rounded-lg border border-border bg-surface py-3 pr-11 pl-10 text-base text-fg outline-none placeholder:text-muted focus:border-accent"
          autoComplete="off"
          enterKeyHint="search"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center text-muted"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      {cite ? (
        <button
          type="button"
          onClick={() => openCitation(query)}
          className="mt-3 inline-flex min-h-11 items-center font-semibold text-accent"
        >
          Open NRS {cite.chapter}
          {cite.section ? `.${cite.section}` : ""}
        </button>
      ) : null}

      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {titles ? `${chapterCount} chapters across ${titles.length} titles` : indexError ? "" : "Loading the current code…"}
      </p>
      {indexError ? (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center">
          <p className="text-sm text-muted">{indexError}</p>
          <button
            type="button"
            onClick={() => {
              setIndexError(null);
              setTitles(null);
              getNrsIndex()
                .then(setTitles)
                .catch(() => setIndexError("The Legislature site did not respond."));
            }}
            className="mt-3 inline-flex min-h-11 items-center font-semibold text-accent"
          >
            Try again
          </button>
        </div>
      ) : null}

      <div className="mt-3 space-y-2">
        {visible.map((title) => {
          const expanded = needle.length > 0 || openTitles.includes(title.title);
          return (
            <section key={title.title} className="rounded-xl border border-border bg-surface">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() =>
                  setOpenTitles((current) =>
                    current.includes(title.title)
                      ? current.filter((item) => item !== title.title)
                      : [...current, title.title],
                  )
                }
                className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="min-w-0 flex-1 font-semibold leading-snug">{title.title}</span>
                <span className="font-mono text-xs text-muted">{title.chapters.length}</span>
                <ChevronDown
                  aria-hidden="true"
                  size={18}
                  className={`shrink-0 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>
              {expanded ? (
                <ul className="border-t border-border">
                  {title.chapters.map((chapter) => (
                    <li key={chapter.file} className="border-b border-border last:border-b-0">
                      <button
                        type="button"
                        onClick={() => void openChapter(chapter.file)}
                        className="flex min-h-11 w-full items-baseline gap-3 px-4 py-3 text-left"
                      >
                        <span className="w-16 shrink-0 font-mono text-sm font-semibold text-accent">
                          {chapter.code}
                        </span>
                        <span className="leading-snug">{chapter.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>
      <p className="mt-8 text-center text-xs leading-relaxed text-muted">
        Text is fetched from the{" "}
        <a className="font-semibold text-accent" href={OFFICIAL} target="_blank" rel="noreferrer">
          Nevada Legislature
        </a>
        . Confirm it there before you charge or book.
      </p>
      </div>
      )}
    </div>
  );
}

function chapterCode(file: string) {
  return file.replace(/^NRS-/i, "").replace(/\.html$/i, "").replace(/^0+(?=\d)/, "");
}

function ChapterView({
  doc,
  loading,
  error,
  sectionQuery,
  focusCite,
  onSectionQuery,
  onBack,
  onOpenCite,
}: {
  doc: NrsChapterDoc | null;
  loading: boolean;
  error: string | null;
  sectionQuery: string;
  focusCite: string | null;
  onSectionQuery: (value: string) => void;
  onBack: () => void;
  onOpenCite: (cite: string) => void;
}) {
  const needle = sectionQuery.trim().toLowerCase();
  const sections = (doc?.sections ?? []).filter((section) => {
    if (!needle) return true;
    return `${section.cite} ${section.heading} ${section.text}`.toLowerCase().includes(needle);
  });

  return (
    <div className="mx-auto max-w-3xl px-4 pt-4 pb-10">
      <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center text-sm font-semibold text-accent">
        All chapters
      </button>
      {loading ? <p className="mt-4 text-sm text-muted">Loading the official chapter…</p> : null}
      {error ? <p className="mt-4 text-sm text-muted">{error}</p> : null}
      {doc ? (
        <>
          <h2 className="mt-2 text-xl font-semibold leading-snug">{doc.heading}</h2>
          <p className="mt-1 text-sm text-muted">
            {doc.revised ? `Legislature revision ${doc.revised}. ` : ""}
            <a
              className="font-semibold text-accent"
              href={`${OFFICIAL}${doc.file}`}
              target="_blank"
              rel="noreferrer"
            >
              Official page
            </a>
          </p>
          <label htmlFor="section-search" className="sr-only">
            Search this chapter
          </label>
          <input
            id="section-search"
            value={sectionQuery}
            onChange={(event) => onSectionQuery(event.target.value)}
            placeholder="Search this chapter…"
            className="mt-3 w-full rounded-lg border border-border bg-surface px-3 py-3 text-base text-fg outline-none placeholder:text-muted focus:border-accent"
          />
          <p className="mt-3 text-sm text-muted">
            {sections.length} {sections.length === 1 ? "section" : "sections"}
          </p>
          <ul className="mt-3 space-y-3">
            {sections.map((section) => (
              <li key={section.id || section.cite}>
                <SectionCard section={section} active={section.cite === focusCite} onOpenCite={onOpenCite} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function SectionCard({
  section,
  active,
  onOpenCite,
}: {
  section: NrsSection;
  active: boolean;
  onOpenCite: (cite: string) => void;
}) {
  return (
    <article
      id={`nrs-${section.cite}`}
      className={`scroll-mt-4 rounded-xl border bg-surface px-4 py-3 ${active ? "border-accent" : "border-border"}`}
    >
      <p className="font-mono text-sm font-semibold text-accent">NRS {section.cite}</p>
      {section.heading ? <h3 className="mt-1 font-semibold leading-snug">{section.heading}</h3> : null}
      <Elements section={section} />
      {section.text ? (
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
          <CiteText text={section.text} onOpenCite={onOpenCite} />
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted">No operative text in this section.</p>
      )}
    </article>
  );
}

function Elements({ section }: { section: NrsSection }) {
  const brief = summarizeOffense(section, "", "");
  if (!brief) return null;
  return (
    <div className="mt-3 rounded-lg border border-border bg-bg px-3 py-3">
      <p className="text-xs font-semibold tracking-wide text-muted">{brief.level}</p>
      <ul className="mt-2 space-y-2">
        {brief.elements.map((element) => (
          <li key={element} className="text-sm leading-relaxed">
            {element}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CiteText({ text, onOpenCite }: { text: string; onOpenCite: (cite: string) => void }) {
  const parts = text.split(/(NRS\s+\d+[A-Z]?(?:\.\d+[A-Z]?)?)/g);
  return parts.map((part, index) => {
    const match = part.match(/^NRS\s+(\d+[A-Z]?(?:\.\d+[A-Z]?)?)$/);
    if (!match) return <span key={index}>{part}</span>;
    return (
      <button
        key={index}
        type="button"
        onClick={() => onOpenCite(match[1])}
        className="font-semibold text-accent"
      >
        {part}
      </button>
    );
  });
}
