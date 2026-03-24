import {
    Controller,
    Get,
    Query,
    HttpCode,
    HttpStatus,
    Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService } from '../services/customer.service.js';
import { ListCustomersDto } from '../dto/list-customers.dto.js';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() dto: ListCustomersDto) {
        return this.customerService.listCustomers(dto);
    }

    @Get('export')
    async exportCsv(@Query() dto: ListCustomersDto, @Res() res: any) {
        const csv = await this.customerService.exportCustomersCsv(dto);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=customers-${crypto.randomUUID()}.csv`,
        );
        res.send(csv);
    }
}
