import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity.js';
import { ListCustomersDto } from '../dto/list-customers.dto.js';
import { normalizeBDPhone } from '../../../shared/utils/phone.util.js';

/** SQL expression to normalize BD phone numbers to 11-digit format (01XXXXXXXXX) */
const PHONE_NORM = (col: string) =>
    `CASE WHEN ${col} LIKE '+880%' THEN '0' || SUBSTRING(${col} FROM 5) WHEN ${col} LIKE '880%' AND LENGTH(${col}) = 13 THEN '0' || SUBSTRING(${col} FROM 4) ELSE ${col} END`;

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

        // Pre-compute normalized phone in a subquery so it's a real column
        const innerSelect = `SELECT *, ${PHONE_NORM('customer_phone')} AS norm_phone FROM orders WHERE deleted_at IS NULL`;

        let whereClause = '1=1';
        const params: (string | number)[] = [];
        let paramIndex = 1;

        // Filter by specific phones (for bulk export) — normalize input phones
        if (dto.phones) {
            const phoneList = dto.phones
                .split(',')
                .map((p) => normalizeBDPhone(p.trim()))
                .filter(Boolean);
            if (phoneList.length > 0) {
                whereClause += ` AND o.norm_phone IN (${phoneList.map(() => `$${paramIndex++}`).join(', ')})`;
                params.push(...phoneList);
            }
        }

        // Search filter
        let havingClause = '';
        if (dto.search) {
            const searchPattern = `%${dto.search}%`;
            havingClause = `HAVING (
                (SELECT o2.customer_name FROM orders o2 WHERE o2.deleted_at IS NULL AND ${PHONE_NORM('o2.customer_phone')} = o.norm_phone ORDER BY o2.created_at DESC LIMIT 1) ILIKE $${paramIndex++}
                OR o.norm_phone ILIKE $${paramIndex++}
            )`;
            params.push(searchPattern, searchPattern);
        }

        const baseQuery = `
            FROM (${innerSelect}) o
            WHERE ${whereClause}
            GROUP BY o.norm_phone
            ${havingClause}
        `;

        // Count query
        const countResult = await this.orderRepository.manager.query(
            `SELECT COUNT(*) as total FROM (SELECT o.norm_phone ${baseQuery}) sub`,
            params,
        );
        const total = parseInt(countResult[0]?.total, 10) || 0;

        // Data query
        const dataParams = [...params, limit, offset];
        const rows: CustomerRow[] = await this.orderRepository.manager.query(
            `SELECT
                o.norm_phone AS "customerPhone",
                (SELECT o2.customer_name FROM orders o2
                 WHERE o2.deleted_at IS NULL AND ${PHONE_NORM('o2.customer_phone')} = o.norm_phone
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

    async getOrdersByPhone(phone: string, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        const normalized = normalizeBDPhone(phone);
        const phoneNorm = PHONE_NORM('customer_phone');

        const countResult = await this.orderRepository.manager.query(
            `SELECT COUNT(*) as total FROM orders WHERE ${phoneNorm} = $1 AND deleted_at IS NULL`,
            [normalized],
        );
        const total = parseInt(countResult[0]?.total, 10) || 0;

        const rows = await this.orderRepository.manager.query(
            `SELECT
                invoice_id AS "invoiceId",
                customer_name AS "customerName",
                customer_address AS "customerAddress",
                status,
                grand_total::text AS "grandTotal",
                created_at::text AS "createdAt"
            FROM orders
            WHERE ${phoneNorm} = $1 AND deleted_at IS NULL
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3`,
            [normalized, limit, offset],
        );

        const data = rows.map((row: { invoiceId: string; customerName: string; customerAddress: string; status: string; grandTotal: string; createdAt: string }) => ({
            invoiceId: row.invoiceId,
            customerName: row.customerName,
            customerAddress: row.customerAddress,
            status: row.status,
            grandTotal: parseFloat(row.grandTotal) || 0,
            createdAt: row.createdAt,
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
        const phoneNorm = PHONE_NORM('customer_phone');
        let whereClause = 'deleted_at IS NULL';
        const params: string[] = [];
        let paramIndex = 1;

        // Filter by specific phones (for selected export)
        if (dto.phones) {
            const phoneList = dto.phones
                .split(',')
                .map((p) => normalizeBDPhone(p.trim()))
                .filter(Boolean);
            if (phoneList.length > 0) {
                whereClause += ` AND ${phoneNorm} IN (${phoneList.map(() => `$${paramIndex++}`).join(', ')})`;
                params.push(...phoneList);
            }
        }

        // Search filter
        if (dto.search) {
            const searchPattern = `%${dto.search}%`;
            whereClause += ` AND (customer_name ILIKE $${paramIndex++} OR ${phoneNorm} ILIKE $${paramIndex++})`;
            params.push(searchPattern, searchPattern);
        }

        const rows: { invoiceId: string; customerName: string; customerPhone: string; customerAddress: string; status: string; grandTotal: string; createdAt: string }[] =
            await this.orderRepository.manager.query(
                `SELECT
                    invoice_id AS "invoiceId",
                    customer_name AS "customerName",
                    ${phoneNorm} AS "customerPhone",
                    customer_address AS "customerAddress",
                    status,
                    grand_total::text AS "grandTotal",
                    created_at::text AS "createdAt"
                FROM orders
                WHERE ${whereClause}
                ORDER BY created_at DESC`,
                params,
            );

        const headers = [
            'Invoice ID',
            'Name',
            'Phone',
            'Address',
            'Status',
            'Amount',
            'Date',
        ];

        const csvRows = rows.map((row) =>
            [
                row.invoiceId,
                `"${(row.customerName || '').replace(/"/g, '""')}"`,
                row.customerPhone,
                `"${(row.customerAddress || '').replace(/"/g, '""')}"`,
                row.status,
                row.grandTotal,
                row.createdAt,
            ].join(','),
        );

        return [headers.join(','), ...csvRows].join('\n');
    }
}
