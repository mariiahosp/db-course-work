import { Controller, ForbiddenException, Get, Query, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { QueryRevenueDto } from './dto/query-revenue.dto';

type AuthRequest = Request & { user: { id: string; role: string } };

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }
  
  @Get('revenue')
  revenue(@Req() request: AuthRequest, @Query() query: QueryRevenueDto) {
    if (request.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can access this resource')
    }

    return this.reportsService.revenue(query);
  }
}
