"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteRoute, fetchRoutes } from "@/services/routes";
import { ApiError } from "@/services/apiClient";
import { DropdownMenu } from "@/components/ui/Dropdown";
import { Toast } from "@/components/ui/Toast";

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
  selectedRouteId?: string | null;
  onRouteSelect?: (route: RouteRow) => void;
  onEditRoute?: (route: RouteRow) => void;
  onDeleteRoute?: (route: RouteRow) => void;
  onNewRoute?: () => void;
  onAddNodes?: () => void;
}

const statusPill: Record<RouteStatus, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100/60",
  inactive:
    "border-slate-200 bg-slate-50 text-slate-700 ring-1 ring-slate-100/60",
};

export default function Routes({
  title = "Routes",
  subtitle,
  routes,
  searchQuery = "",
  showActions = true,
  selectedRouteId = null,
  onRouteSelect,
  onEditRoute,
  onDeleteRoute,
  onNewRoute,
  onAddNodes,
}: RoutesProps) {
  const [routeRows, setRouteRows] = useState<RouteRow[]>(routes ?? []);
  const [isLoading, setIsLoading] = useState(!routes);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
            err instanceof ApiError
              ? err.message
              : "Unable to load routes right now.";
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

  async function handleDelete(route: RouteRow) {
    if (deletingId) return;
    const confirmDelete = window.confirm(`Delete route "${route.name}"?`);
    if (!confirmDelete) return;

    setDeletingId(route.id);
    try {
      await deleteRoute(route.id);
      setRouteRows((prev) => prev.filter((item) => item.id !== route.id));
      Toast.fire({ icon: "success", title: "Route deleted." });
      onDeleteRoute?.(route);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to delete route right now.";
      setError(message);
      Toast.fire({ icon: "error", title: message });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="flex h-full w-full flex-col text-slate-800">
      {/* Header */}
      {showActions ? (
        <header className="mb-3 p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0"></div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={onNewRoute}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700  transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
              >
                <i className="bi bi-signpost" />
                New route
              </button>

              <button
                type="button"
                onClick={onAddNodes}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 font-medium text-indigo-700  transition hover:border-indigo-300 hover:bg-indigo-100 active:scale-[0.98]"
              >
                <i className="bi bi-diagram-3" />
                Add nodes
              </button>
            </div>
          </div>
        </header>
      ) : null}

      {/* States */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 ">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
            Loading routes...
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700 ">
          {error}
        </div>
      ) : routeRows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 ">
          No routes found.
        </div>
      ) : showNoMatches ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 ">
          No routes match &quot;{searchQuery.trim()}&quot;.
        </div>
      ) : (
          <ul className="divide-y divide-slate-200">
            {visibleRoutes.map((route) => {
              const isSelected = selectedRouteId === route.id;

              return (
                <li key={route.id}>
                  <div
                    role="button" tabIndex={0} onClick={() => onRouteSelect?.(route)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRouteSelect?.(route);
                      }
                    }}
                    className={[
                      "group relative flex items-center gap-3 px-4 py-5 text-left transition",
                      "hover:cursor-pointer",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60",
                      "hover:bg-primary-50",
                      isSelected ? "bg-primary-100" : "",
                    ].join(" ")}
                  >
                    {/* Selected indicator */}
                    <span
                      className={[
                        "absolute left-0 top-0 h-full w-1 rounded-r",
                        isSelected ? "bg-indigo-500" : "bg-transparent",
                      ].join(" ")}
                      aria-hidden="true"
                    />

                    {/* Main */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {route.name}
                        </p>
                        {route.code ? (
                          <span className="truncate rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            {route.code}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <i className="bi bi-diagram-2" />
                          {route.nodes?.length ?? 0} nodes
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <i className="bi bi-clock" />
                          Updated {new Date(route.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                          statusPill[route.status],
                        ].join(" ")}
                      >
                        {route.status}
                      </span>

                      {showActions ? (
                        <div onClick={(event) => event.stopPropagation()}>
                          <DropdownMenu
                            openMode="click"
                            toggler={
                              <button
                                type="button"
                                aria-label="Route actions"
                                className={[
                                  "inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white text-slate-700  transition",
                                  "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60",
                                ].join(" ")}
                              >
                                <i className="bi bi-three-dots-vertical text-sm" />
                              </button>
                            }
                            items={[
                              {
                                label: "Edit route",
                                icon: <i className="bi bi-pencil-square" />,
                                onClick: () => onEditRoute?.(route),
                              },
                              {
                                label:
                                  deletingId === route.id
                                    ? "Deleting..."
                                    : "Delete route",
                                icon: <i className="bi bi-trash" />,
                                onClick: () => handleDelete(route),
                              },
                            ]}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
      )}
    </section>
  );
}
