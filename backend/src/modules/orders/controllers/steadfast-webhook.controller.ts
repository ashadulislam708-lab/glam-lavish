import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../core/decorators/public.decorator.js';
import { SteadfastWebhookDto } from '../dto/steadfast-webhook.dto.js';
import { OrderService } from '../services/order.service.js';

@ApiTags('Steadfast Webhook')
@Controller('steadfast')
export class SteadfastWebhookController {
    private readonly logger = new Logger(SteadfastWebhookController.name);

    constructor(private readonly orderService: OrderService) {}

    @Public()
    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handleWebhook(@Body() dto: SteadfastWebhookDto) {
        this.logger.log(
            `Steadfast webhook received: type=${dto.notification_type}, consignment_id=${dto.consignment_id}`,
        );

        await this.orderService.handleSteadfastWebhook(dto);

        return {
            status: 'success',
            message: 'Webhook received successfully.',
        };
    }
}
