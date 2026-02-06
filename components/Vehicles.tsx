"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/services/apiClient";
import { createVehicle, deleteVehicle, fetchVehicles } from "@/services/vehicles";
import Swal from "sweetalert2";
import { Toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";

export type VehicleStatus = "active" | "idle" | "maintenance" | "offline" | "unknown";

export type VehicleRow = {
  id: string;
  plateNumber: string;
  type: string;
  capacity: number | null;
  status: VehicleStatus;
  createdAt?: string;
};

export interface VehiclesProps {
  title?: string;
  subtitle?: string;
}

const statusPill: Record<VehicleStatus, string> = {
  active: "bg-success-50 text-success-700 border-success-200",
  idle: "bg-warning-50 text-warning-700 border-warning-200",
  maintenance: "bg-info-50 text-info-700 border-info-200",
  offline: "bg-danger-50 text-danger-700 border-danger-200",
  unknown: "bg-main-100 text-main-700 border-main-200",
};

export default function Vehicles({
  title = "Vehicle management",
  subtitle = "Fleet status, availability, and route assignments.",
}: VehiclesProps) {
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formValues, setFormValues] = useState({
    plateNumber: "",
    capacity: "",
    type: "",
    status: "active",
  });

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchVehicles()
      .then((data) => {
        if (!isMounted) return;
        setVehicles(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        const message =
          err instanceof ApiError ? err.message : "Unable to load vehicles right now.";
        setError(message);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest?.("[data-vehicle-menu]")) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function resetForm() {
    setFormValues({
      plateNumber: "",
      capacity: "",
      type: "",
      status: "active",
    });
  }

  async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCreating) return;

    const plateNumber = formValues.plateNumber.trim();
    const type = formValues.type.trim();
    const capacity = Number(formValues.capacity);
    const status = formValues.status;

    if (!plateNumber || !type || !Number.isFinite(capacity)) {
      Toast.fire({ icon: "error", title: "Fill all fields with valid values." });
      return;
    }

    setIsCreating(true);
    try {
      const created = await createVehicle({
        plate_number: plateNumber,
        capacity,
        type,
        status,
      });

      if (created) {
        setVehicles((prev) => [
          {
            id: created.plate_number,
            plateNumber: created.plate_number,
            type: created.type?.trim() || type,
            capacity: typeof created.capacity === "number" ? created.capacity : capacity,
            status: (created.status?.trim().toLowerCase() as VehicleStatus) || "unknown",
            createdAt: created.created_at ?? undefined,
          },
          ...prev,
        ]);
      } else {
        setVehicles((prev) => [
          {
            id: plateNumber,
            plateNumber,
            type,
            capacity,
            status: status as VehicleStatus,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      Toast.fire({ icon: "success", title: "Vehicle created." });
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to create vehicle right now.";
      setError(message);
      Toast.fire({ icon: "error", title: message });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(vehicle: VehicleRow) {
    if (deletingId) return;
    const result = await Swal.fire({
      title: "Delete vehicle?",
      html: "Type <strong>DELETE</strong> to confirm.",
      input: "text",
      inputLabel: "Confirm message",
      inputPlaceholder: "DELETE",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value || value.trim() !== "DELETE") {
          return "Confirmation must be DELETE.";
        }
        return null;
      },
    });

    if (!result.isConfirmed) return;
    const confirmMessage = String(result.value ?? "").trim();

    setDeletingId(vehicle.id);
    try {
      await deleteVehicle(vehicle.plateNumber, confirmMessage);
      setVehicles((prev) => prev.filter((item) => item.id !== vehicle.id));
      if (openMenuId === vehicle.id) {
        setOpenMenuId(null);
      }
      Toast.fire({ icon: "success", title: "Vehicle deleted." });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to delete vehicle right now.";
      setError(message);
      Toast.fire({ icon: "error", title: message });
    } finally {
      setDeletingId(null);
    }
  }

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
            onClick={() => setIsCreateOpen(true)}
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
        {isLoading ? (
          <div className="rounded-xl border border-main-100 bg-white/90 px-4 py-4 text-sm text-main-600">
            Loading vehicles...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-danger-100 bg-danger-50 px-4 py-4 text-sm text-danger-700">
            {error}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-xl border border-main-100 bg-white/90 px-4 py-4 text-sm text-main-600">
            No vehicles found.
          </div>
        ) : (
          <div className="grid gap-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="vehicle-row grid items-center gap-3 rounded-xl border border-main-100 bg-white/90 px-3 py-3 text-xs text-main-600"
              >
                <div>
                  <p className="text-sm font-semibold text-main-900">{vehicle.plateNumber}</p>
                  <p className="text-xs text-main-500">{vehicle.type}</p>
                </div>
                <div>
                  <p className="text-xs text-main-500">Capacity</p>
                  <p className="text-sm text-main-800">
                    {vehicle.capacity ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-main-500">Created</p>
                  <p className="text-sm text-main-800">{vehicle.createdAt ?? "—"}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusPill[vehicle.status]}`}>
                    {vehicle.status}
                  </span>
                  <div className="relative" data-vehicle-menu>
                    <button
                      type="button"
                      aria-label="Vehicle actions"
                      aria-expanded={openMenuId === vehicle.id}
                      onClick={() => setOpenMenuId((prev) => (prev === vehicle.id ? null : vehicle.id))}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-main-200 bg-white text-main-700 transition hover:border-primary-300 hover:text-primary-700"
                    >
                      <i className="bi bi-three-dots-vertical text-sm" />
                    </button>
                    {openMenuId === vehicle.id ? (
                      <div className="absolute right-0 top-9 z-10 w-40 rounded-lg border border-main-100 bg-white/95 p-1 text-xs shadow-lg backdrop-blur-sm">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-main-700 transition hover:bg-main-50"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <i className="bi bi-pencil-square" />
                          Edit vehicle
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-main-700 transition hover:bg-main-50"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <i className="bi bi-share-fill" />
                          Share
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-danger-700 transition hover:bg-danger-50"
                          disabled={deletingId === vehicle.id}
                          onClick={() => handleDelete(vehicle)}
                        >
                          <i className="bi bi-trash" />
                          {deletingId === vehicle.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
            grid-template-columns: minmax(0, 1.2fr) repeat(2, minmax(0, 0.8fr)) minmax(0, 0.5fr);
          }
        }
      `}</style>
      <Modal
        open={isCreateOpen}
        onClose={() => {
          if (isCreating) return;
          setIsCreateOpen(false);
        }}
        size="md"
        className="rounded-2xl border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-main-900">Add vehicle</h3>
            <p className="text-sm text-main-600">Provide plate number, capacity, type, and status.</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-main-200 text-main-600 transition hover:bg-main-50"
            onClick={() => {
              if (isCreating) return;
              setIsCreateOpen(false);
            }}
          >
            <i className="bi bi-x-lg text-sm" />
          </button>
        </div>
        <form className="mt-4 grid gap-3" onSubmit={handleCreateSubmit}>
          <label className="grid gap-1 text-xs text-main-600">
            Plate number
            <input
              type="text"
              value={formValues.plateNumber}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, plateNumber: event.target.value }))
              }
              className="rounded-xl border border-main-200 bg-white px-3 py-2 text-sm text-main-900 focus:border-primary-400 focus:outline-none"
              placeholder="T-021-AYC"
              required
            />
          </label>
          <label className="grid gap-1 text-xs text-main-600">
            Capacity
            <input
              type="number"
              min={1}
              value={formValues.capacity}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, capacity: event.target.value }))
              }
              className="rounded-xl border border-main-200 bg-white px-3 py-2 text-sm text-main-900 focus:border-primary-400 focus:outline-none"
              placeholder="30"
              required
            />
          </label>
          <label className="grid gap-1 text-xs text-main-600">
            Type
            <input
              type="text"
              value={formValues.type}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, type: event.target.value }))
              }
              className="rounded-xl border border-main-200 bg-white px-3 py-2 text-sm text-main-900 focus:border-primary-400 focus:outline-none"
              placeholder="daladala"
              required
            />
          </label>
          <label className="grid gap-1 text-xs text-main-600">
            Status
            <select
              value={formValues.status}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, status: event.target.value }))
              }
              className="rounded-xl border border-main-200 bg-white px-3 py-2 text-sm text-main-900 focus:border-primary-400 focus:outline-none"
            >
              <option value="active">active</option>
              <option value="idle">idle</option>
              <option value="maintenance">maintenance</option>
              <option value="offline">offline</option>
            </select>
          </label>
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-full border border-main-200 px-4 py-2 text-xs text-main-700 transition hover:bg-main-50"
              onClick={() => {
                if (isCreating) return;
                setIsCreateOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full border border-primary-200 bg-primary-600 px-4 py-2 text-xs text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isCreating}
            >
              {isCreating ? "Saving..." : "Save vehicle"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
