import { SetMetadata } from '@nestjs/common';
import 'reflect-metadata';

export const Roles = (roles: string[]) => {
  return SetMetadata('roles', roles);
};
