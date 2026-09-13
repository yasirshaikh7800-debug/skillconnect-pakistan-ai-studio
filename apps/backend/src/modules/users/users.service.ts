import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        providerProfile: true,
        wallet: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const { passwordHash, twoFactorSecret, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedProfile = await this.prisma.profile.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        firstName: dto.firstName || '',
        lastName: dto.lastName || '',
        city: dto.city || 'Karachi',
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        bio: dto.bio,
      },
    });

    return updatedProfile;
  }
}
