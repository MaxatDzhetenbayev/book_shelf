import { IsIn, IsOptional, IsString, ValidateIf } from 'class-validator';

export class FindBooksQueryParamsDto {
  @IsOptional()
  @IsString()
  user: string;

  @IsOptional()
  @IsString()
  search?: string;

  @ValidateIf((con) => con.search)
  @IsIn(['kz', 'ru'], { message: "Locale must be either 'kz' or 'ru'" })
  locale: string;
}
