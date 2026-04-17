import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { envConfigService } from '../../config/env-config.service.js';

/**
 * Guard that verifies Steadfast webhook Authorization Bearer token.
 *
 * If STEADFAST_WEBHOOK_SECRET is not configured, all requests are allowed through
 * (optional verification). When configured, the guard checks the Bearer token
 * in the Authorization header.
 */
@Injectable()
export class SteadfastWebhookGuard implements CanActivate {
    private readonly logger = new Logger(SteadfastWebhookGuard.name);

    canActivate(context: ExecutionContext): boolean {
        const config = envConfigService.getSteadfastConfig();

        // If no webhook secret configured, allow all requests
        if (!config.STEADFAST_WEBHOOK_SECRET) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'] as string;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.warn(
                'Steadfast webhook rejected: missing or invalid Authorization header',
            );
            throw new ForbiddenException('Missing webhook authorization');
        }

        const token = authHeader.substring(7);

        if (token !== config.STEADFAST_WEBHOOK_SECRET) {
            this.logger.warn(
                'Steadfast webhook rejected: invalid Bearer token',
            );
            throw new ForbiddenException('Invalid webhook authorization');
        }

        return true;
    }
}
