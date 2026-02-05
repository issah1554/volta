import { apiRequest } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { UserRow, UserStatus } from "@/components/UserManagement";

type UsersResponse = ApiResponse<RemoteUser[]>;

type RemoteUser = {
  public_id: string;
  full_name?: string | null;
  email?: string | null;
  role?: string | null;
  is_active?: boolean | null;
  is_email_verified?: boolean | null;
  created_at?: string | null;
};

function mapStatus(user: RemoteUser): UserStatus {
  if (user.is_active === false) return "disabled";
  if (user.is_email_verified === false) return "pending";
  return "online";
}

function mapUser(user: RemoteUser): UserRow {
  const name = user.full_name?.trim() || user.email?.trim() || "Unknown user";
  const role = user.role?.trim() || "unknown";

  return {
    id: user.public_id,
    name,
    email: user.email ?? "",
    role,
    status: mapStatus(user),
    lastActive: user.created_at ?? "",
  };
}

export async function fetchUsers(): Promise<UserRow[]> {
  const response = await apiRequest<UsersResponse>("/users", { method: "GET" });
  const users = Array.isArray(response.data) ? response.data : [];
  return users.map(mapUser);
}

export async function deleteUser(userId: string, confirmId: string): Promise<void> {
  await apiRequest<ApiResponse<unknown>>(`/users/${userId}`, {
    method: "DELETE",
    body: JSON.stringify({ confirm: confirmId }),
  });
}
