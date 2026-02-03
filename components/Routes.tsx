export type RouteStatus = "on-time" | "delayed" | "critical" | "idle";

export type RouteRow = {
  id: string;
  name: string;
  status: RouteStatus;
  progress: number;
  eta: string;
  driver: string;
  lastUpdate: string;
};

export interface RoutesProps {
  title?: string;
  subtitle?: string;
  routes?: RouteRow[];
}

const defaultRoutes: RouteRow[] = [
  {
    id: "r-01",
    name: "Port Line",
    status: "on-time",
    progress: 78,
    eta: "12 min",
    driver: "Amina Yusuf",
    lastUpdate: "1 min ago",
  },
  {
    id: "r-02",
    name: "Warehouse Loop",
    status: "delayed",
    progress: 42,
    eta: "31 min",
    driver: "Tomas Reed",
    lastUpdate: "4 min ago",
  },
  {
    id: "r-03",
    name: "North Ridge",
    status: "on-time",
    progress: 64,
    eta: "18 min",
    driver: "Zuri Mwita",
    lastUpdate: "7 min ago",
  },
  {
    id: "r-04",
    name: "City Center",
    status: "critical",
    progress: 23,
    eta: "46 min",
    driver: "Noah Santos",
    lastUpdate: "20 min ago",
  },
];

const statusPill: Record<RouteStatus, string> = {
  "on-time": "bg-success-50 text-success-700 border-success-200",
  delayed: "bg-warning-50 text-warning-700 border-warning-200",
  critical: "bg-danger-50 text-danger-700 border-danger-200",
  idle: "bg-secondary-50 text-secondary-700 border-secondary-200",
};

export default function Routes({
  title = "Route control",
  subtitle = "Track route progress, ETA, and dispatch status.",
  routes = defaultRoutes,
}: RoutesProps) {
  return (
    <section
      className="routes-panel flex h-full w-full flex-col gap-5 text-main-800"
      style={{ containerType: "inline-size" }}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Routes</p>
          <h2 className="text-2xl font-semibold text-main-900">{title}</h2>
          <p className="mt-1 text-sm text-main-600">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-main-600">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-main-200 bg-white px-3 py-2 text-main-700 transition hover:border-primary-300 hover:text-primary-700"
          >
            <i className="bi bi-signpost" />
            New route
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-2 text-primary-700"
          >
            <i className="bi bi-broadcast" />
            Live map
          </button>
        </div>
      </header>

      <div className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="grid gap-3">
          {routes.map((route) => (
            <div
              key={route.id}
              className="route-row grid items-center gap-3 rounded-xl border border-main-100 bg-white/90 px-3 py-3 text-xs text-main-600"
            >
              <div>
                <p className="text-sm font-semibold text-main-900">{route.name}</p>
                <p className="text-xs text-main-500">Driver: {route.driver}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Progress</p>
                <div className="mt-1 h-2 rounded-full bg-main-100">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${Math.min(100, Math.max(0, route.progress))}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-main-500">{route.progress}%</p>
              </div>
              <div>
                <p className="text-xs text-main-500">ETA</p>
                <p className="text-sm text-main-800">{route.eta}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Last update</p>
                <p className="text-sm text-main-800">{route.lastUpdate}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusPill[route.status]}`}>
                  {route.status}
                </span>
                <button
                  type="button"
                  aria-label="Route actions"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-main-200 bg-white text-main-700 transition hover:border-primary-300 hover:text-primary-700"
                >
                  <i className="bi bi-three-dots-vertical text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .routes-panel {
          container-name: routes-panel;
        }

        .route-row {
          grid-template-columns: 1fr;
        }

        @container routes-panel (min-width: 720px) {
          .route-row {
            grid-template-columns: minmax(0, 1.1fr) repeat(3, minmax(0, 0.7fr)) minmax(0, 0.5fr);
          }
        }
      `}</style>
    </section>
  );
}
