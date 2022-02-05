import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //jwt example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJkem1pdHJ5LmFrc2lvbmF1QGlubm93aXNlLWdyb3VwLmNvbSIsImlhdCI6MX0.UrApZ95z4Ay3UK5_95zQB_BYCbMJKObAWkds4M4FNxA
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
