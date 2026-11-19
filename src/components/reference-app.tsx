import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, Star, X } from "lucide-react";
import { plates, statutes, type Plate, type Statute, type StatuteBadge } from "@/data/reference";
import badgeUrl from "@/assets/nvsp-badge.jpg";
import { CityMap } from "@/components/city-map";
import { NrsLibrary } from "@/components/nrs-library";

const PIN_KEY = "pinnedNRS";

type FilterId =
  | "all"
  | "pinned"
  | "plates"
  | "traffic"
  | "parking"
  | "person"
  | "property"
  | "drugs"
  | "local";

type DeskTab = "field" | "nrs" | "map";

const TABS: { id: DeskTab; label: string }[] = [
  { id: "field", label: "Field" },
  { id: "nrs", label: "NRS" },
  { id: "map", label: "Map" },
];

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pinned", label: "Pinned" },
  { id: "plates", label: "Plates" },
  { id: "traffic", label: "Traffic" },
  { id: "parking", label: "Parking" },
  { id: "person", label: "Person" },
  { id: "property", label: "Property" },
  { id: "drugs", label: "Drugs" },
  { id: "local", label: "Local" },
];

const BADGES: Record<StatuteBadge, string> = {
  "badge-cat-a": "bg-cat-a text-on-dark",
  "badge-cat-b": "bg-cat-b text-ink",
  "badge-cat-c": "bg-cat-c text-ink",
  "badge-cat-d": "bg-cat-d text-ink",
  "badge-cat-e": "bg-cat-e text-ink",
  "badge-misd": "bg-misd text-ink",
  "badge-civil": "bg-civil text-on-dark",
};

