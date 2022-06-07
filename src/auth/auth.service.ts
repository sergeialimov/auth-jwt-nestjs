import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private RefreshTokens: RefreshToken[] = [];

  constructor(private readonly userService: UserService) {
    this.userService = userService();
  }

  async login(
    email: string,
    password: string,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
    const user = await this.UserService.findByEmail(email);
    if (!user) {
      return undefined;
    }
    if (user.password !== password) {
      return undefined;
    }
    // to be implemented
    return this.newRefreshAccessToken(user, values);
  }
}
