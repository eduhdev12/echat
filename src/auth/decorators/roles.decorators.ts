import { SetMetadata } from '@nestjs/common';

export enum Role {
    USER = "USER",
    PREMIUM = "PREMIUM"
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);