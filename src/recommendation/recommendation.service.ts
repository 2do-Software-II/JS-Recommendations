import { Injectable } from '@nestjs/common';
import * as brain from 'brain.js';
import { GraphqlService } from 'src/graphql/graphql.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modelo } from './entities/modelo.entity';
import { ServiciosEntradaDTO, ServiciosSalidaDTO } from './dtos/servicios.dto';

@Injectable()
export class RecommendationService {
    private redNeuronal;
    private graphqlService: GraphqlService;

    constructor(graphqlService: GraphqlService, @InjectRepository(Modelo) private modeloRepository: Repository<Modelo>,) {

        this.redNeuronal = new brain.NeuralNetwork();
        this.graphqlService = graphqlService;
        this.cargarModeloEntrenado();
    }

    async cargarModeloEntrenado(): Promise<void> {
        try {
            const modelo = await this.modeloRepository.find({
                order: { fecha: 'DESC' },
                take: 1
            });
            if (modelo) {
                this.redNeuronal.fromJSON(JSON.parse(modelo[0].data));
                console.log('Modelo cargado')
            }
        } catch (error) {
            console.error('No se pudo cargar el modelo entrenado:', error.message);

        }
    }

    async entrenarYGuardarModelo(): Promise<void> {
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

            const jsonModel = this.redNeuronal.toJSON();
            const nuevoModelo = this.modeloRepository.create({
                data: JSON.stringify(jsonModel),
                fecha: new Date(),
            });
            await this.modeloRepository.save(nuevoModelo);
        } catch (error) {
            throw new Error(`Error al entrenar la red neuronal: ${error.message}`);
        }
    }

    async guardarDatosEntrenamiento(datos: Partial<Modelo>): Promise<void> {
        const datosEntrenamiento = this.modeloRepository.create(datos);
        await this.modeloRepository.save(datosEntrenamiento);
    }

    private convertirBooleanoAObjeto(preferencias: any): { [key: string]: number } {
        return Object.entries(preferencias).reduce((acc, [key, value]) => {
            acc[key] = value ? 1 : 0; // Convertir a booleano explícitamente
            return acc;
        }, {});
    }

    convertirServicios(entrada: ServiciosEntradaDTO): ServiciosSalidaDTO {
        const serviciosPosibles: ServiciosSalidaDTO = {};
        // Recorremos la lista de servicios de entrada y actualizamos los valores
        entrada.servicios.forEach(servicio => {
            serviciosPosibles[servicio.servicio] = servicio.habilitado;
        });

        return serviciosPosibles;
    }

    recomendarHabitaciones(entrada: ServiciosEntradaDTO): string[] {
        // Convertir las preferencias del cliente a números para la red neuronal
        const preferenciasCliente = this.convertirServicios(entrada);
        const preferenciasNumeros = this.convertirBooleanoAObjeto(preferenciasCliente);

        // Hacer una predicción con Brain.js
        const resultado = this.redNeuronal.run(preferenciasNumeros);

        // Obtener las habitaciones recomendadas basadas en la predicción
        const habitacionesRecomendadas = Object.keys(resultado)
            .filter(numero => resultado[numero] > 0.19) // Filtrar las habitaciones segun confianza
            .map(numero => (numero));

        return habitacionesRecomendadas;
    }
}
