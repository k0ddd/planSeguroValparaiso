import { Component, OnInit, AfterViewInit } from '@angular/core'; // 🔧 Agregar AfterViewInit
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet.heat';
import 'leaflet-routing-machine';

import { ReporteService } from '../services/reporte.service';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonInput, IonSearchbar, IonTabButton, IonFooter, IonTabBar, IonTabs, IonMenu, MenuController, IonPopover, IonList
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import {
  personOutline, homeOutline, settingsOutline, chatboxEllipsesOutline, closeOutline,
  cameraOutline, reorderFourOutline, optionsOutline,
  search
} from 'ionicons/icons';
interface HeatLayerFunction {
  (latlngs: [number, number, number][], options?: any): any;
}

interface RoutingControlFunction {
  (options?: any): any;
}

declare global {
  namespace L {
    const heatLayer: HeatLayerFunction;
  }
}

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/icon/marker-icon-2x.png',
  iconUrl: 'assets/icon/marker-icon.png',
  shadowUrl: 'assets/icon/marker-shadow.png',
});

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonInput,
    IonSearchbar,
    IonPopover,IonList
  ],
})
export class HomePage implements OnInit, AfterViewInit { // 🔧 Implementar AfterViewInit
  colorSeleccionado: string = 'transparent';
  mostrarPopover = false;
  tipoSeleccionado: string = '';

  usuario: any;
  correo: string = '';
  private map: any;
  private heatLayer: any; // ✅ Declaración aquí
  mostrarFormulario = false;
  animatingOut = false;
  reporteForm: FormGroup;
  private heatLayersByTipo: {[tipo: string]: any} = {}; // para guardar capas heatmap por tipo
  private ubicacionActual: L.LatLng | null = null; // 👈 Guardar ubicación actual
  private routingControl: any; // 👈 Control de ruta
  private mapInitialized = false; // 🔧 Bandera para controlar inicialización
    actualizarColor(tipo: string) {
    switch (tipo) {
      case 'robo':
        this.colorSeleccionado = 'rgba(255,0,0,1)';
        break;
      case 'accidente':
        this.colorSeleccionado = 'rgba(0,0,255,1)';
        break;
      case 'incendio':
        this.colorSeleccionado = 'rgba(255,80,0,1)';
        break;
      case 'violencia':
        this.colorSeleccionado = 'rgba(128,0,128,1)';
        break;
      case 'otro':
        this.colorSeleccionado = 'rgba(80,80,80,1)';
        break;
      default:
        this.colorSeleccionado = 'transparent';
    }
    this.reporteForm.get('tipo')?.setValue(tipo);
  }

  abrirPopover(ev: any) {
  this.mostrarPopover = true;
}

  seleccionarTipo(tipo: string) {
  this.tipoSeleccionado = tipo;
  this.mostrarPopover = false;
  this.actualizarColor(tipo);
}



  constructor(
    private authService: AuthService,
    private router: Router,
    private menu: MenuController,
    private fb: FormBuilder,
    private reporteService: ReporteService
  ) {
    this.reporteForm = this.fb.group({
      tipo: [''],
      descripcion: [''],
      ubicacion: [''] // 🔧 AGREGAR esta línea
    });

    addIcons({
      personOutline, homeOutline, settingsOutline,
      chatboxEllipsesOutline, cameraOutline, reorderFourOutline, optionsOutline, closeOutline
    });
  }

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    console.log('HomePage inicializado');
    this.obtenerUbicacionActual();
  }

  ngAfterViewInit() {
    console.log('🔧 ngAfterViewInit ejecutado');
    
    // 🔧 Solo inicializar si no está ya inicializado
    if (!this.mapInitialized) {
      this.usuario = this.authService.getUsuario();
      setTimeout(() => {
        this.initMap();
      }, 300);
    } else {
      // 🔧 Si ya está inicializado, solo invalidar tamaño y recargar reportes
      console.log('🔧 Mapa ya inicializado, recargando reportes...');
      if (this.map) {
        this.map.invalidateSize();
        setTimeout(() => {
          this.cargarReportesEnMapa();
        }, 500);
      }
    }
  }

  cerrarSesion() {
    this.authService.eliminarToken();
    console.log('Token eliminado del almacenamiento local');
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menu.toggle();
  }




  private async obtenerDireccionDesdeCoordenadas(lat: number, lng: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    } else {
      return `${lat}, ${lng}`;
    }
  } catch (error) {
    console.error('Error al obtener dirección:', error);
    return `${lat}, ${lng}`;
  }
}


