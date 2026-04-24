export const Roles = {
  STUDENT: 'STUDENT',
  CAFETERIA: 'CAFETERIA',
  ADMIN: 'ADMIN'
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
