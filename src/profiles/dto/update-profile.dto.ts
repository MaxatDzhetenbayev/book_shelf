import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { Exclude } from 'class-transformer';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @Exclude()
  userId?: number;
}
