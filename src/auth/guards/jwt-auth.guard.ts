import { Injectable, AuthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, context: any, info: any, status: any) {
    if (info instanceof JsonWebTokenError) {
      throw new AuthorizedException('Invalid JWT');
    }
  }

  return super.handleRequest(err, user, info, context, status); 
}
