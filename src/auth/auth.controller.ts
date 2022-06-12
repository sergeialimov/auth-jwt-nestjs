import { Body, Controller, Delete, Ip, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // todo: create the LoginDTo
  async login(@Req() request, @Ip() ip: string, @Body() body: LoginDto) {
    // getting the username and ip address from @Req decorator and @Ip decorator imported at the top

    return this.authService.login(body.email, body.password, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @Post('refresh')
  // todo: create refreshTokenDto
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Delete('logout')
  // todo: create refreshTokenDto
  async logout(@Body() body: RefreshTokenDto) {
    return this.authService.logout(body.refreshToken);
  }
}
