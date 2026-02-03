export type RouteStatus = "active" | "inactive";

export type RouteNode = {
  seqNo: number;
  name: string;
};

export type RouteRow = {
  id: string;
  code?: string;
  name: string;
  status: RouteStatus;
  createdBy?: string;
  nodes: RouteNode[];
  updatedAt: string;
};

export interface RoutesProps {
  title?: string;
  subtitle?: string;
  routes?: RouteRow[];
}

const defaultRoutes: RouteRow[] = [
  {
    id: "r-01",
    code: "PL-001",
    name: "Port Line",
    status: "active",
    createdBy: "Amina Yusuf",
    updatedAt: "2024-05-09",
    nodes: [
      { seqNo: 1, name: "Alpha Station" },
      { seqNo: 2, name: "Port Terminal" },
      { seqNo: 3, name: "Dock 4" },
    ],
  },
  {
    id: "r-02",
    code: "WL-014",
    name: "Warehouse Loop",
    status: "active",
    createdBy: "Tomas Reed",
    updatedAt: "2024-05-10",
    nodes: [
      { seqNo: 1, name: "Warehouse Junction" },
      { seqNo: 2, name: "Depot North" },
      { seqNo: 3, name: "Switchboard" },
      { seqNo: 4, name: "Alpha Station" },
    ],
  },
  {
    id: "r-03",
    code: "NR-220",
    name: "North Ridge",
    status: "inactive",
    createdBy: "Zuri Mwita",
    updatedAt: "2024-04-26",
    nodes: [
      { seqNo: 1, name: "East Ridge Landmark" },
      { seqNo: 2, name: "North Gate" },
    ],
  },
  {
    id: "r-04",
    code: "CC-104",
    name: "City Center",
    status: "active",
    createdBy: "Noah Santos",
    updatedAt: "2024-05-11",
    nodes: [
      { seqNo: 1, name: "Central Station" },
      { seqNo: 2, name: "Market Junction" },
      { seqNo: 3, name: "Library Stop" },
    ],
  },
];

const statusPill: Record<RouteStatus, string> = {
  active: "bg-success-50 text-success-700 border-success-200",
  inactive: "bg-secondary-50 text-secondary-700 border-secondary-200",
};

export default function Routes({
  title = "Route definitions",
  subtitle = "Routes composed of ordered nodes and assignments.",
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
            <i className="bi bi-diagram-3" />
            Add nodes
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
                <p className="text-xs text-main-500">
                  {route.code ? `Code: ${route.code}` : "No code"}
                </p>
              </div>
              <div>
                <p className="text-xs text-main-500">Created by</p>
                <p className="text-sm text-main-800">{route.createdBy ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Nodes</p>
                <p className="text-sm text-main-800">{route.nodes.length}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Updated</p>
                <p className="text-sm text-main-800">{route.updatedAt}</p>
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
              <div className="route-nodes col-span-full rounded-lg border border-main-100 bg-white/70 px-3 py-2 text-xs text-main-600">
                <p className="text-[11px] uppercase tracking-[0.2em] text-main-500">Ordered nodes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {route.nodes.map((node) => (
                    <span
                      key={`${route.id}-${node.seqNo}`}
                      className="inline-flex items-center gap-2 rounded-full border border-main-200 bg-white px-2 py-1 text-[11px] text-main-700"
                    >
                      <span className="text-[10px] text-main-400">{node.seqNo}</span>
                      {node.name}
                    </span>
                  ))}
                </div>
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

          .route-nodes {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </section>
  );
}
