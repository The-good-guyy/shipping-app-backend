import { SetMetadata } from '@nestjs/common';

export const POSSESSION_KEY = 'possession';
export const Roles = (possession: string) =>
  SetMetadata(POSSESSION_KEY, possession);
