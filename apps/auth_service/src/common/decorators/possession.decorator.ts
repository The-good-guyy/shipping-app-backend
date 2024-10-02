import { SetMetadata } from '@nestjs/common';

export const POSSESSION_KEY = 'possession';
export const Possessions = (possession: string) =>
  SetMetadata(POSSESSION_KEY, possession);
