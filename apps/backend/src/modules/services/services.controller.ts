import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { FilterServicesDto } from './dto/filter-services.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Service Catalog')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all service categories with counts' })
  async getCategories() {
    return this.servicesService.getAllCategories();
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter services by category, city, location, or query' })
  async getServices(@Query() query: FilterServicesDto) {
    return this.servicesService.getServices(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service details by ID' })
  async getServiceById(@Param('id') id: string) {
    return this.servicesService.getServiceById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service offering (Providers only)' })
  async createService(@CurrentUser('id') userId: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.createService(userId, dto);
  }
}
