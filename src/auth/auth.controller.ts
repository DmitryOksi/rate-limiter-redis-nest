import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('private-endpoint')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('public-endpoint')
  getRedisCash() {
    return 'hello world';
  }
}
