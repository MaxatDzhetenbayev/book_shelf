import {
  IsArray,
  IsString,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsDefined,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContentDetailsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

class ContentDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ContentDetailsDto)
  kz: ContentDetailsDto;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ContentDetailsDto)
  ru: ContentDetailsDto;
}

export class CreateBookDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images: string[];

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  content: ContentDto;
}
