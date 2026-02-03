export type NodeStatus = "active" | "inactive";
export type NodeType = "station" | "terminal" | "landmark" | "junction";

export type NodeRow = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  type: NodeType;
  status: NodeStatus;
  createdAt: string;
};

export interface NodesProps {
  title?: string;
  subtitle?: string;
  nodes?: NodeRow[];
}

const defaultNodes: NodeRow[] = [
  {
    id: "n-01",
    name: "Alpha Station",
    latitude: "-6.7924000",
    longitude: "39.2083000",
    type: "station",
    status: "active",
    createdAt: "2024-05-01",
  },
  {
    id: "n-02",
    name: "Port Terminal",
    latitude: "-6.8182000",
    longitude: "39.2793000",
    type: "terminal",
    status: "active",
    createdAt: "2024-05-02",
  },
  {
    id: "n-03",
    name: "Warehouse Junction",
    latitude: "-6.8159000",
    longitude: "39.2458000",
    type: "junction",
    status: "active",
    createdAt: "2024-05-06",
  },
  {
    id: "n-04",
    name: "East Ridge Landmark",
    latitude: "-6.7806000",
    longitude: "39.3101000",
    type: "landmark",
    status: "inactive",
    createdAt: "2024-04-19",
  },
];

const statusPill: Record<NodeStatus, string> = {
  active: "bg-success-50 text-success-700 border-success-200",
  inactive: "bg-secondary-50 text-secondary-700 border-secondary-200",
};

export default function Nodes({
  title = "Node locations",
  subtitle = "Stops and locations with latitude, longitude, and type.",
  nodes = defaultNodes,
}: NodesProps) {
  return (
    <section
      className="nodes-panel flex h-full w-full flex-col gap-5 text-main-800"
      style={{ containerType: "inline-size" }}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Nodes</p>
          <h2 className="text-2xl font-semibold text-main-900">{title}</h2>
          <p className="mt-1 text-sm text-main-600">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-main-600">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-main-200 bg-white px-3 py-2 text-main-700 transition hover:border-primary-300 hover:text-primary-700"
          >
            <i className="bi bi-arrow-repeat" />
            Refresh
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-2 text-primary-700"
          >
            <i className="bi bi-geo-alt" />
            Add node
          </button>
        </div>
      </header>

      <div className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="grid gap-3">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="node-row grid items-center gap-3 rounded-xl border border-main-100 bg-white/90 px-3 py-3 text-xs text-main-600"
            >
              <div>
                <p className="text-sm font-semibold text-main-900">{node.name}</p>
                <p className="text-xs text-main-500 capitalize">{node.type}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Latitude</p>
                <p className="text-sm text-main-800">{node.latitude}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Longitude</p>
                <p className="text-sm text-main-800">{node.longitude}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Created</p>
                <p className="text-sm text-main-800">{node.createdAt}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusPill[node.status]}`}>
                  {node.status}
                </span>
                <button
                  type="button"
                  aria-label="Node actions"
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
        .nodes-panel {
          container-name: nodes-panel;
        }

        .node-row {
          grid-template-columns: 1fr;
        }

        @container nodes-panel (min-width: 720px) {
          .node-row {
            grid-template-columns: minmax(0, 1fr) repeat(3, minmax(0, 0.7fr)) minmax(0, 0.5fr);
          }
        }
      `}</style>
    </section>
  );
}
