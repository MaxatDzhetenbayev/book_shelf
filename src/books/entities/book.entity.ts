import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Favorit } from 'src/favorits/entities/favorit.entity';
import { Genre } from 'src/genres/entities/genre.entity';
import { Rating } from 'src/ratings/entities/rating.entity';

interface IContent {
  kz: {
    title: string;
    description: string;
  };
  ru: {
    title: string;
    description: string;
  };
}

@Table({
  tableName: 'books',
  timestamps: false,
})
export class Book extends Model<Book> {
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  images: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  author: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  content: IContent;

  @ForeignKey(() => Genre)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  genre_id: number;

  @BelongsTo(() => Genre)
  genre: Genre;

  @HasMany(() => Favorit)
  favorits: Favorit[];

  @HasMany(() => Rating)
  ratings: Rating[];
}