private obtenerGradientePorTipo(tipo: string) {
  switch (tipo.toLowerCase()) {
    case 'robo':
      return { 0.0: 'rgba(255,0,0,0.2)', 0.4: 'rgba(255,0,0,0.7)', 1.0: 'rgba(255,0,0,1)' }; // rojo más visible
    case 'accidente':
      return { 0.0: 'rgba(0,0,255,0.2)', 0.4: 'rgba(0,0,255,0.7)', 1.0: 'rgba(0,0,255,1)' }; // azul fuerte
    case 'incendio':
      return { 0.0: 'rgba(255,100,0,0.2)', 0.4: 'rgba(255,100,0,0.7)', 1.0: 'rgba(255,80,0,1)' }; // naranja más intenso
    case 'violencia':
      return { 0.0: 'rgba(180,0,180,0.2)', 0.4: 'rgba(180,0,180,0.7)', 1.0: 'rgba(128,0,128,1)' }; // púrpura saturado
    default:
      return { 0.0: 'rgba(100,100,100,0.2)', 0.4: 'rgba(100,100,100,0.7)', 1.0: 'rgba(80,80,80,1)' }; // gris fuerte
  }
}


 private initMap(): void {
  console.log('Inicializando mapa...');
  
  // 🔧 AGREGAR VALIDACIÓN
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.log('⚠️ Elemento del mapa no encontrado, saltando inicialización');
    return;
  }
  
  // 🔧 Verificar que el contenedor tenga dimensiones válidas
  const mapDiv = document.getElementById('map');
  if (!mapDiv) {
    console.error('No se encontró el div con id "map"');
    return;
  }

  console.log('Tamaño del div del mapa:', mapDiv.clientWidth, 'x', mapDiv.clientHeight);

  // 🔧 Si el contenedor no tiene dimensiones, esperar más tiempo
  if (mapDiv.clientWidth === 0 || mapDiv.clientHeight === 0) {
    console.warn('El contenedor no tiene dimensiones válidas, reintentando...');
    setTimeout(() => this.initMap(), 300);
    return;
  }

  // 🔧 Marcar como inicializado ANTES de crear el mapa
  this.mapInitialized = true;

  // 📍 Coordenadas de Valparaíso
  const valparaisoCenter: L.LatLngExpression = [-33.0458, -71.6197];
  
  // 🔧 Bounds corregidos
  const bounds: L.LatLngBoundsExpression = [
    [-33.0700, -71.6800], // Suroeste
    [-33.0200, -71.5800]  // Noreste
  ];

  this.map = L.map('map', {
    center: valparaisoCenter,
    zoom: 14,
    zoomControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
  });

  // 🗺️ Capa base OSM
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(this.map);

  // 🔧 Esperar a que el mapa esté listo antes de agregar capas de calor
  this.map.whenReady(() => {
    console.log('Mapa listo, agregando capas de calor...');
    
    // Forzar recalcular el tamaño
    this.map.invalidateSize();
    
    // 📍 Geolocalización del usuario
    this.map.locate({ setView: true, maxZoom: 16 });

    const userIcon = L.icon({
      iconUrl: 'assets/icon/pin-outline.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    this.map.on('locationfound', (e: L.LocationEvent) => {
      this.ubicacionActual = e.latlng;
      const userMarker = L.marker(e.latlng, { icon: userIcon }).addTo(this.map);
      userMarker.bindPopup('Estás aquí').openPopup();
    });

    this.map.on('locationerror', (e: L.ErrorEvent) => {
      console.error('Error al obtener la ubicación:', e.message);
      alert('No se pudo obtener tu ubicación.');
    });

    // 🔍 Barra de búsqueda centrada en Valparaíso
    const provider = new OpenStreetMapProvider({
      params: {
        countrycodes: 'CL',
        viewbox: '-71.674, -33.002, -71.540, -71.101',
        bounded: 1,
      },
    });

    const customIcon = L.icon({
      iconUrl: 'assets/icon/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'assets/icon/marker-shadow.png',
      shadowSize: [41, 41]
    });

    const SearchControlClass: any = GeoSearchControl;
    const searchControl = new SearchControlClass({
      provider,
      style: 'bar',
      searchLabel: '¿Dónde quieres ir?',
      autoClose: true,
      showMarker: true,
      marker: {
        icon: customIcon,
        draggable: false,
      },
      retainZoomLevel: false,
    }) as L.Control;

    this.map.addControl(searchControl);

    // 📍 Evento personalizado al seleccionar resultado
    this.map.on('geosearch/showlocation', (result: any) => {
      const destino = result.location;
      if (this.ubicacionActual) {
        this.trazarRuta(this.ubicacionActual, L.latLng(destino.y, destino.x));
      } else {
        alert('Ubicación actual no disponible.');
      }
    });

    // 🔥 CARGAR REPORTES REALES DESDE LA BASE DE DATOS
    setTimeout(() => {
      this.cargarReportesEnMapa();
    }, 1000);
  });
}

  

  // 🔴 NUEVO: Generar zonas de calor como círculos para evitar
  private generarZonasDeCalor(): L.Circle[] {
    const zonas: L.Circle[] = [];
    const radioZona = 50; // metros

    for (const tipo in this.heatLayersByTipo) {
      const capa = this.heatLayersByTipo[tipo];
      const heatData: any[] = capa._latlngs || [];

      for (const [lat, lng, _] of heatData) {
        const circulo = L.circle([lat, lng], { radius: radioZona, color: 'transparent' });
        zonas.push(circulo);
      }
    }
    return zonas;
  }

  // 🔴 NUEVO: Verifica si la ruta cruza alguna zona de calor
  private rutaCruzaZonaDeCalor(coordinates: L.LatLng[], zonas: L.Circle[]): boolean {
    for (const punto of coordinates) {
      for (const zona of zonas) {
        if (zona.getBounds().contains(punto)) {
          const dist = punto.distanceTo(zona.getLatLng());
          if (dist <= zona.getRadius()) {
            return true;
          }
        }
      }
    }
    return false;
  }  

