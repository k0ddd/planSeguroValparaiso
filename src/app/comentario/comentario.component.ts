import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon,
  IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonTabButton, IonFooter,
  IonTabBar, IonLabel, IonSearchbar, IonTabs, IonMenu, IonTextarea, IonItem, IonSelect, IonSelectOption, IonInput
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { ReporteService } from '../services/reporte.service';
import { addIcons } from 'ionicons';
import {
  personOutline, homeOutline, settingsOutline,
  chatboxEllipsesOutline, cameraOutline, reorderFourOutline, optionsOutline,
  megaphoneOutline, trashOutline, flagOutline, warningOutline
} from 'ionicons/icons';
import { AlertController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';

addIcons({
  personOutline, homeOutline, settingsOutline,
  chatboxEllipsesOutline, cameraOutline, reorderFourOutline, optionsOutline,
  megaphoneOutline, trashOutline, flagOutline, warningOutline
});

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.scss'],
  imports: [
    IonButton, IonHeader, IonTabs, IonTabButton, IonCardContent, IonCard, IonCardHeader, IonCardTitle,
    IonButtons, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonTabBar, IonIcon,
    IonLabel, IonSearchbar, RouterLink, IonMenu, IonTextarea, IonItem, IonSelect, IonSelectOption, IonInput,
    CommonModule, ReactiveFormsModule // Agrega ReactiveFormsModule aquí
  ],
  animations: [
    trigger('formAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px) scale(0.98)' }),
        animate('300ms cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(.35,0,.25,1)', style({ opacity: 0, transform: 'translateY(40px) scale(0.98)' }))
      ])
    ])
  ]
})
export class ComentarioComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent; // Referencia al contenido de la página
  mostrarFormulario = false;
  reporteForm: FormGroup;
  reportes: any[] = [];
  imagenSeleccionada: File | null = null;

  constructor(private fb: FormBuilder, private reporteService: ReporteService, private alertController: AlertController) {
    this.reporteForm = this.fb.group({
      tipo: [''],
      descripcion: [''],
      ubicacion: [''],
      imagen: [null]
    });

    // Agrega los íconos aquí
    addIcons({
      personOutline, homeOutline, settingsOutline,
      chatboxEllipsesOutline, cameraOutline, reorderFourOutline, optionsOutline, megaphoneOutline, trashOutline
    });
  }

  ngOnInit() {
    this.obtenerReportes();
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (this.mostrarFormulario) {
      this.content.scrollToTop(300); // Desplaza hacia arriba con una animación de 300ms
    }
  }

  onFileChange(event: any) {
    this.imagenSeleccionada = event.target.files[0];
  }

  onSubmit() {
    if (this.reporteForm.valid) {
      const ubicacionTexto = this.reporteForm.get('ubicacion')?.value;
      
      if (ubicacionTexto && ubicacionTexto.trim()) {
        console.log('🔍 Geocodificando ubicación:', ubicacionTexto);
        
        // 🔧 USAR GEOCODIFICACIÓN para convertir texto a coordenadas
        this.geocodificarUbicacion(ubicacionTexto).then((coordenadas) => {
          if (coordenadas) {
            console.log('✅ Coordenadas obtenidas:', coordenadas);
            this.crearReporteConCoordenadas(coordenadas.lat, coordenadas.lng, ubicacionTexto);
          } else {
            alert('No se pudo encontrar la ubicación especificada. Verifica la dirección.');
          }
        }).catch((error) => {
          console.error('Error en geocodificación:', error);
          alert('Error al procesar la ubicación. Intenta nuevamente.');
        });
      } else {
        alert('Por favor ingresa una ubicación válida.');
      }
    } else {
      alert('Por favor completa todos los campos requeridos.');
    }
  }

  // 🔧 NUEVO MÉTODO para geocodificar
  async geocodificarUbicacion(direccion: string): Promise<{lat: number, lng: number} | null> {
    try {
      // Usar servicio de geocodificación gratuito
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}, Valparaíso, Chile&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Error en geocodificación:', error);
      return null;
    }
  }

  // 🔧 NUEVO MÉTODO para crear reporte con coordenadas
  crearReporteConCoordenadas(lat: number, lng: number, ubicacionTexto: string) {
    // 🔧 CREAR FormData correctamente
    const formData = new FormData();
    formData.append('tipo', this.reporteForm.get('tipo')?.value);
    formData.append('descripcion', this.reporteForm.get('descripcion')?.value);
    formData.append('latitud', lat.toString());
    formData.append('longitud', lng.toString());
    formData.append('ubicacion', ubicacionTexto); // 🔧 USAR el texto que escribió el usuario
    formData.append('fecha', new Date().toISOString());
    
    // 🔧 AGREGAR imagen si existe
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
      console.log('📷 Imagen agregada al FormData:', this.imagenSeleccionada.name);
    }
    
    console.log('📤 Enviando reporte con coordenadas geocodificadas');
    
    this.reporteService.crearReporte(formData).subscribe({
      next: (response) => {
        console.log('✅ Reporte creado:', response);
        this.mostrarFormulario = false;
        this.reporteForm.reset();
        this.imagenSeleccionada = null;
        this.obtenerReportes();
      },
      error: (error: any) => {
        console.error('❌ Error al crear el reporte:', error);
        alert('Error al crear el reporte. Intenta nuevamente.');
      }
    });
  }


  obtenerReportes() {
    this.reporteService.getReportes().subscribe({
      next: (response: any) => {
        this.reportes = response;
        console.log('📋 Reportes obtenidos:', this.reportes);
        
        // 🔧 MEJORAR: Debug de imágenes
        this.reportes.forEach(reporte => {
          if (reporte.imagen) {
            console.log('🖼️ Imagen encontrada:', reporte.imagen);
            console.log('🔗 URL procesada:', this.getImageUrl(reporte.imagen));
          }
        });
      },
      error: (error: any) => {
        console.error('❌ Error al obtener reportes:', error);
      }
    });
  }
  eliminarReporte(id: string) {
    this.reporteService.eliminarReporte(id).subscribe({
      next: () => {
        this.reportes = this.reportes.filter(r => r._id !== id);
        console.log('Reporte eliminado correctamente');
      },
      error: (error: any) => {
        console.error('Error al eliminar reporte:', error);
      }
    });
  }

  async abrirOpcionesReporte(reporte: any) {
    const alert = await this.alertController.create({
      header: '¿Qué deseas reportar de este contenido?',
      inputs: [
        { name: 'spam', type: 'radio', label: 'Spam', value: 'spam' },
        { name: 'sexual', type: 'radio', label: 'Contenido sexual o explícito', value: 'sexual' },
        { name: 'ofensivo', type: 'radio', label: 'Contenido ofensivo', value: 'ofensivo' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Reportar',
          handler: (tipo) => {
            this.enviarReporteInadecuado(reporte, tipo);
          }
        }
      ]
    });

    await alert.present();
  }

  enviarReporteInadecuado(reporte: any, tipo: string) {
    console.log('Contenido reportado:', reporte, 'Motivo:', tipo);
    // Aquí podrías enviar el reporte a tu backend o mostrar un mensaje de éxito
  }

  imageLoaded = false;

  onImageLoad(event: any) {
    console.log('✅ Imagen cargada correctamente:', event.target.src);
    this.imageLoaded = true;
  }

  onImageError(event: any) {
    console.error('❌ Error al cargar imagen:', event.target.src);
    this.imageLoaded = false;
  }

  // 🔧 NUEVO MÉTODO para manejar URLs de imagen
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    
    // Si ya es una URL completa (empieza con http), devolverla tal como está
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Si es una ruta relativa, agregar el servidor local
    return `http://localhost:3000/${imagePath}`;
  }
}



