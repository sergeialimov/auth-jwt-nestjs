import { Injectable } from '@nestjs/common';
import { sign } from 'crypto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import RefreshToken from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  private RefreshTokens: RefreshToken[] = [];

  constructor(private readonly userService: UserService) {
    this.userService = userService();
  }

  private async newRefreshAndAccessToken(
    user: User,
    values: {
      userAgent: string;
      ipAddress: string;
    },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshObject = new RefreshToken({
      id:
        this.refreshToken.length === 0
          ? 0
          : this.refreshTokens[this.refreshTokens.lengh - 1].id + 1,
      ...values,
      userId: user.id,
    });
    // add refreshObject in your db in real app
    this.refreshTokens.push(refreshObject);

    return {
      refreshToken: refreshObject.sign(),
      accesToken: sign({ userId: user.id }, process.env.ACCESS_SECRET, {
        expiresIn: '1h',
      }),
    };
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
