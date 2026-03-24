import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity.js';
import { ListCustomersDto } from '../dto/list-customers.dto.js';

interface CustomerRow {
    customerPhone: string;
    customerName: string;
    addresses: string[];
    totalOrders: string;
    totalSpent: string;
    lastOrderDate: string;
}

@Injectable()
export class CustomerService {
    private readonly logger = new Logger(CustomerService.name);

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {}

    async listCustomers(dto: ListCustomersDto) {
        const page = dto.page || 1;
        const limit = dto.limit || 25;
        const offset = (page - 1) * limit;

        let whereClause = 'o.deleted_at IS NULL';
        const params: (string | number)[] = [];
        let paramIndex = 1;

        // Filter by specific phones (for bulk export)
        if (dto.phones) {
            const phoneList = dto.phones.split(',').map((p) => p.trim()).filter(Boolean);
            if (phoneList.length > 0) {
                whereClause += ` AND o.customer_phone IN (${phoneList.map(() => `$${paramIndex++}`).join(', ')})`;
                params.push(...phoneList);
            }
        }

        // Search filter
        let havingClause = '';
        if (dto.search) {
            const searchPattern = `%${dto.search}%`;
            havingClause = `HAVING (
                (SELECT o2.customer_name FROM orders o2 WHERE o2.customer_phone = o.customer_phone AND o2.deleted_at IS NULL ORDER BY o2.created_at DESC LIMIT 1) ILIKE $${paramIndex++}
                OR o.customer_phone ILIKE $${paramIndex++}
            )`;
            params.push(searchPattern, searchPattern);
        }

        const baseQuery = `
            FROM orders o
            WHERE ${whereClause}
            GROUP BY o.customer_phone
            ${havingClause}
        `;

        // Count query
        const countResult = await this.orderRepository.manager.query(
            `SELECT COUNT(*) as total FROM (SELECT o.customer_phone ${baseQuery}) sub`,
            params,
        );
        const total = parseInt(countResult[0]?.total, 10) || 0;

        // Data query
        const dataParams = [...params, limit, offset];
        const rows: CustomerRow[] = await this.orderRepository.manager.query(
            `SELECT
                o.customer_phone AS "customerPhone",
                (SELECT o2.customer_name FROM orders o2
                 WHERE o2.customer_phone = o.customer_phone AND o2.deleted_at IS NULL
                 ORDER BY o2.created_at DESC LIMIT 1) AS "customerName",
                ARRAY_AGG(DISTINCT o.customer_address) AS "addresses",
                COUNT(DISTINCT o.id)::text AS "totalOrders",
                COALESCE(SUM(o.grand_total), 0)::text AS "totalSpent",
                MAX(o.created_at)::text AS "lastOrderDate"
            ${baseQuery}
            ORDER BY MAX(o.created_at) DESC
            LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
            dataParams,
        );

        const data = rows.map((row) => ({
            customerPhone: row.customerPhone,
            customerName: row.customerName,
            addresses: row.addresses || [],
            totalOrders: parseInt(row.totalOrders, 10) || 0,
            totalSpent: parseFloat(row.totalSpent) || 0,
            lastOrderDate: row.lastOrderDate,
        }));

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async exportCustomersCsv(dto: ListCustomersDto): Promise<string> {
        const allDto = { ...dto, page: 1, limit: 10000 };
        const result = await this.listCustomers(allDto);

        const headers = [
            'Name',
            'Phone',
            'Addresses',
            'Total Orders',
            'Total Spent',
            'Last Order Date',
        ];

        const rows = result.data.map((customer) =>
            [
                `"${customer.customerName}"`,
                customer.customerPhone,
                `"${customer.addresses.join('; ').replace(/"/g, '""')}"`,
                customer.totalOrders,
                customer.totalSpent,
                customer.lastOrderDate,
            ].join(','),
        );

        return [headers.join(','), ...rows].join('\n');
    }
}
