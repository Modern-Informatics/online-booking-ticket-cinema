import { Role } from '@prisma/client';

export interface AccessTokenPayload {
  user_id: number;
  role: Role;
}

// export interface RefreshTokenPayload {
//   userId: number;
//   tokenVersion: number;
// }
