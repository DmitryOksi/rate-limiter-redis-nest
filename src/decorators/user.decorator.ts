import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from 'src/auth/dto/user.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto => {
    const { user }: { user: UserDto } = ctx.switchToHttp().getRequest();
    return user;
  },
);
