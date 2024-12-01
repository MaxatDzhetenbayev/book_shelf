import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber('KZ')
  phone: string;

  @IsString()
  @Length(8)
  password: string;
}
