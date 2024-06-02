import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from './providers/providers.module';
import { CommonModule } from './common/common.module';
import { RecommendationService } from './recommendation/recommendation.service';
import { RecommendationController } from './recommendation/recommendation.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ProvidersModule,
    CommonModule,
  ],
  providers: [RecommendationService],
  controllers: [RecommendationController],
})
export class AppModule {}
