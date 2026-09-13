import { Controller, Get, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  async getCities(@Query('search') search?: string, @Query('province') province?: string) {
    return this.citiesService.getAllCities(search, province);
  }

  @Get('stats/count')
  async getCityCount() {
    return this.citiesService.getCityCount();
  }
}
