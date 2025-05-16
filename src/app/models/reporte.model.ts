export interface Reporte {
  tipo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  fecha: Date;
  imagen: string; // URL o base64
}