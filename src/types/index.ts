export type Role = "STAFF" | "MANAGER" | "OWNER";
export type Status = "ACTIVE" | "INACTIVE";
export type Shift = "DAY" | "NIGHT";

export interface JwtPayload {
  id: number;
  userId: string;
  role: Role;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export const YEARS = Array.from({ length: 10 }, (_, i) =>
  String(new Date().getFullYear() - 5 + i)
);
