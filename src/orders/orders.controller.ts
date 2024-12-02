import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddBookToCartDTO } from './dto/add-to-cart.dto.ts';

@Controller('orders')
export class OrdersController {
  constructor(private readonly cartsService: OrdersService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  addBooksToCart(@Request() req, @Body() { books }: AddBookToCartDTO) {
    const { id: userId } = req.user;

    return this.cartsService.addBooksToOrder({ userId, books, term: 14 });
  }

  @Post('return')
  @UseGuards(JwtAuthGuard)
  returnBooks(@Request() req, @Body() { orderId }: { orderId: number }) {
    const { id: userId } = req.user;

    return this.cartsService.returnBook(userId, orderId);
  }

  //   @Get()
  //   @UseGuards(JwtAuthGuard)
  //   findAll(@Request() req) {
  //     const { id: userId } = req.user;
  //     return this.cartsService.findAllUserBooks(userId);
  //   }

  //   @Delete(':id')
  //   @UseGuards(JwtAuthGuard)
  //   remove(@Param('id') id: string, @Request() req) {
  //     const { id: userId } = req.user;
  //     return this.cartsService.removeBookFromUserCart(userId, +id);
  //   }
}
