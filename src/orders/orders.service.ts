import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderStatus } from './entities/order.entity';
import { Book } from 'src/books/entities/book.entity';
import { Genre } from 'src/genres/entities/genre.entity';
import sequelize from 'sequelize';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderRepository: typeof Order,
  ) {}
  private readonly logger = new Logger(this.orderRepository.name);

  async addBooksToOrder({
    userId,
    books,
    term,
  }: {
    userId: number;
    books: number[];
    term: number;
  }) {
    try {
      this.logger.log(`Add books to cart for user: ${userId}...`);

      const unavailableBooks = await this.orderRepository.findAll({
        where: {
          bookId: books,
          status: OrderStatus.Delivered,
          term: {
            [sequelize.Op.gt]: new Date(),
          },
        },
      });

      const bookEntries = books.map((bookId) => {
        const isUnavailable = unavailableBooks.some(
          (order) => order.bookId === bookId,
        );

        return {
          userId,
          bookId,
          status: isUnavailable
            ? OrderStatus.NotAvailable
            : OrderStatus.Waiting,
          term: new Date(new Date().getTime() + term * 24 * 60 * 60 * 1000),
        };
      });

      const addedBooks = await this.orderRepository.bulkCreate(bookEntries);

      if (addedBooks.length <= 0) {
        throw new InternalServerErrorException(
          'Books could not be added to cart',
        );
      }

      this.logger.log(`Added Books finish. `);
      return unavailableBooks;
    } catch (error) {
      this.logger.error(`Book could not be created: ${error.message}`);
      throw new InternalServerErrorException(
        `Books could not be added to cart. Error message: ${error}`,
      );
    }
  }

  async returnBook(userId: number, orderId: number) {
    try {
      this.logger.log(`Returning book for order: ${orderId}...`);

      const order = await this.orderRepository.findOne({
        where: {
          id: orderId,
          userId,
        },
      });

      if (!order || order.status !== OrderStatus.Delivered) {
        throw new NotFoundException('Order not found or already returned');
      }

      order.status = OrderStatus.Returned;
      await order.save();

      const waitlist = await this.orderRepository.findAll({
        where: {
          bookId: order.bookId,
          status: OrderStatus.NotAvailable,
        },
        order: [['createdAt', 'ASC']],
      });

      if (waitlist.length > 0) {
        const nextOrder = waitlist[0];
        nextOrder.status = OrderStatus.Waiting;
        await nextOrder.save();

        this.logger.log(
          `Book now available for user ${nextOrder.userId}. Status updated to Waiting.`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to return book. Error: ${error}`);
      throw new InternalServerErrorException(
        `Failed to return book. Error: ${error}`,
      );
    }
  }

  //   async findAllUserBooks(userId: number) {
  //     try {
  //       const existingBooks = await this.cartRepository.findAll({
  //         where: { userId },
  //         attributes: {
  //           exclude: ['userId', 'bookId'],
  //         },
  //         include: {
  //           model: Book,
  //           include: [Genre],
  //         },
  //       });

  //       if (!existingBooks.length) {
  //         return [];
  //       }

  //       return existingBooks;
  //     } catch (error) {
  //       this.logger.error(`Book could not be created. Error message: ${error}`);
  //       throw new InternalServerErrorException(
  //         `Books could not be finded from cart. Error message: ${error}`,
  //       );
  //     }
  //   }

  //   async removeBookFromUserCart(userId: number, id: number) {
  //     try {
  //       this.logger.log(`Delete book from user cart `);

  //       const book = await this.cartRepository.findOne({
  //         where: {
  //           id,
  //           userId,
  //         },
  //       });

  //       if (!book) {
  //         this.logger.error(`Book could not be finded`);
  //         throw new NotFoundException(`Book could not be finded`);
  //       }

  //       return {
  //         message: 'Book deleted',
  //       };
  //     } catch (error) {
  //       this.logger.error(`Book could not be deleted. Error message: ${error}`);
  //       throw new InternalServerErrorException(
  //         `Book could not be deleted. Error message: ${error}`,
  //       );
  //     }
  //   }
}
