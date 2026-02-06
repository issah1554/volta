 "use client";

import { useEffect, useMemo, useState } from "react";
import { fetchRoutes } from "@/services/routes";
import { ApiError } from "@/services/apiClient";

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
  searchQuery?: string;
}

const statusPill: Record<RouteStatus, string> = {
  active: "bg-success-50 text-success-700 border-success-200",
  inactive: "bg-secondary-50 text-secondary-700 border-secondary-200",
};

export default function Routes({
  title = "Route definitions",
  subtitle = "Routes composed of ordered nodes and assignments.",
  routes,
  searchQuery = "",
}: RoutesProps) {
  const [routeRows, setRouteRows] = useState<RouteRow[]>(routes ?? []);
  const [isLoading, setIsLoading] = useState(!routes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (routes) {
      setRouteRows(routes);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    const handle = window.setTimeout(() => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);

      fetchRoutes(searchQuery)
        .then((data) => {
          if (!isMounted) return;
          setRouteRows(data);
        })
        .catch((err) => {
          if (!isMounted) return;
          const message =
            err instanceof ApiError ? err.message : "Unable to load routes right now.";
          setError(message);
        })
        .finally(() => {
          if (!isMounted) return;
          setIsLoading(false);
        });
    }, 500);

    return () => {
      isMounted = false;
      window.clearTimeout(handle);
    };
  }, [routes, searchQuery]);

  const visibleRoutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return routeRows;

    return routeRows.filter((route) => {
      const nameMatch = route.name.toLowerCase().includes(q);
      const codeMatch = route.code?.toLowerCase().includes(q) ?? false;
      return nameMatch || codeMatch;
    });
  }, [routeRows, searchQuery]);

  const showNoMatches =
    !!searchQuery.trim() && routeRows.length > 0 && visibleRoutes.length === 0;

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
        {isLoading ? (
          <div className="rounded-xl border border-main-100 bg-white/90 px-4 py-4 text-sm text-main-600">
            Loading routes...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-danger-100 bg-danger-50 px-4 py-4 text-sm text-danger-700">
            {error}
          </div>
        ) : routeRows.length === 0 ? (
          <div className="rounded-xl border border-main-100 bg-white/90 px-4 py-4 text-sm text-main-600">
            No routes found.
          </div>
        ) : showNoMatches ? (
          <div className="rounded-xl border border-main-100 bg-white/90 px-4 py-4 text-sm text-main-600">
            No routes match &quot;{searchQuery.trim()}&quot;.
          </div>
        ) : (
          <div className="grid gap-3">
            {visibleRoutes.map((route) => (
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
                  <p className="text-xs text-main-500">Nodes</p>
                  <p className="text-sm text-main-800">{route.nodes.length}</p>
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
                {route.nodes.length > 0 ? (
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
                ) : (
                  <div className="route-nodes col-span-full rounded-lg border border-main-100 bg-white/70 px-3 py-2 text-xs text-main-500">
                    No nodes available.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
