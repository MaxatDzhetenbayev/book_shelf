import { Column, DataType, HasOne, Table, Model } from 'sequelize-typescript';
import { Book } from 'src/books/entities/book.entity';

interface IGenreContent {
  kz: string;
  ru: string;
}

@Table({
  tableName: 'genres',
  timestamps: false,
})
export class Genre extends Model<Genre> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  content: IGenreContent;

  @HasOne(() => Book)
  book: Book;
}
