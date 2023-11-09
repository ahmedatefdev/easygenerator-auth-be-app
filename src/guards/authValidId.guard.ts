import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { isValidHexOrUint8Array } from 'src/utils';

export class AuthValidId implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!isValidHexOrUint8Array(request.params.id)) {
      throw new BadRequestException();
    }
    return true;
  }
}
