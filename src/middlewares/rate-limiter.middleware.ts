import {
  Injectable,
  NestMiddleware,
  CACHE_MANAGER,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as moment from 'moment';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

interface IRequestLog {
  timestamp: number;
  counter: number;
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  private getTokenFromBearerHeader(bearerHeader: string): string {
    return bearerHeader.split(' ')[1];
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const bearerHeader: string = req.headers['authorization'];

    const cacheKey: string = bearerHeader
      ? this.getTokenFromBearerHeader(bearerHeader)
      : req.ip;

    const maxNumberOfUserRequestsInRateLimit: number = bearerHeader
      ? this.configService.get<number>(
          'MAX_NUMBER_OF_PRIVATE_REQUESTS_IN_RATE_LIMIT',
        )
      : this.configService.get<number>(
          'MAX_NUMBER_OF_PUBLIC_REQUESTS_IN_RATE_LIMIT',
        );

    const record: any = await this.cacheManager.get(cacheKey);
    const currentRequestTime: moment.Moment = moment();
    const TIME_RATE_LIMIT_IN_SECONDS: number = this.configService.get<number>(
      'TIME_RATE_LIMIT_IN_SECONDS',
    );

    if (!record) {
      const requestLog: IRequestLog = {
        timestamp: currentRequestTime.unix(),
        counter: 1,
      };
      this.cacheManager.set(cacheKey, JSON.stringify(requestLog), {
        ttl: TIME_RATE_LIMIT_IN_SECONDS,
      });
      return next();
    }
    const requestLog: IRequestLog = JSON.parse(record);
    const requestLogExistenceTime: number =
      currentRequestTime.unix() - requestLog.timestamp;

    if (requestLog.counter >= maxNumberOfUserRequestsInRateLimit) {
      const allowedTimeOfNextUserRequest: string = moment()
        .add(TIME_RATE_LIMIT_IN_SECONDS - requestLogExistenceTime, 'seconds')
        .toLocaleString();

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `You have exceeded the ${maxNumberOfUserRequestsInRateLimit} requests in ${TIME_RATE_LIMIT_IN_SECONDS} seconds limit! You can make the naxt request at ${allowedTimeOfNextUserRequest}`,
        },
        429,
      );
    }

    requestLog.counter++;
    this.cacheManager.set(cacheKey, JSON.stringify(requestLog), {
      ttl: TIME_RATE_LIMIT_IN_SECONDS - requestLogExistenceTime,
    });
    next();
  }
}
