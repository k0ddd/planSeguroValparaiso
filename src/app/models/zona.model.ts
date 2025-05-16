interface Zona {
    _id?: string;
    nombre: string;
    ubicacion: {
      latitud: number;
      longitud: number;
    };
  }