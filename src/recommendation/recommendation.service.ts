import { Injectable } from '@nestjs/common';
import * as brain from 'brain.js';
import { GraphqlService } from 'src/graphql/graphql.service';

type Preferencias<T> = {
    [K in keyof T]: boolean;
};

@Injectable()
export class RecommendationService {
    private redNeuronal;
    private graphqlService: GraphqlService;

    constructor(graphqlService: GraphqlService) {
        this.redNeuronal = new brain.NeuralNetwork();
        this.graphqlService = graphqlService;
        this.entrenarRedNeuronal();
    }

    async entrenarRedNeuronal(): Promise<void> {
        try {
            const habitaciones = await this.graphqlService.obtenerTodasLasHabitaciones();
            const servicios = await this.graphqlService.obtenerTodosLosServicios();

            const datosEntrenamiento = await Promise.all(habitaciones.map(async habitacion => {
                const serviciosHabitacion = await this.graphqlService.obtenerServiciosPorHabitacion(habitacion.id);
                const serviciosObj = servicios.reduce((acc, servicio) => {
                    acc[servicio] = serviciosHabitacion.includes(servicio) ? 1 : 0;
                    return acc;
                }, {});

                return {
                    input: serviciosObj,
                    output: { [habitacion.id]: 1 }
                };
            }));

            this.redNeuronal.train(datosEntrenamiento);
        } catch (error) {
            throw new Error(`Error al entrenar la red neuronal: ${error.message}`);
        }

    }

    private convertirBooleanoAObjeto(preferencias: any): { [key: string]: boolean } {
        return Object.entries(preferencias).reduce((acc, [key, value]) => {
            acc[key] = !!value; // Convertir a booleano explícitamente
            return acc;
        }, {});
    }


    recomendarHabitaciones<T>(preferenciasCliente: Preferencias<T>): string[] {
        // Convertir las preferencias del cliente a números para la red neuronal
        const preferenciasNumeros = this.convertirBooleanoAObjeto(preferenciasCliente);

        // Hacer una predicción con Brain.js
        const resultado = this.redNeuronal.run(preferenciasNumeros);

        // Obtener las habitaciones recomendadas basadas en la predicción
        const habitacionesRecomendadas = Object.keys(resultado)
            .filter(numero => resultado[numero] > 0.19) // Filtrar las habitaciones con una confianza mayor al 48%
            .map(numero => (numero));
        return habitacionesRecomendadas;
    }
}
