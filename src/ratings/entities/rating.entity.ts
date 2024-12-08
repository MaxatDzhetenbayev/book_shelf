import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';

@Table({ tableName: 'ratings', timestamps: false })
export class Rating extends Model<Rating> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Book)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  bookId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  })
  value: number;
}
