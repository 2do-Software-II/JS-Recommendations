import { Body, Controller, Post } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Preferencias } from './interfaces/preferencias.interface';

@Controller('recomendaciones')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) { }

  @Post()
  recomendar(@Body() preferencias: Preferencias): number[] {
    const habitacionesRecomendadas = this.recommendationService.recomendarHabitaciones(preferencias);
    return habitacionesRecomendadas;
  }
}
