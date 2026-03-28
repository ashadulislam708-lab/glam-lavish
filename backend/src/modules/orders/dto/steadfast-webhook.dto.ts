import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SteadfastWebhookDto {
    @IsString()
    notification_type: string;

    @IsNumber()
    consignment_id: number;

    @IsString()
    @IsOptional()
    invoice?: string;

    @IsNumber()
    @IsOptional()
    cod_amount?: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsNumber()
    @IsOptional()
    delivery_charge?: number;

    @IsString()
    @IsOptional()
    tracking_message?: string;

    @IsString()
    @IsOptional()
    updated_at?: string;
}
