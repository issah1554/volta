export type IsoTimestamp = string;

export interface ApiResponse<TData = unknown, TMeta = unknown> {
  success: boolean;
  timestamp: number;
  message?: string;
  data?: TData;
  meta?: TMeta;
}