private trazarRuta(origen: L.LatLng, destino: L.LatLng) {
  console.log('🧭 Trazando ruta desde:', origen, 'hasta:', destino); 

  if (this.routingControl) {
    this.map.removeControl(this.routingControl);
    console.log('🧹 Control de ruta anterior eliminado'); 
  }
  
const routingControl: any = L.Routing.control({
  waypoints: [origen, destino],
  routeWhileDragging: true,
  showAlternatives: true,
}).addTo(this.map);

this.routingControl = routingControl;

  this.routingControl.on('routesfound', (e: any) => {
    const route = e.routes[0];
    const coordinates: L.LatLng[] = route.coordinates;

    console.log('✅ Ruta encontrada con', coordinates.length, 'coordenadas'); 

    const zonasDeCalor = this.generarZonasDeCalor();

    if (this.rutaCruzaZonaDeCalor(coordinates, zonasDeCalor)) {
      console.warn('⚠️ La ruta pasa por una zona de calor');
      alert('⚠️ La ruta pasa por una zona de calor. Intenta otro destino o ten precaución.');
      this.map.removeControl(this.routingControl);
    } else {
      console.log('🛣️ Ruta segura, sin zonas de calor cercanas');
    }
  });

  this.routingControl.on('routingerror', function(err: any) {
    console.error('❌ Error al encontrar ruta:', err); // <-- OPCIONAL
  });
}

  // Verifica si un punto está cerca de una zona de calor
  private estaCercaDeZonaDeCalor(punto: L.LatLng, distanciaMax: number): boolean {
    for (const tipo in this.heatLayersByTipo) {
      const capa = this.heatLayersByTipo[tipo];
      const heatData: any[] = capa._latlngs || [];

      for (const [lat, lng, _] of heatData) {
        const dist = this.map.distance(punto, L.latLng(lat, lng));
        if (dist <= distanciaMax) {
          return true;
        }
      }
    }
    return false;
  }



  toggleFormulario() {
    if (this.mostrarFormulario && !this.animatingOut) {
      // Inicia la animación de salida
      this.animatingOut = true;
      setTimeout(() => {
        this.mostrarFormulario = false;
        this.animatingOut = false; // Resetea el estado
      }, 500); // Debe coincidir con la duración de la animación de salida
    } else if (!this.mostrarFormulario) {
      // Muestra el formulario
      this.mostrarFormulario = true;
      this.obtenerUbicacionActual();
    }
  }

