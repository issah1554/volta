export type NodeStatus = "online" | "degraded" | "offline";

export type NodeRow = {
  id: string;
  name: string;
  uptime: string;
  latency: string;
  status: NodeStatus;
  region?: string;
  lastCheck: string;
};

export interface NodesProps {
  title?: string;
  subtitle?: string;
  nodes?: NodeRow[];
}

const defaultNodes: NodeRow[] = [
  {
    id: "n-01",
    name: "Alpha Hub",
    uptime: "99.98%",
    latency: "12 ms",
    status: "online",
    region: "HQ",
    lastCheck: "Just now",
  },
  {
    id: "n-02",
    name: "Beacon 07",
    uptime: "97.2%",
    latency: "38 ms",
    status: "degraded",
    region: "Port Line",
    lastCheck: "4 min ago",
  },
  {
    id: "n-03",
    name: "Switchboard",
    uptime: "88.4%",
    latency: "102 ms",
    status: "degraded",
    region: "Warehouse",
    lastCheck: "22 min ago",
  },
  {
    id: "n-04",
    name: "Relay East",
    uptime: "0%",
    latency: "—",
    status: "offline",
    region: "East Ridge",
    lastCheck: "2 hr ago",
  },
];

const statusPill: Record<NodeStatus, string> = {
  online: "bg-success-50 text-success-700 border-success-200",
  degraded: "bg-warning-50 text-warning-700 border-warning-200",
  offline: "bg-danger-50 text-danger-700 border-danger-200",
};

export default function Nodes({
  title = "Node monitoring",
  subtitle = "Health, uptime, and edge latency across the network.",
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
            <i className="bi bi-hdd-network" />
            Deploy
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
                <p className="text-xs text-main-500">{node.region ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Uptime</p>
                <p className="text-sm text-main-800">{node.uptime}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Latency</p>
                <p className="text-sm text-main-800">{node.latency}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Last check</p>
                <p className="text-sm text-main-800">{node.lastCheck}</p>
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
