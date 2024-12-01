import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './entities/cart.entity';
import { OrdersController } from './orders.controller';

@Module({
  imports: [SequelizeModule.forFeature([Cart])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class CartsModule {}
