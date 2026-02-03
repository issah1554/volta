type Trend = "up" | "down" | "neutral";

export type DashboardStat = {
  label: string;
  value: string;
  change: string;
  trend: Trend;
  helper?: string;
};

export type DashboardActivity = {
  title: string;
  detail: string;
  time: string;
  status: "ok" | "warning" | "error";
};

export type DashboardRoute = {
  name: string;
  progress: number;
  eta: string;
};

export type DashboardNode = {
  name: string;
  uptime: string;
  latency: string;
  status: "online" | "degraded" | "offline";
};

export interface DashboardProps {
  title?: string;
  subtitle?: string;
  stats?: DashboardStat[];
  activity?: DashboardActivity[];
  routes?: DashboardRoute[];
  nodes?: DashboardNode[];
}

const defaultStats: DashboardStat[] = [
  { label: "Active units", value: "128", change: "+12%", trend: "up", helper: "vs last week" },
  { label: "Coverage", value: "92.4%", change: "+3.1%", trend: "up", helper: "avg signal" },
  { label: "Alerts", value: "7", change: "-2", trend: "down", helper: "critical + high" },
  { label: "Avg response", value: "1.8s", change: "+0.2s", trend: "neutral", helper: "last 24h" },
];

const defaultActivity: DashboardActivity[] = [
  { title: "Node L-17 recalibrated", detail: "Battery recovered to 86%", time: "8 min ago", status: "ok" },
  { title: "Route 12 congestion", detail: "Temporary latency spike", time: "23 min ago", status: "warning" },
  { title: "Sensor B-09 offline", detail: "Last seen near Dock 4", time: "1 hr ago", status: "error" },
  { title: "Update queued", detail: "Firmware v2.4.1 scheduled", time: "3 hr ago", status: "ok" },
];

const defaultRoutes: DashboardRoute[] = [
  { name: "Port Line", progress: 78, eta: "12 min" },
  { name: "Warehouse Loop", progress: 42, eta: "31 min" },
  { name: "North Ridge", progress: 64, eta: "18 min" },
  { name: "City Center", progress: 23, eta: "46 min" },
];

const defaultNodes: DashboardNode[] = [
  { name: "Alpha Hub", uptime: "99.98%", latency: "12 ms", status: "online" },
  { name: "Beacon 07", uptime: "97.2%", latency: "38 ms", status: "degraded" },
  { name: "Switchboard", uptime: "88.4%", latency: "102 ms", status: "degraded" },
  { name: "Relay East", uptime: "0%", latency: "—", status: "offline" },
];

const trendStyles: Record<Trend, { text: string; icon: string }> = {
  up: { text: "text-success-700", icon: "bi-arrow-up-right" },
  down: { text: "text-danger-700", icon: "bi-arrow-down-right" },
  neutral: { text: "text-main-600", icon: "bi-dash" },
};

const statusStyles: Record<DashboardActivity["status"], string> = {
  ok: "bg-success-50 text-success-700 border-success-200",
  warning: "bg-warning-50 text-warning-700 border-warning-200",
  error: "bg-danger-50 text-danger-700 border-danger-200",
};

const nodeStatusStyles: Record<DashboardNode["status"], string> = {
  online: "bg-success-500",
  degraded: "bg-warning-500",
  offline: "bg-danger-500",
};

export default function Dashboard({
  title = "Operations dashboard",
  subtitle = "Live system health, routes, and field activity.",
  stats = defaultStats,
  activity = defaultActivity,
  routes = defaultRoutes,
  nodes = defaultNodes,
}: DashboardProps) {
  return (
    <section
      className="dashboard-container flex h-full w-full flex-col gap-5 text-main-800"
      style={{ containerType: "inline-size" }}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Overview</p>
          <h2 className="text-2xl font-semibold text-main-900">{title}</h2>
          <p className="mt-1 text-sm text-main-600">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-main-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-2 text-primary-700">
            <i className="bi bi-broadcast text-sm" />
            Live sync enabled
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-main-200 bg-white px-3 py-2 text-main-700 transition hover:border-primary-300 hover:text-primary-700"
          >
            <i className="bi bi-sliders text-sm" />
            Filters
          </button>
        </div>
      </header>

      <div className="dashboard-top grid gap-4">
        <div className="dashboard-stats grid gap-4">
          {stats.map((stat) => {
            const trend = trendStyles[stat.trend];
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
              >
                <div className="flex items-center justify-between text-xs text-main-500">
                  <span>{stat.label}</span>
                  <span className={`inline-flex items-center gap-1 ${trend.text}`}>
                    <i className={`bi ${trend.icon}`} />
                    {stat.change}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-main-900">{stat.value}</span>
                  {stat.helper ? <span className="text-xs text-main-500">{stat.helper}</span> : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/40 bg-linear-to-br from-primary-50/80 to-white p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Coverage</p>
              <p className="text-sm text-main-600">Signal footprint across regions</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <i className="bi bi-wifi text-base" />
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {routes.map((route) => (
              <div key={route.name} className="rounded-xl border border-white/60 bg-white/70 p-3">
                <div className="flex items-center justify-between text-xs text-main-600">
                  <span className="font-medium text-main-800">{route.name}</span>
                  <span>ETA {route.eta}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-main-100">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${Math.min(100, Math.max(0, route.progress))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom grid gap-4">
        <div className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Nodes</p>
              <p className="text-sm text-main-600">Critical network touchpoints</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-main-200 bg-white px-3 py-1.5 text-xs text-main-700 transition hover:border-primary-300 hover:text-primary-700"
            >
              View all
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {nodes.map((node) => (
              <div
                key={node.name}
                className="dashboard-node-row grid items-center gap-2 rounded-xl border border-main-100 bg-white/90 px-3 py-2 text-xs text-main-600"
              >
                <div className="flex items-center gap-2 text-sm text-main-800">
                  <span className={`h-2.5 w-2.5 rounded-full ${nodeStatusStyles[node.status]}`} />
                  {node.name}
                </div>
                <span>Uptime {node.uptime}</span>
                <span>Latency {node.latency}</span>
                <span className="justify-self-start sm:justify-self-end">
                  {node.status === "online" ? "Healthy" : node.status === "degraded" ? "Degraded" : "Offline"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Activity</p>
              <p className="text-sm text-main-600">Latest field events</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-main-500">
              <i className="bi bi-clock" />
              Updated just now
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {activity.map((item) => (
              <div key={item.title} className="rounded-xl border border-main-100 bg-white/90 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-main-800">{item.title}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-main-600">{item.detail}</p>
                <p className="mt-2 text-[11px] text-main-400">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .dashboard-container {
          container-name: dashboard;
        }

        @container dashboard (min-width: 640px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @container dashboard (min-width: 880px) {
          .dashboard-top {
            grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          }

          .dashboard-bottom {
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          }
        }

        @container dashboard (min-width: 700px) {
          .dashboard-node-row {
            grid-template-columns: minmax(0, 1fr) auto auto auto;
          }
        }
      `}</style>
    </section>
  );
}
