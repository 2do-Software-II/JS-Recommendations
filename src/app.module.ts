import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from './providers/providers.module';
import { CommonModule } from './common/common.module';
import { RecommendationService } from './recommendation/recommendation.service';
import { RecommendationController } from './recommendation/recommendation.controller';
import { GraphqlService } from './graphql/graphql.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { Modelo } from './recommendation/entities/modelo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    TypeOrmModule.forFeature([Modelo]),
    ProvidersModule,
    CommonModule,
  ],
  providers: [RecommendationService, GraphqlService],
  controllers: [RecommendationController],
})
export class AppModule {}
