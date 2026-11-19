import { useEffect, useState } from "react";

const MAP_URL = "https://mapdata-lasvegasnevada-gov.appspot.com/maps/amiinvegas/amiinvegas.htm";

export function CityMap() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const markOnline = () => setOnline(true);
    const markOffline = () => setOnline(false);
    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);
    if (!navigator.geolocation || !navigator.onLine) {
      return () => {
        window.removeEventListener("online", markOnline);
        window.removeEventListener("offline", markOffline);
      };
    }
    navigator.geolocation.getCurrentPosition(
      () => {},
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 15000 },
    );
    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
    };
  }, []);

  return (
    <div className="safe-bottom flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <p className="text-sm text-muted">Am I In Vegas — City of Las Vegas limits</p>
        <a
          href={MAP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-accent"
        >
          Open map
        </a>
      </div>
      {online ? (
        <iframe
          title="Am I In Vegas"
          src={MAP_URL}
          allow="geolocation"
          className="min-h-0 w-full flex-1 border-0 bg-surface"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <p className="px-4 py-10 text-center text-sm text-muted">
          The city map needs the car dock. Field cards and saved statutes still work.
        </p>
      )}
    </div>
  );
}
