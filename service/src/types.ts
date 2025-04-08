export interface UserResponse {
  userId: string;
  name: string;
  role?: string;
}

export interface ErrorResponse {
  error: string;
  status: number;
  timestamp: string;
}
