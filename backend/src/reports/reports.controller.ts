import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { ReportsService } from './reports.service';
import { QueryRevenueDto } from './dto/query-revenue.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Roles('ADMIN')
  @Get('revenue')
  revenue(@Query() query: QueryRevenueDto) {
    return this.reportsService.revenue(query);
  }
}
