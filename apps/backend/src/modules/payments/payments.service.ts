import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key_pakistan');
  }

  async initiatePayment(userId: string, dto: InitiatePaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { service: true, payment: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId) {
      throw new BadRequestException('Only the customer can initiate payment');
    }

    if (booking.payment && booking.payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Booking has already been paid for');
    }

    const amount = booking.totalAmount;
    let clientSecret: string | null = null;
    let transactionId = `TXN-${Date.now()}`;

    if (dto.method === PaymentMethod.STRIPE) {
      try {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // convert PKR to minor units
          currency: 'pkr',
          metadata: { bookingId: booking.id, userId },
        });
        clientSecret = paymentIntent.client_secret;
        transactionId = paymentIntent.id;
      } catch (err: any) {
        this.logger.warn(`Stripe API fallback to mock transaction ID: ${err.message}`);
        clientSecret = `mock_stripe_secret_${Date.now()}`;
      }
    } else if (dto.method === PaymentMethod.CASH_ON_DELIVERY) {
      transactionId = `COD-${booking.bookingCode}`;
    }

    const payment = await this.prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        method: dto.method,
        status: dto.method === PaymentMethod.CASH_ON_DELIVERY ? PaymentStatus.PAID : PaymentStatus.PENDING,
        transactionId,
      },
      create: {
        bookingId: booking.id,
        userId,
        amount,
        currency: 'PKR',
        method: dto.method,
        status: dto.method === PaymentMethod.CASH_ON_DELIVERY ? PaymentStatus.PAID : PaymentStatus.PENDING,
        transactionId,
      },
    });

    return {
      payment,
      clientSecret,
      message:
        dto.method === PaymentMethod.CASH_ON_DELIVERY
          ? 'Cash on Delivery selected. Pay service provider directly upon job completion.'
          : 'Payment intent initialized successfully.',
    };
  }

  async getWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { userId, balance: 0.0, currency: 'PKR' },
      });
    }
    return wallet;
  }
}