obtenerUbicacionActual() {
  if (navigator.geolocation) {
    console.log('Intentando obtener ubicación...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Ubicación obtenida:', position);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Centrar el mapa en la ubicación actual
        this.map.setView([lat, lng], 16);
        
        // 🔧 AGREGAR: Llenar el campo ubicación en el formulario
        try {
          const direccion = await this.obtenerDireccionDesdeCoordenadas(lat, lng);
          this.reporteForm.get('ubicacion')?.setValue(direccion);
        } catch (error) {
          // Si falla la API, mostrar coordenadas formateadas
          const direccionAmigable = `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)} - Valparaíso`;
          this.reporteForm.get('ubicacion')?.setValue(direccionAmigable);
        }
      },
      (error) => {
        console.error('Error al obtener ubicación:', error);
        alert('No se pudo obtener la ubicación actual.');
        
        // 🔧 AGREGAR: Mostrar error en el campo ubicación
        this.reporteForm.get('ubicacion')?.setValue('❌ No se pudo obtener la ubicación');
      }
    );
  } else {
    alert('La geolocalización no es compatible.');
    
    // 🔧 AGREGAR: Mostrar mensaje en el campo ubicación
    this.reporteForm.get('ubicacion')?.setValue('❌ Geolocalización no disponible');
  }
}




  onSubmit() {
    if (this.reporteForm.valid) {
      const formData = this.reporteForm.value;
      const tipo = formData.tipo || 'otro';

      // Obtener coordenadas actuales si están disponibles
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Crear el objeto reporte con las coordenadas
            const nuevoReporte = {
              tipo: formData.tipo,
              descripcion: formData.descripcion,
              latitud: lat,
              longitud: lng,
              ubicacion: `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)} - Valparaíso`, // 🔧 MANTENER esta línea
              fecha: new Date(),
              imagen: '' // Se puede agregar después si es necesario
            };

            // Enviar reporte al servidor
            this.reporteService.crearReporte(nuevoReporte).subscribe({
              next: (res) => {
                console.log('Reporte enviado:', res);
                alert('Reporte enviado con éxito.');

                // Agregar punto al mapa de calor inmediatamente
                if (!this.heatLayersByTipo[tipo]) {
                  const gradient = this.obtenerGradientePorTipo(tipo);
                  this.heatLayersByTipo[tipo] = L.heatLayer([], {
                    radius: 25,
                    blur: 15,
                    maxZoom: 17,
                    gradient
                  }).addTo(this.map);
                }
                this.heatLayersByTipo[tipo].addLatLng([lat, lng, 0.7]);

                this.mostrarFormulario = false;
                this.reporteForm.reset();
              },
              error: (err) => {
                console.error('Error al enviar reporte:', err);
                alert('Error al enviar el reporte. Intenta nuevamente.');
              }
            });
          },
          (error) => {
            console.error('Error al obtener ubicación:', error);
            alert('No se pudo obtener la ubicación actual. El reporte no se puede enviar.');
          }
        );
      } else {
        alert('La geolocalización no está disponible en este dispositivo.');
      }
    } else {
      alert('Por favor completa todos los campos requeridos.');
    }
  }

  // 🔥 MEJORADO: Método para cargar reportes existentes desde la base de datos
  private cargarReportesEnMapa() {
    console.log('🔥 Cargando reportes desde la base de datos...');
    
    // 🔧 Limpiar capas existentes para evitar duplicados
    for (const tipo in this.heatLayersByTipo) {
      if (this.heatLayersByTipo[tipo] && this.map) {
        this.map.removeLayer(this.heatLayersByTipo[tipo]);
      }
    }
    this.heatLayersByTipo = {};
    
    this.reporteService.getReportes().subscribe({
      next: (reportes) => {
        console.log('📊 Reportes obtenidos para el mapa:', reportes);
        
        if (!reportes || reportes.length === 0) {
          console.log('📝 No hay reportes para mostrar en el mapa');
          return;
        }
        
        // 🔧 Agrupar reportes por tipo para crear capas más eficientes
        const reportesPorTipo: { [key: string]: [number, number, number][] } = {};
        
        reportes.forEach(reporte => {
          const lat = reporte.latitud;
          const lng = reporte.longitud;
          const tipo = reporte.tipo || 'otro';
          
          console.log(`📍 Procesando reporte: ${tipo} en [${lat}, ${lng}]`);
          
          if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            if (!reportesPorTipo[tipo]) {
              reportesPorTipo[tipo] = [];
            }
            reportesPorTipo[tipo].push([lat, lng, 0.7]);
          } else {
            console.warn('⚠️ Coordenadas inválidas para el reporte:', reporte);
          }
        });
        
        // 🔧 Crear capas de calor por tipo
        for (const tipo in reportesPorTipo) {
          if (reportesPorTipo[tipo].length > 0) {
            console.log(`🔥 Creando capa de calor para: ${tipo} con ${reportesPorTipo[tipo].length} puntos`);
            
            const gradient = this.obtenerGradientePorTipo(tipo);
            this.heatLayersByTipo[tipo] = L.heatLayer(reportesPorTipo[tipo], {
              radius: 25,
              blur: 15,
              maxZoom: 17,
              gradient
            }).addTo(this.map);
          }
        }
        
        console.log('🎯 Capas de calor creadas:', Object.keys(this.heatLayersByTipo));
      },
      error: (error) => {
        console.error('❌ Error al cargar reportes para el mapa:', error);
      }
    });
  }
}
