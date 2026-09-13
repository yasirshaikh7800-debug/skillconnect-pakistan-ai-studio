import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { FilterServicesDto } from './dto/filter-services.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { services: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getServices(query: FilterServicesDto) {
    const { categorySlug, city, search } = query;

    const services = await this.prisma.service.findMany({
      where: {
        isAvailable: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(city ? { provider: { user: { profile: { city: { equals: city, mode: 'insensitive' } } } } } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        provider: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
                avatarUrl: true,
                profile: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return services;
  }

  async getServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        provider: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
                avatarUrl: true,
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createService(providerUserId: string, dto: CreateServiceDto) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId: providerUserId },
    });

    if (!providerProfile) {
      throw new BadRequestException('User does not have an active Service Provider profile');
    }

    return this.prisma.service.create({
      data: {
        providerId: providerProfile.id,
        categoryId: dto.categoryId,
        title: dto.title,
        description: dto.description,
        basePrice: dto.basePrice,
        durationMinutes: dto.durationMinutes || 60,
      },
      include: {
        category: true,
      },
    });
  }
}
