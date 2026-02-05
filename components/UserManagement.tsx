import Avatar from "@/components/ui/Avatar";
import { useEffect, useState } from "react";
import { deleteUser, fetchUsers } from "@/services/users";
import { ApiError } from "@/services/apiClient";
import Swal from "sweetalert2";
import { Toast } from "@/components/ui/Toast";

export type UserStatus = "online" | "offline" | "disabled" | "pending";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  lastActive: string;
  location?: string;
  avatarUrl?: string;
};

export interface UserManagementProps {
  title?: string;
  subtitle?: string;
  onViewProfile?: (user: UserRow) => void;
}

const statusPill: Record<UserStatus, string> = {
  online: "bg-success-50 text-success-700 border-success-200",
  offline: "bg-secondary-50 text-secondary-700 border-secondary-200",
  disabled: "bg-danger-50 text-danger-700 border-danger-200",
  pending: "bg-warning-50 text-warning-700 border-warning-200",
};

export default function UserManagement({
  onViewProfile,
}: UserManagementProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest?.("[data-user-menu]")) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchUsers()
      .then((data) => {
        if (!isMounted) return;
        setUsers(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        const message =
          err instanceof ApiError ? err.message : "Unable to load users right now.";
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

  async function handleDelete(user: UserRow) {
    if (deletingId) return;
    const result = await Swal.fire({
      title: "Delete user?",
      html: `Type the user ID to confirm:<br><strong>${user.id}</strong>`,
      input: "text",
      inputLabel: "User ID",
      inputPlaceholder: user.id,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value || value.trim() !== user.id) {
          return "User ID does not match.";
        }
        return null;
      },
    });

    if (!result.isConfirmed) return;
    const confirmId = String(result.value ?? "").trim();

    setDeletingId(user.id);
    try {
      await deleteUser(user.id, confirmId);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      if (openMenuId === user.id) {
        setOpenMenuId(null);
      }
      Toast.fire({ icon: "success", title: "User deleted." });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to delete user right now.";
      setError(message);
      Toast.fire({ icon: "error", title: message });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section
      className="user-management flex h-full w-full flex-col gap-5 text-main-800"
      style={{ containerType: "inline-size" }}
    >
      <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-medium text-main-800">
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-main-600">
              <div className="flex items-center gap-2 rounded-full border border-main-200 bg-white px-3 py-2">
                <i className="bi bi-search" />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-main-200 bg-white px-3 py-2">
                <i className="bi bi-person-plus" />
                Add user
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-main-100 bg-white/90 px-4 py-4 text-sm text-main-600">
              Loading users...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-danger-100 bg-danger-50 px-4 py-4 text-sm text-danger-700">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-xl border border-main-100 bg-white/90 px-4 py-4 text-sm text-main-600">
              No users found.
            </div>
          ) : (
            <div className="grid gap-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="user-row relative grid items-center gap-3 rounded-xl border border-main-100 bg-white/90 px-3 py-3 text-xs text-main-600"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      alt={user.name}
                      initials={user.name}
                      src={user.avatarUrl}
                      status={user.status}
                      size={44}
                    />
                    <div>
                      <p className="text-sm font-semibold text-main-900">{user.name}</p>
                      <p className="text-xs text-main-500">{user.email}</p>
                      <p className="text-xs font-medium text-main-600">{user.role}</p>
                    </div>
                  </div>
                  <div className="absolute right-3 top-3" data-user-menu>
                    <button
                      type="button"
                      aria-label="More actions"
                      aria-expanded={openMenuId === user.id}
                      onClick={() => setOpenMenuId((prev) => (prev === user.id ? null : user.id))}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-main-200 bg-white text-main-700 transition hover:border-primary-300 hover:text-primary-700"
                    >
                      <i className="bi bi-three-dots-vertical text-sm" />
                    </button>
                    {openMenuId === user.id ? (
                      <div className="absolute right-0 top-9 z-10 w-40 rounded-lg border border-main-100 bg-white/95 p-1 text-xs shadow-lg backdrop-blur-sm">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-main-700 transition hover:bg-main-50"
                          onClick={() => {
                            onViewProfile?.(user);
                            setOpenMenuId(null);
                          }}
                        >
                          <i className="bi bi-person" />
                          View profile
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-main-700 transition hover:bg-main-50"
                        >
                          <i className="bi bi-pencil-square" />
                          Edit user
                        </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-danger-700 transition hover:bg-danger-50"
                        disabled={deletingId === user.id}
                        onClick={() => handleDelete(user)}
                      >
                        <i className="bi bi-trash" />
                        {deletingId === user.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      <style jsx>{`
        .user-management {
          container-name: user-management;
        }

        .user-row {
          grid-template-columns: 1fr;
        }

        @container user-management (min-width: 700px) {
          .user-row {
            grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.6fr);
          }
        }
      `}</style>
    </section>
  );
}
