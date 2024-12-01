import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';

export class AddBookToCartDTO {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  books: number[];
}
