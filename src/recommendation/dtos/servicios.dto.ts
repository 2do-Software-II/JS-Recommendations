export class ServicioDTO {
    servicio: string;
    habilitado: boolean;
}

export class ServiciosEntradaDTO {
    servicios: ServicioDTO[];
}

export class ServiciosSalidaDTO {
    [key: string]: boolean;
}