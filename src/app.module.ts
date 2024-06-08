import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from './providers/providers.module';
import { CommonModule } from './common/common.module';
import { RecommendationService } from './recommendation/recommendation.service';
import { RecommendationController } from './recommendation/recommendation.controller';
import { GraphqlService } from './graphql/graphql.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ProvidersModule,
    CommonModule,
  ],
  providers: [RecommendationService, GraphqlService],
  controllers: [RecommendationController],
})
export class AppModule {}
