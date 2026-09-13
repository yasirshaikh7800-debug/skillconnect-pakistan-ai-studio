import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to PostgreSQL via Prisma ORM...');
    await this.$connect();
    this.logger.log('PostgreSQL Database connected successfully.');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from PostgreSQL...');
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('cleanDatabase operation is disallowed in production mode.');
    }
    const models = Reflect.ownKeys(this).filter((key) => typeof key === 'string' && !key.startsWith('_'));
    return Promise.all(models.map((model) => (this as any)[model]?.deleteMany?.()));
  }
}
