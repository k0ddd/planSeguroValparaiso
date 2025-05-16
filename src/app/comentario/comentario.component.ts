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
  chatboxEllipsesOutline, cameraOutline, reorderFourOutline, optionsOutline, megaphoneOutline, trash,
  trashOutline
} from 'ionicons/icons';

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
})
export class ComentarioComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent; // Referencia al contenido de la página
  mostrarFormulario = false;
  reporteForm: FormGroup;
  reportes: any[] = [];
  imagenSeleccionada: File | null = null;

  constructor(private fb: FormBuilder, private reporteService: ReporteService) {
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
  const formData = new FormData();
  formData.append('tipo', this.reporteForm.get('tipo')?.value);
  formData.append('descripcion', this.reporteForm.get('descripcion')?.value);
  formData.append('ubicacion', this.reporteForm.get('ubicacion')?.value);

  const usuarioId = localStorage.getItem('usuarioId');
  if (usuarioId) {
    formData.append('usuarioId', usuarioId);
  }

  if (this.imagenSeleccionada) {
    formData.append('imagen', this.imagenSeleccionada);
  }

  this.reporteService.crearReporte(formData).subscribe({
    next: (response) => {
      console.log('Reporte creado:', response);
      this.mostrarFormulario = false;
      this.obtenerReportes();
    },
    error: (error: any) => {
      console.error('Error al crear el reporte:', error);
    }
  });
}


  obtenerReportes() {
    this.reporteService.getReportes().subscribe(response => {
      this.reportes = response;
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
}


