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
  geometry?: string | null;
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
  showActions?: boolean;
  onRouteSelect?: (route: RouteRow) => void;
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
  showActions = true,
  onRouteSelect,
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
    }, 250);

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
      className="routes-panel flex h-full w-full flex-col text-main-800"
      style={{ containerType: "inline-size" }}
    >
      {showActions ? (
        <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">

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

      ) : null}

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
        <div className="grid">
          {visibleRoutes.map((route) => (
            <div
              key={route.id}
              className="route-row grid items-center gap-3 rounded-0 border-b border-main-300 bg-white/90 px-3 py-3 text-xs text-main-600 transition-colors duration-200 cursor-pointer hover:bg-main-200"
              role="button"
              tabIndex={0}
              onClick={() => onRouteSelect?.(route)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onRouteSelect?.(route);
                }
              }}
            >
              <div>
                <p className="text-sm font-semibold text-main-900">{route.name}</p>
                <p className="text-xs text-main-500">
                  {route.code ? `Code: ${route.code}` : "No code"}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusPill[route.status]}`}>
                  {route.status}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

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
