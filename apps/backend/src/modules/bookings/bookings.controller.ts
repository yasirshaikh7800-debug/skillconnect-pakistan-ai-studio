import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service booking' })
  async createBooking(@CurrentUser('id') customerId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(customerId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List current user bookings (Customer or Provider)' })
  async getMyBookings(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.bookingsService.getUserBookings(userId, role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID' })
  async getBookingById(
    @Param('id') bookingId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.bookingsService.getBookingById(bookingId, userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status (ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED)' })
  async updateStatus(
    @Param('id') bookingId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(bookingId, userId, dto);
  }
}
