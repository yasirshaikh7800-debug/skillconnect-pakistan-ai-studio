import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin Console')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get marketplace analytics, user counts, and platform revenue stats' })
  async getStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('providers/unverified')
  @ApiOperation({ summary: 'List service providers awaiting CNIC identity verification' })
  async getUnverifiedProviders() {
    return this.adminService.getUnverifiedProviders();
  }

  @Patch('providers/:id/verify')
  @ApiOperation({ summary: 'Approve or reject provider CNIC verification' })
  async verifyProvider(
    @Param('id') providerProfileId: string,
    @Body() body: { verify: boolean },
  ) {
    return this.adminService.verifyProviderCnic(providerProfileId, body.verify);
  }
}
