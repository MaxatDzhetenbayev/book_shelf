import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class AddBookToFavoritDTO {
  @IsNumber()
  bookId: number;
}
