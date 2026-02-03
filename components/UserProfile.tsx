import Avatar from "@/components/ui/Avatar";
import type { UserRow } from "@/components/UserManagement";

export interface UserProfileProps {
  user: UserRow;
  onBack?: () => void;
}

const statusPill: Record<UserRow["status"], string> = {
  online: "bg-success-50 text-success-700 border-success-200",
  offline: "bg-secondary-50 text-secondary-700 border-secondary-200",
  disabled: "bg-danger-50 text-danger-700 border-danger-200",
  pending: "bg-warning-50 text-warning-700 border-warning-200",
};

export default function UserProfile({ user, onBack }: UserProfileProps) {
  return (
    <section className="flex h-full w-full flex-col gap-5 text-main-800">
      <header className="relative flex flex-wrap items-start gap-4 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        {/* Top-right: back action */}
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-main-200 bg-white px-3 py-2 text-xs text-main-700 transition hover:border-primary-300 hover:text-primary-700"
          >
            <i className="bi bi-arrow-left" />
            Back
          </button>
        ) : null}

        {/* Left: identity */}
        <div className="flex min-w-60 items-start gap-4">
          <Avatar
            alt={user.name}
            initials={user.name}
            src={user.avatarUrl}
            status={user.status}
            size={64}
          />

          <div className="min-w-0">
            <h2 className="truncate text-2xl font-semibold text-main-900">
              {user.name}
            </h2>
            <p className="mt-1 truncate text-sm text-main-600">{user.email}</p>
            <p className="mt-0.5 text-sm text-main-600">{user.role}</p>
          </div>
        </div>
      </header>


        <div className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Activity</p>
              <p className="text-sm text-main-600">Recent actions and access logs</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-main-200 bg-white px-3 py-1.5 text-xs text-main-700 transition hover:border-primary-300 hover:text-primary-700"
            >
              Export
            </button>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-main-700">
            <div className="rounded-xl border border-main-100 bg-white/90 px-3 py-3">
              <p className="font-medium text-main-900">Access review completed</p>
              <p className="mt-1 text-xs text-main-500">2 hours ago · Security team</p>
            </div>
            <div className="rounded-xl border border-main-100 bg-white/90 px-3 py-3">
              <p className="font-medium text-main-900">Role updated to {user.role}</p>
              <p className="mt-1 text-xs text-main-500">Yesterday · Admin console</p>
            </div>
            <div className="rounded-xl border border-main-100 bg-white/90 px-3 py-3">
              <p className="font-medium text-main-900">Last field sync</p>
              <p className="mt-1 text-xs text-main-500">{user.lastActive}</p>
            </div>
          </div>
        </div>
    </section>
  );
}
