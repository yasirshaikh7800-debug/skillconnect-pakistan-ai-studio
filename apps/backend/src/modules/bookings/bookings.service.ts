import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus, UserRole } from '@prisma/client';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  private readonly COMMISSION_RATE = 0.10; // 10% platform fee

  constructor(private readonly prisma: PrismaService) {}

  async createBooking(customerId: string, dto: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
      include: { provider: true },
    });

    if (!service || !service.isAvailable) {
      throw new NotFoundException('Selected service is unavailable');
    }

    const providerUserId = service.provider.userId;
    if (providerUserId === customerId) {
      throw new BadRequestException('Providers cannot book their own services');
    }

    const totalAmount = service.basePrice;
    const commissionFee = totalAmount * this.COMMISSION_RATE;
    const providerEarning = totalAmount - commissionFee;
    const bookingCode = `SCPK-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = await this.prisma.booking.create({
      data: {
        bookingCode,
        customerId,
        providerId: providerUserId,
        serviceId: dto.serviceId,
        scheduledAt: new Date(dto.scheduledAt),
        totalAmount,
        commissionFee,
        providerEarning,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        notes: dto.notes,
        status: BookingStatus.PENDING,
        chatRoom: {
          create: {
            customerId,
            providerId: providerUserId,
          },
        },
      },
      include: {
        service: true,
        customer: { select: { id: true, email: true, profile: true } },
        provider: { select: { id: true, email: true, profile: true } },
        chatRoom: true,
      },
    });

    this.logger.log(`Booking created: ${booking.bookingCode} for service ${service.title}`);
    return booking;
  }

  async getUserBookings(userId: string, role: UserRole) {
    return this.prisma.booking.findMany({
      where: role === UserRole.PROVIDER ? { providerId: userId } : { customerId: userId },
      include: {
        service: true,
        customer: { select: { id: true, email: true, profile: true, phone: true } },
        provider: { select: { id: true, email: true, profile: true, phone: true } },
        payment: true,
        review: true,
        chatRoom: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        customer: { select: { id: true, email: true, profile: true, phone: true } },
        provider: { select: { id: true, email: true, profile: true, phone: true } },
        payment: true,
        review: true,
        chatRoom: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId && booking.providerId !== userId) {
      throw new ForbiddenException('Access denied to this booking');
    }

    return booking;
  }

  async updateBookingStatus(bookingId: string, userId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId && booking.providerId !== userId) {
      throw new ForbiddenException('Access denied to modify this booking');
    }

    // Validate state machine transitions
    this.validateStateTransition(booking.status, dto.status);

    const updateData: any = { status: dto.status };
    if (dto.status === BookingStatus.COMPLETED) {
      updateData.completedAt = new Date();
      // Transfer earnings to provider wallet
      await this.prisma.wallet.upsert({
        where: { userId: booking.providerId },
        update: {
          balance: { increment: booking.providerEarning },
        },
        create: {
          userId: booking.providerId,
          balance: booking.providerEarning,
          currency: 'PKR',
        },
      });
    } else if (dto.status === BookingStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        service: true,
        payment: true,
      },
    });

    return updatedBooking;
  }

  private validateStateTransition(current: BookingStatus, target: BookingStatus) {
    const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.ACCEPTED, BookingStatus.CANCELLED],
      [BookingStatus.ACCEPTED]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
      [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED, BookingStatus.DISPUTED],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.DISPUTED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    };

    if (!allowedTransitions[current].includes(target)) {
      throw new BadRequestException(
        `Invalid booking status transition from ${current} to ${target}`,
      );
    }
  }
}
