/** The authenticated user attached to each request by JwtAuthGuard. */
export interface AuthUser {
  id: number;
  username: string;
}

export interface JwtPayload {
  sub: number;
  username: string;
}
