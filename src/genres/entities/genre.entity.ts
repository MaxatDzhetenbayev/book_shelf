import {
  Column,
  DataType,
  HasOne,
  Table,
  Model,
  HasMany,
} from 'sequelize-typescript';
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

  @HasMany(() => Book)
  books: Book[];
}
