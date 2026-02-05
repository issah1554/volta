"use client";

import { useState } from "react";
import { register } from "@/services/auth";
import { ApiError } from "@/services/apiClient";
import { Toast } from "@/components/ui/Toast";

interface RegisterFormProps {
  onSubmit: () => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        if (password !== confirmPassword) {
          Toast.fire({ icon: "error", title: "Passwords do not match." });
          return;
        }

        try {
          setIsSubmitting(true);
          await register({
            full_name: fullName,
            email,
            password,
            password_confirm: confirmPassword,
          });
          Toast.fire({ icon: "success", title: "Account created successfully." });
          onSubmit();
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Unable to register right now.";
          Toast.fire({ icon: "error", title: message });
        } finally {
          setIsSubmitting(false);
        }
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
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
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
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
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
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-main-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-main-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Register"}
      </button>
    </form>
  );
}
