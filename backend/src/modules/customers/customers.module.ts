import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity.js';
import { CustomerController } from './controllers/customer.controller.js';
import { CustomerService } from './services/customer.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    controllers: [CustomerController],
    providers: [CustomerService],
})
export class CustomerModule {}
