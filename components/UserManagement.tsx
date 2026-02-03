import Avatar from "@/components/ui/Avatar";
import { useEffect, useState } from "react";

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
  users?: UserRow[];
  onViewProfile?: (user: UserRow) => void;
}

const defaultUsers: UserRow[] = [
  {
    id: "u-1",
    name: "Amina Yusuf",
    email: "amina.yusuf@volta.io",
    role: "Dispatcher",
    status: "online",
    lastActive: "Active now",
    location: "Dar es Salaam",
  },
  {
    id: "u-2",
    name: "Tomas Reed",
    email: "t.reed@volta.io",
    role: "Field Ops",
    status: "pending",
    lastActive: "5 min ago",
    location: "Port Line",
  },
  {
    id: "u-3",
    name: "Zuri Mwita",
    email: "z.mwita@volta.io",
    role: "Admin",
    status: "online",
    lastActive: "2 min ago",
    location: "HQ",
  },

];

const statusPill: Record<UserStatus, string> = {
  online: "bg-success-50 text-success-700 border-success-200",
  offline: "bg-secondary-50 text-secondary-700 border-secondary-200",
  disabled: "bg-danger-50 text-danger-700 border-danger-200",
  pending: "bg-warning-50 text-warning-700 border-warning-200",
};

export default function UserManagement({
  users = defaultUsers,
  onViewProfile,
}: UserManagementProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
                      >
                        <i className="bi bi-slash-circle" />
                        Disable
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
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
