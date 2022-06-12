import { isNotEmpty } from 'class-validator';

class RefreshTokenDto {
  @isNotEmpty()
  refreshToken: string;
}

export default RefreshTokenDto;
