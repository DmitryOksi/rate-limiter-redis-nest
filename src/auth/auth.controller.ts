import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor() {}

  @ApiOperation({ summary: 'Get token payload' })
  @ApiOkResponse({
    description: 'the token payload',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'provide bearer token',
  })
  @ApiTooManyRequestsResponse({
    description: 'request limit reached',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user')
  getProfile(@User() user) {
    return user;
  }

  @ApiOperation({ summary: 'Get hello world' })
  @ApiOkResponse({
    description: 'get hello world',
  })
  @ApiTooManyRequestsResponse({
    description: 'request limit reached',
  })
  @Get('public-endpoint')
  getHelloWorld() {
    return 'hello world';
  }
}
