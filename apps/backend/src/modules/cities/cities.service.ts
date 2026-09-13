import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCities(search?: string, province?: string) {
    return this.prisma.city.findMany({
      where: {
        isActive: true,
        ...(province ? { province: { equals: province, mode: 'insensitive' } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { district: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async getCityCount() {
    const total = await this.prisma.city.count();
    return { count: total };
  }
}
