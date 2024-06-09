import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { ServiciosEntradaDTO } from './dtos/servicios.dto';

@Controller('recomendaciones')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) { }

  @Post('entrenar')
  async entrenarModelo(): Promise<void> {
    try {
      await this.recommendationService.entrenarYGuardarModelo();
    } catch (error) {
      throw new HttpException('Error al entrenar el modelo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post()
  async recomendarHabitaciones(@Body() preferenciasCliente: ServiciosEntradaDTO) {
    try {
      const habitacionesRecomendadas = this.recommendationService.recomendarHabitaciones(preferenciasCliente);
      return { habitaciones: habitacionesRecomendadas };
    } catch (error) {
      throw new HttpException('Error al recomendar habitaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
