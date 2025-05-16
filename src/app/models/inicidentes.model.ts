interface Incidente {
    _id?: string;
    titulo: string;
    descripcion: string;
    ubicacion: {
      latitud: number;
      longitud: number;
    };
    fecha: Date;
    usuario: string;
    comentarios: string[];
    fotos: string[];
  }