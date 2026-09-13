import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformStats() {
    const totalUsers = await this.prisma.user.count();
    const totalProviders = await this.prisma.providerProfile.count();
    const totalBookings = await this.prisma.booking.count();
    const completedBookings = await this.prisma.booking.count({ where: { status: 'COMPLETED' } });
    const pendingVerifications = await this.prisma.providerProfile.count({ where: { isVerified: false } });

    const totalRevenue = await this.prisma.booking.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { commissionFee: true, totalAmount: true },
    });

    return {
      totalUsers,
      totalProviders,
      totalBookings,
      completedBookings,
      pendingVerifications,
      grossVolume: totalRevenue._sum.totalAmount || 0,
      platformRevenueFee: totalRevenue._sum.commissionFee || 0,
    };
  }

  async getUnverifiedProviders() {
    return this.prisma.providerProfile.findMany({
      where: { isVerified: false },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            profile: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async verifyProviderCnic(providerProfileId: string, verify: boolean) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerProfileId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const updated = await this.prisma.providerProfile.update({
      where: { id: providerProfileId },
      data: { isVerified: verify },
      include: { user: { select: { email: true, profile: true } } },
    });

    return {
      success: true,
      message: verify ? 'Provider CNIC successfully verified' : 'Provider verification revoked',
      provider: updated,
    };
  }
}
