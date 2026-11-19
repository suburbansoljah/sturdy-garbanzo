import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import offenses from "@/data/offenses.json";
import type { OffenseBrief } from "@/lib/offense-elements";

const briefs = offenses as OffenseBrief[];

export function CrimeElements({ onOpen }: { onOpen: (file: string, section: string) => void }) {
  const [query, setQuery] = useState("");
  const [openChapters, setOpenChapters] = useState<string[]>([]);
  const [openCite, setOpenCite] = useState<string | null>(null);
  const needle = query.trim().toLowerCase();

  const groups = useMemo(() => {
    const map = new Map<string, OffenseBrief[]>();
    for (const offense of briefs) {
      if (needle) {
        const blob = `${offense.cite} ${offense.heading} ${offense.chapter} ${offense.level} ${offense.elements.join(" ")}`.toLowerCase();
        if (!blob.includes(needle)) continue;
      }
      const list = map.get(offense.chapter) ?? [];
      list.push(offense);
      map.set(offense.chapter, list);
    }
    return [...map.entries()];
  }, [needle]);

  const shown = needle ? groups.reduce((sum, [, items]) => sum + items.length, 0) : briefs.length;

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        {briefs.length} offense sections from the crimes title, plus drugs, DUI, explosives, and cannabis.
        Each line is taken from the statute itself. Confirm the official section before you charge or book.
      </p>
      <div className="relative mt-3">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={18} />
        <label htmlFor="crime-search" className="sr-only">
          Search crime elements
        </label>
        <input
          id="crime-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Battery, 205.060, DUI, possession…"
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
      <p className="mt-3 text-sm text-muted">{shown} offenses</p>
      <div className="mt-3 space-y-2">
        {groups.map(([chapter, items]) => {
          const expanded = needle.length > 0 || openChapters.includes(chapter);
          return (
            <section key={chapter} className="rounded-xl border border-border bg-surface">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() =>
                  setOpenChapters((current) =>
                    current.includes(chapter) ? current.filter((item) => item !== chapter) : [...current, chapter],
                  )
                }
                className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="min-w-0 flex-1 font-semibold leading-snug">{chapter}</span>
                <span className="font-mono text-xs text-muted">{items.length}</span>
                <ChevronDown aria-hidden="true" size={18} className={`shrink-0 text-muted ${expanded ? "rotate-180" : ""}`} />
              </button>
              {expanded ? (
                <ul className="border-t border-border">
                  {items.map((offense) => {
                    const open = openCite === offense.cite;
                    const section = offense.cite.split(".")[1] ?? "";
                    return (
                      <li key={offense.cite} className="border-b border-border px-4 py-3 last:border-b-0">
                        <button
                          type="button"
                          aria-expanded={open}
                          onClick={() => setOpenCite(open ? null : offense.cite)}
                          className="flex min-h-11 w-full items-start gap-3 text-left"
                        >
                          <span className="w-20 shrink-0 font-mono text-sm font-semibold text-accent">{offense.cite}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-semibold tracking-wide text-muted">{offense.level}</span>
                            <span className="mt-0.5 block leading-snug">{offense.heading}</span>
                          </span>
                        </button>
                        {open ? (
                          <div className="pt-2 pl-[5.75rem]">
                            <ul className="space-y-2">
                              {offense.elements.map((element) => (
                                <li key={element} className="text-sm leading-relaxed">
                                  {element}
                                </li>
                              ))}
                            </ul>
                            <button
                              type="button"
                              onClick={() => onOpen(offense.file, section)}
                              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent"
                            >
                              Open full section
                            </button>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
