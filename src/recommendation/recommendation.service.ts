import { Injectable } from '@nestjs/common';
import * as brain from 'brain.js';
import { Habitacion } from './interfaces/habitacion.interface';
import { Preferencias } from './interfaces/preferencias.interface';


@Injectable()
export class RecommendationService {
    private redNeuronal;
    private habitaciones: Habitacion[];

    constructor() {
        this.redNeuronal = new brain.NeuralNetwork();
        this.habitaciones = [
            { numero: 101, servicios: { desayuno: true, wifi: true, gimnasio: true, transporte: false } },
            { numero: 102, servicios: { desayuno: true, wifi: true, gimnasio: true, transporte: false } },
            { numero: 103, servicios: { desayuno: true, wifi: false, gimnasio: false, transporte: true } },
            { numero: 104, servicios: { desayuno: false, wifi: true, gimnasio: true, transporte: true } },
            { numero: 105, servicios: { desayuno: true, wifi: true, gimnasio: true, transporte: true } },
            // Otras habitaciones...
        ];

        // Entrenar la red neuronal
        const datosEntrenamiento = this.habitaciones.map(habitacion => ({
            input: this.convertirBooleanoANumero(habitacion.servicios),
            output: { [habitacion.numero.toString()]: 1 },
        }));
        this.redNeuronal.train(datosEntrenamiento);
    }

    private convertirBooleanoANumero(preferencias: Preferencias): number[] {
        return Object.values(preferencias).map(valor => (valor ? 1 : 0));
    }

    recomendarHabitaciones(preferencias: Preferencias): number[] {
        // Convertir las preferencias a números
        const preferenciasNumeros = this.convertirBooleanoANumero(preferencias);

        // Hacer una predicción con Brain.js
        const resultado = this.redNeuronal.run(preferenciasNumeros);

        // Obtener las habitaciones recomendadas basadas en la predicción
        const habitacionesRecomendadas = Object.keys(resultado)
            .filter(numero => resultado[numero] > 0.48) // Filtrar las habitaciones con una confianza mayor al 48%
            .map(numero => parseInt(numero));

        return habitacionesRecomendadas;
    }
}
