import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';

export enum OrderStatus {
  Waiting = 'waiting',
  NotAvailable = 'not_available',
  Ready = 'ready',
  Delivered = 'delivered',
  Expired = 'expired',
  Returned = 'returned',
}

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model<Order> {
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
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.Waiting,
  })
  status: OrderStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  term: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Book)
  book: Book;
}
