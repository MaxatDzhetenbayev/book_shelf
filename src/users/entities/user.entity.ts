import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Cart } from 'src/carts/entities/cart.entity';
import { Profile } from 'src/profiles/entities/profile.entity';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
  })
  ticket: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'user',
  })
  role: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash: string;

  @HasOne(() => Profile)
  profile: Profile;

  @HasOne(() => Cart)
  cart: Cart;
}
