import { Injectable } from '@nestjs/common';
import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client/core';
import { fetch } from 'cross-fetch';

@Injectable()
export class GraphqlService {
    private client: ApolloClient<any>;

    constructor() {
        const httpLink = createHttpLink({
            uri: 'https://jv-gateway-production.up.railway.app/graphql',
            fetch,
        });

        this.client = new ApolloClient({
            link: httpLink,
            cache: new InMemoryCache(),
        });
    }

    async obtenerServiciosPorHabitacion(idHabitacion: string): Promise<string[]> {
        const query = gql`
          query ($id: String!) {
            getServicesByRoom(id: $id) {
              service {
                name
              }
            }
          }
        `;

        try {
            const response = await this.client.query<{ getServicesByRoom: { service: { name: string } }[] }>({
                query,
                variables: { id: idHabitacion },
            });
            return response.data.getServicesByRoom.map(s => s.service.name);
        } catch (error) {
            throw new Error(`Error al obtener los servicios de la habitación con ID ${idHabitacion}: ${error.message}`);
        }
    }

    async obtenerTodasLasHabitaciones(): Promise<{ id: string; nroRoom: string }[]> {
        const query = gql`
          query {
            getAllRooms {
              id
              nroRoom
            }
          }
        `;

        try {
            const response = await this.client.query<{ getAllRooms: { id: string; nroRoom: string }[] }>({
                query,
            });
            return response.data.getAllRooms;
        } catch (error) {
            throw new Error(`Error al obtener todas las habitaciones: ${error.message}`);
        }
    }

    async obtenerTodosLosServicios(): Promise<string[]> {
        const query = gql`
          query {
            getAllServices {
              name
            }
          }
        `;

        try {
            const response = await this.client.query<{ getAllServices: { name: string }[] }>({
                query,
            });
            return response.data.getAllServices.map(service => service.name);
        } catch (error) {
            throw new Error(`Error al obtener todos los servicios: ${error.message}`);
        }
    }
}
