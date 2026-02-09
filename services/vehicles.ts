import { apiRequest } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { VehicleRow, VehicleStatus } from "@/components/Vehicles";

type VehiclesResponse = ApiResponse<RemoteVehicle[]>;

type RemoteVehicle = {
  id?: number | null;
  vehicle_id?: number | null;
  plate_number: string;
  capacity?: number | null;
  type?: string | null;
  status?: string | null;
  created_at?: string | null;
};

const knownStatuses = new Set(["active", "inactive", "maintenance"]);

function mapStatus(status?: string | null): VehicleStatus {
  if (!status) return "unknown";
  const normalized = status.trim().toLowerCase();
  if (knownStatuses.has(normalized)) {
    return normalized as VehicleStatus;
  }
  return "unknown";
}

function mapVehicle(vehicle: RemoteVehicle): VehicleRow {
  const vehicleId =
    typeof vehicle.id === "number"
      ? vehicle.id
      : typeof vehicle.vehicle_id === "number"
        ? vehicle.vehicle_id
        : Number.NaN;

  return {
    id: vehicle.plate_number,
    vehicleId,
    plateNumber: vehicle.plate_number,
    type: vehicle.type?.trim() || "unknown",
    capacity: typeof vehicle.capacity === "number" ? vehicle.capacity : null,
    status: mapStatus(vehicle.status),
    createdAt: vehicle.created_at ?? undefined,
  };
}

export async function fetchVehicles(): Promise<VehicleRow[]> {
  const response = await apiRequest<VehiclesResponse>("/vehicles", { method: "GET" });
  const vehicles = Array.isArray(response.data) ? response.data : [];
  return vehicles.map(mapVehicle);
}

export async function deleteVehicle(plateNumber: string, confirmMessage: string): Promise<void> {
  await apiRequest<ApiResponse<unknown>>(`/vehicles/${plateNumber}`, {
    method: "DELETE",
    body: JSON.stringify({ confirm: confirmMessage }),
  });
}

export type CreateVehiclePayload = {
  plate_number: string;
  capacity: number;
  type: string;
  status: string;
  route_id: number | string;
};

export async function createVehicle(payload: CreateVehiclePayload): Promise<RemoteVehicle | null> {
  const response = await apiRequest<ApiResponse<RemoteVehicle>>("/vehicles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data ?? null;
}
