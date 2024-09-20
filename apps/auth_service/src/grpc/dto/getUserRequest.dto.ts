import { GetUserRequest } from '@app/common';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class GetUserRequestDto implements GetUserRequest {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
