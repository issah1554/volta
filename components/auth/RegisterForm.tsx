"use client";

interface RegisterFormProps {
    onSubmit: () => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
    return (
        <form
            className="space-y-4"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
        >
            <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-main-600">
                    Full name
                </label>
                <input
                    type="text"
                    className="w-full rounded-lg border border-main/30 bg-white/90 px-3 py-2 text-sm text-main-800 outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Jane Doe"
                />
            </div>
            <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-main-600">
                    Email
                </label>
                <input
                    type="email"
                    className="w-full rounded-lg border border-main/30 bg-white/90 px-3 py-2 text-sm text-main-800 outline-none focus:ring-2 focus:ring-accent"
                    placeholder="you@example.com"
                />
            </div>
            <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-main-600">
                    Password
                </label>
                <input
                    type="password"
                    className="w-full rounded-lg border border-main/30 bg-white/90 px-3 py-2 text-sm text-main-800 outline-none focus:ring-2 focus:ring-accent"
                    placeholder="••••••••"
                />
            </div>
            <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-main-600">
                    Confirm password
                </label>
                <input
                    type="password"
                    className="w-full rounded-lg border border-main/30 bg-white/90 px-3 py-2 text-sm text-main-800 outline-none focus:ring-2 focus:ring-accent"
                    placeholder="••••••••"
                />
            </div>
            <button
                type="submit"
                className="w-full rounded-lg bg-main-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-main-700"
            >
                Register
            </button>
        </form>
    );
}
