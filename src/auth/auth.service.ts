import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { User } from '../users/entities/users.entity';
import { UserService } from '../users/users.service';
import RefreshToken from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  private refreshTokens: RefreshToken[] = [];

  constructor(private readonly userService: UserService) {}

  private async newRefreshAndAccessToken(
    user: User,
    values: {
      userAgent: string;
      ipAddress: string;
    },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshObject = new RefreshToken({
      id:
        this.refreshTokens.length === 0
          ? 0
          : this.refreshTokens[this.refreshTokens.length - 1].id + 1,
      ...values,
      userId: user.id,
    });
    // add refreshObject in your db in real app
    this.refreshTokens.push(refreshObject);

    return {
      refreshToken: refreshObject.sign(),
      accessToken: sign({ userId: user.id }, process.env.ACCESS_SECRET, {
        expiresIn: '1h',
      }),
    };
  }

  async refresh(refreshStr: string): Promise<string | undefined> {
    // todo: create this function
    const refreshToken = await this.retrieveRefreshToken(refreshStr);

    if (!refreshToken) {
      return undefined;
    }

    const user = await this.userService.findOne(refreshToken.userId);

    if (!user) {
      return undefined;
    }

    const accessToken = {
      userdId: refreshToken.userId,
    };

    return sign(accessToken, process.env.ACCESS_SECRET, { expires: '1h' });
  }

  async login(
    email: string,
    password: string,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return undefined;
    }
    if (user.password !== password) {
      return undefined;
    }

    return this.newRefreshAndAccessToken(user, values);
  }

  async retrieveRefreshToken(
    refreshStr: string,
  ): Promise<RefreshToken | undefined> {
    try {
      const decoded = verify(refreshStr, process.env.REFRESH_SECRET);
      if (typeof decoded === 'string') {
        return undefined;
      }

      return Promise.resolve(
        this.refreshTokens.find((token) => token.id === decoded.id),
      );
    } catch (err) {
      return undefined;
    }
  }

  async logout(refreshStr: string): Promise<void> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);

    if (!refreshToken) {
      return;
    }

    // delete refreshToken from db
    this.refreshTokens.filter((token) => refreshToken.id !== token.id);
  }
}
