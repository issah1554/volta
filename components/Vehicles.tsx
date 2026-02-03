export type VehicleStatus = "active" | "idle" | "maintenance" | "offline";

export type VehicleRow = {
  id: string;
  name: string;
  model: string;
  status: VehicleStatus;
  battery: number;
  lastPing: string;
  route?: string;
};

export interface VehiclesProps {
  title?: string;
  subtitle?: string;
  vehicles?: VehicleRow[];
}

const defaultVehicles: VehicleRow[] = [
  {
    id: "v-01",
    name: "Rover 12",
    model: "E-Transit",
    status: "active",
    battery: 86,
    lastPing: "1 min ago",
    route: "Port Line",
  },
  {
    id: "v-02",
    name: "Courier 7",
    model: "Volt Mini",
    status: "idle",
    battery: 62,
    lastPing: "6 min ago",
    route: "Warehouse Loop",
  },
  {
    id: "v-03",
    name: "Hauler 4",
    model: "Cargo GX",
    status: "maintenance",
    battery: 38,
    lastPing: "35 min ago",
    route: "North Ridge",
  },
  {
    id: "v-04",
    name: "Courier 9",
    model: "Volt Mini",
    status: "offline",
    battery: 0,
    lastPing: "3 hr ago",
    route: "City Center",
  },
];

const statusPill: Record<VehicleStatus, string> = {
  active: "bg-success-50 text-success-700 border-success-200",
  idle: "bg-warning-50 text-warning-700 border-warning-200",
  maintenance: "bg-info-50 text-info-700 border-info-200",
  offline: "bg-danger-50 text-danger-700 border-danger-200",
};

export default function Vehicles({
  title = "Vehicle management",
  subtitle = "Fleet status, availability, and route assignments.",
  vehicles = defaultVehicles,
}: VehiclesProps) {
  return (
    <section
      className="vehicles-panel flex h-full w-full flex-col gap-5 text-main-800"
      style={{ containerType: "inline-size" }}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Vehicles</p>
          <h2 className="text-2xl font-semibold text-main-900">{title}</h2>
          <p className="mt-1 text-sm text-main-600">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-main-600">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-main-200 bg-white px-3 py-2 text-main-700 transition hover:border-primary-300 hover:text-primary-700"
          >
            <i className="bi bi-plus-circle" />
            Add vehicle
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-2 text-primary-700"
          >
            <i className="bi bi-graph-up-arrow" />
            Analytics
          </button>
        </div>
      </header>

      <div className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="grid gap-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="vehicle-row grid items-center gap-3 rounded-xl border border-main-100 bg-white/90 px-3 py-3 text-xs text-main-600"
            >
              <div>
                <p className="text-sm font-semibold text-main-900">{vehicle.name}</p>
                <p className="text-xs text-main-500">{vehicle.model}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Route</p>
                <p className="text-sm text-main-800">{vehicle.route ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Battery</p>
                <div className="mt-1 h-2 rounded-full bg-main-100">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${Math.min(100, Math.max(0, vehicle.battery))}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-main-500">{vehicle.battery}%</p>
              </div>
              <div>
                <p className="text-xs text-main-500">Last ping</p>
                <p className="text-sm text-main-800">{vehicle.lastPing}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusPill[vehicle.status]}`}>
                  {vehicle.status}
                </span>
                <button
                  type="button"
                  aria-label="Vehicle actions"
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
        .vehicles-panel {
          container-name: vehicles-panel;
        }

        .vehicle-row {
          grid-template-columns: 1fr;
        }

        @container vehicles-panel (min-width: 720px) {
          .vehicle-row {
            grid-template-columns: minmax(0, 1.1fr) repeat(3, minmax(0, 0.7fr)) minmax(0, 0.5fr);
          }
        }
      `}</style>
    </section>
  );
}
