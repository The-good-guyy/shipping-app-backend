import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification_service.controller';
import { NotificationServiceService } from './notification_service.service';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Địa chỉ Kafka broker
          },
          consumer: {
            groupId: 'notification-consumer-group', // Tên group ID cho consumer
          },
        },
      },
    ]),
    MailModule,
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService, MailService],
})
export class NotificationServiceModule {}
