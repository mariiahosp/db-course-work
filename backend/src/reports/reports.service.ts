import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryRevenueDto } from './dto/query-revenue.dto';

type RevenueRow = {
  category: string;
  month: Date;
  order_count: number;
  total_revenue: number;
};

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) { }

  async revenue(query: QueryRevenueDto) {
    const minRevenue = query.minRevenue ?? 0;

    const rows = await this.prisma.$queryRaw<RevenueRow[]>`
      SELECT
        c.name AS category,
        DATE_TRUNC('month', o.created_at) AS month,
        COUNT(DISTINCT o.id)::int AS order_count,
        SUM(oi.quantity * oi.unit_price)::float AS total_revenue
      FROM orders AS o
      JOIN order_items AS oi 
        ON oi.order_id = o.id
      JOIN products AS p 
        ON p.id = oi.product_id
      JOIN categories AS c 
      ON c.id = p.category_id
      WHERE o.status = 'DELIVERED'::"OrderStatus"
      GROUP BY c.name, DATE_TRUNC('month', o.created_at)
      HAVING SUM(oi.quantity * oi.unit_price) > ${minRevenue}
      ORDER BY month DESC, total_revenue DESC
    `;

    return rows.map((row) => ({
      category: row.category,
      month: row.month,
      orderCount: row.order_count,
      totalRevenue: row.total_revenue,
    }));
  }
}
