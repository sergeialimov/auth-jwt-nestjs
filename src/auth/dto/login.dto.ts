import { isEmail, isNotEmpty } from 'class-validator';

export class LoginDto {
  @isEmail()
  email: string;

  @isNotEmpty()
  password: string;
}
