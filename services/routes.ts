import { apiRequest } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { RouteRow, RouteStatus } from "@/components/Routes";

type RoutesResponse = ApiResponse<RemoteRoute[]>;

type RemoteRoute = {
  id: number | string;
  code?: string | null;
  name?: string | null;
  geometry?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

function mapStatus(route: RemoteRoute): RouteStatus {
  return route.is_active === false ? "inactive" : "active";
}

function mapRoute(route: RemoteRoute): RouteRow {
  const code = route.code?.trim() || undefined;
  const name = route.name?.trim() || code || "Unnamed route";
  const updatedAt = route.created_at ?? "";

  return {
    id: String(route.id),
    code,
    name,
    geometry: route.geometry ?? null,
    status: mapStatus(route),
    updatedAt,
    nodes: [],
  };
}

export async function fetchRoutes(searchQuery?: string): Promise<RouteRow[]> {
  const params = new URLSearchParams();
  const trimmedQuery = searchQuery?.trim();
  if (trimmedQuery) params.set("q", trimmedQuery);
  const queryString = params.toString();
  const path = queryString ? `/routes?${queryString}` : "/routes";
  const response = await apiRequest<RoutesResponse>(path, { method: "GET" });
  const routes = Array.isArray(response.data) ? response.data : [];
  return routes.map(mapRoute);
}

export async function deleteRoute(routeId: string): Promise<void> {
  await apiRequest<ApiResponse<unknown>>(`/routes/${routeId}`, {
    method: "DELETE",
  });
}
