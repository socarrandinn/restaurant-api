import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>(
          'DB_PASSWORD',
          'your_secure_password',
        ),
        database: configService.get<string>('DB_DATABASE', 'restaurantdb'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('DB_SYNC') === 'true',
      });

      try {
        return await dataSource.initialize();
      } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
      }
    },
    inject: [ConfigService],
  },
];
