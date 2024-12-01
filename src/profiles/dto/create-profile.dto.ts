import { IsNumber, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsNumber()
  user_id: number;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  place_of_residence: string;

  @IsString()
  organization: string;
}
