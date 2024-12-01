import { Type } from 'class-transformer';
import {
  IsObject,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class GenreContent {
  @IsNotEmpty()
  @IsString()
  kz: string;

  @IsNotEmpty()
  @IsString()
  ru: string;
}

export class CreateGenreDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GenreContent)
  content: GenreContent;
}