function readPins(): string[] {
  try {
    const raw = localStorage.getItem(PIN_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function isParking(statute: Statute) {
  const title = statute.title.toLowerCase();
  return (
    title.includes("parking") ||
    title.includes("tow") ||
    statute.code.includes("331") ||
    statute.code.includes("484B.4") ||
    statute.code.includes("484B.5")
  );
}

function matchesStatute(statute: Statute, query: string) {
  if (!query) return true;
  const blob = [
    statute.code,
    statute.title,
    statute.summary,
    statute.level,
    statute.noc,
    statute.booking,
    ...statute.elements,
  ]
    .join(" ")
    .toLowerCase();
  return blob.includes(query);
}

function matchesPlate(plate: Plate, query: string) {
  if (!query) return true;
  return [plate.type, plate.prefix, plate.small, plate.status].join(" ").toLowerCase().includes(query);
}

function matchesFilter(statute: Statute, filter: FilterId, pins: string[]) {
  if (filter === "pinned") return pins.includes(statute.code);
  if (filter === "parking") return isParking(statute);
  if (filter === "all" || filter === "plates") return true;
  return statute.category === filter;
}

export function ReferenceApp() {
  const [tab, setTab] = useState<DeskTab>("field");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [pins, setPins] = useState<string[]>([]);
  const [openCodes, setOpenCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);

  useEffect(() => {
    const markOnline = () => setOnline(true);
    const markOffline = () => setOnline(false);
    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);
    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
    };
  }, []);

  useEffect(() => {
    setPins(readPins());
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const needle = query.trim().toLowerCase();

  const visibleStatutes = useMemo(
    () =>
      statutes.filter(
        (statute) => matchesFilter(statute, filter, pins) && matchesStatute(statute, needle),
      ),
    [filter, needle, pins],
  );

  const visiblePlates = useMemo(
    () => plates.filter((plate) => matchesPlate(plate, needle)),
    [needle],
  );

  const showStatutes = filter !== "plates";
  const showPlates = filter === "plates" || (filter === "all" && needle.length > 0 && visiblePlates.length > 0);
  const platePreview = filter === "all" ? visiblePlates.slice(0, 4) : visiblePlates;

  function togglePin(code: string) {
    setPins((current) => {
      const next = current.includes(code) ? current.filter((item) => item !== code) : [...current, code];
      localStorage.setItem(PIN_KEY, JSON.stringify(next));
      return next;
    });
  }

  function toggleOpen(code: string) {
    setOpenCodes((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
    );
  }

  async function copyCite(statute: Statute) {
    const text = [
      `${statute.code} — ${statute.title}`,
      statute.level,
      statute.summary,
      `NOC ${statute.noc} · Booking ${statute.booking}`,
      ...statute.elements.map((element) => `• ${element}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(statute.code);
    } catch {
      setCopied(null);
    }
  }

  const statuteCountLabel =
    visibleStatutes.length === 1 ? "1 statute" : `${visibleStatutes.length} statutes`;
  const plateCountLabel = visiblePlates.length === 1 ? "1 plate" : `${visiblePlates.length} plates`;

  return (
    <div className="flex h-dvh min-h-screen flex-col bg-bg text-fg">
      <header className="safe-top shrink-0 border-b border-border bg-surface">
        <div className="h-0.5 bg-accent" />
        {online ? null : (
          <p className="bg-raised px-4 py-2 text-center text-sm text-muted">
            Undocked. Field cards and saved statutes still work. The map needs the dock.
          </p>
        )}
        <div className="mx-auto max-w-5xl px-4 pt-3 pb-3">
          <div className="flex items-center gap-3">
            <img src={badgeUrl} alt="" className="size-11 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="font-mono text-xs font-medium tracking-widest text-accent">NV STATE POLICE</p>
              <h1 className="text-lg font-semibold leading-tight">Capitol Police Field Guide</h1>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2" role="tablist" aria-label="Reference sections">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={`min-h-11 rounded-lg border text-sm font-semibold ${
                    active
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border bg-bg text-muted"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {tab === "field" ? (
            <>
              <div className="relative mt-3">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                  size={18}
                />
                <label htmlFor="field-search" className="sr-only">
                  Search statutes, plate prefixes, NOC, and booking codes
                </label>
                <input
                  id="field-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search NRS, prefix, NOC, booking…"
                  className="w-full rounded-lg border border-border bg-bg py-3 pr-11 pl-10 text-base text-fg outline-none placeholder:text-muted focus:border-accent"
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

              <div
                className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4"
                role="group"
                aria-label="Filters"
              >
                {FILTERS.map((item) => {
                  const active = filter === item.id;
                  const pinnedCount = item.id === "pinned" ? pins.length : 0;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(item.id)}
                      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-3 text-sm font-medium ${
                        active
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-border bg-bg text-muted"
                      }`}
                    >
                      {item.label}
                      {pinnedCount > 0 ? ` ${pinnedCount}` : ""}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </header>

      {tab === "field" ? (
        <main className="safe-bottom min-h-0 flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl px-4 pt-4 pb-10">
            <p className="mb-3 text-sm text-muted" aria-live="polite">
              {filter === "plates"
                ? plateCountLabel
                : showPlates
                  ? `${statuteCountLabel} · ${plateCountLabel}`
                  : statuteCountLabel}
            </p>

            {showPlates ? (
              <section className="mb-4" aria-label="License plates">
                <div className="mb-2 flex items-end justify-between gap-3">
                  <h2 className="text-sm font-semibold tracking-wide text-fg">Specialty plates</h2>
                  {filter === "all" && visiblePlates.length > platePreview.length ? (
                    <button
                      type="button"
                      onClick={() => setFilter("plates")}
                      className="text-sm font-semibold text-accent"
                    >
                      All {visiblePlates.length}
                    </button>
                  ) : null}
                </div>
                {filter === "plates" ? (
                  <p className="mb-3 text-sm leading-relaxed text-muted">
                    Full-size plates use the listed character count plus the prefix. Small and motorcycle
                    plates are shorter. Lake Tahoe allows 4. Old Timer allows 2.
                  </p>
                ) : null}
                {visiblePlates.length === 0 ? (
                  <EmptyNote>No matching Nevada plate types.</EmptyNote>
                ) : (
                  <ul className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
                    {platePreview.map((plate) => (
                      <PlateRow key={`${plate.prefix}-${plate.type}`} plate={plate} />
                    ))}
                  </ul>
                )}
              </section>
            ) : null}

            {showStatutes ? (
              visibleStatutes.length === 0 ? (
                <EmptyNote>
                  {filter === "pinned"
                    ? "No pinned statutes yet. Star one and it stays on this device."
                    : "No matching statutes or local codes."}
                </EmptyNote>
              ) : (
                <ul className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                  {visibleStatutes.map((statute) => (
                    <li key={statute.code}>
                      <StatuteCard
                        statute={statute}
                        pinned={pins.includes(statute.code)}
                        open={openCodes.includes(statute.code)}
                        copied={copied === statute.code}
                        onToggleOpen={() => toggleOpen(statute.code)}
                        onTogglePin={() => togglePin(statute.code)}
                        onCopy={() => void copyCite(statute)}
                      />
                    </li>
                  ))}
                </ul>
              )
            ) : null}

            <p className="mt-8 text-center text-xs leading-relaxed text-muted">
              Field cards are your uploaded quick notes. The NRS tab loads the current code from the
              Legislature. Confirm it before you charge or book.
            </p>
          </div>
        </main>
      ) : null}

      {tab === "nrs" ? (
        <div className="safe-bottom min-h-0 flex-1 overflow-auto">
          <NrsLibrary />
        </div>
      ) : null}

      {tab === "map" ? <CityMap /> : null}
    </div>
  );
}

function EmptyNote({ children }: { children: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-muted">
      {children}
    </p>
  );
}

function PlateRow({ plate }: { plate: Plate }) {
  const retired = plate.status.toLowerCase().includes("discontinued");
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3">
      <div className="grid h-12 w-16 shrink-0 place-items-center rounded-md border border-border bg-raised font-mono text-base font-semibold tracking-wider text-accent">
        {plate.prefix}
      </div>
      <div className="min-w-0">
        <p className="font-semibold leading-snug">{plate.type}</p>
        <p className="mt-0.5 text-sm text-muted">
          Full {plate.full} · Small {plate.small}
          <span className={retired ? "text-cat-a" : "text-cat-e"}> · {plate.status}</span>
        </p>
      </div>
    </li>
  );
}

function StatuteCard({
  statute,
  pinned,
  open,
  copied,
  onToggleOpen,
  onTogglePin,
  onCopy,
}: {
  statute: Statute;
  pinned: boolean;
  open: boolean;
  copied: boolean;
  onToggleOpen: () => void;
  onTogglePin: () => void;
  onCopy: () => void;
}) {
  return (
    <article className="relative rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={open}
        className="w-full px-4 py-3 pr-14 text-left"
      >
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 font-mono text-sm font-semibold break-words text-accent">
            {statute.code}
          </p>
          <ChevronDown
            aria-hidden="true"
            size={18}
            className={`mt-0.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
        <span
          className={`mt-2 inline-flex rounded px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${BADGES[statute.badge]}`}
        >
          {statute.level}
        </span>
        <h2 className="mt-2 text-base font-semibold leading-snug">{statute.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">{statute.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
          <span className="rounded-md bg-raised px-2 py-1 text-accent">NOC {statute.noc}</span>
          <span className="rounded-md bg-raised px-2 py-1 text-fg">BK {statute.booking}</span>
        </div>
      </button>

      <button
        type="button"
        onClick={onTogglePin}
        aria-pressed={pinned}
        aria-label={pinned ? `Unpin ${statute.code}` : `Pin ${statute.code}`}
        className="absolute top-1 right-1 grid size-11 place-items-center"
      >
        <Star
          size={18}
          className={pinned ? "fill-accent text-accent" : "text-muted"}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="border-t border-dashed border-border px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-accent">Required elements</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed marker:text-accent">
            {statute.elements.map((element) => (
              <li key={element}>{element}</li>
            ))}
          </ol>
          <button
            type="button"
            onClick={onCopy}
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent"
          >
            {copied ? "Copied" : "Copy cite"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
