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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddBookToCartDTO } from './dto/add-to-cart.dto.ts';

@Controller('orders')
export class OrdersController {
  constructor(private readonly cartsService: OrdersService) {}
  @Post()
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addBooksToCart(@Request() req, @Body() { books }: AddBookToCartDTO) {
    const { id: userId } = req.user;

    return this.cartsService.addBooksToCart({ userId, books });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    const { id: userId } = req.user;
    return this.cartsService.findAllUserBooks(userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    const { id: userId } = req.user;
    return this.cartsService.removeBookFromUserCart(userId, +id);
  }
}
