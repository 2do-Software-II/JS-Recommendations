import { Body, Controller, Post } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recomendaciones')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) { }

  @Post()
  async recomendarHabitaciones(@Body() preferenciasCliente: any) {
    try {
      const habitacionesRecomendadas = this.recommendationService.recomendarHabitaciones(preferenciasCliente);
      return { habitaciones: habitacionesRecomendadas };
    } catch (error) {
      return { error: error.message };
    }
  }
}
