import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { HouseProperty } from '../../../interfaces/houses.interfaces';
import maplibregl from 'maplibre-gl';
import { environment } from '../../../../environments/environment';

/**
 * width 100%
 * height 260px
 */

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styles: `
    div {
      width: 100%;
      height: 260px;
    }
  `,
})
export class MiniMapComponent implements AfterViewInit {
  // lngLat = input.required<maplibregl.LngLatLike>();
  lngLat = input.required<{ lng: number; lat: number }>();
  zoom = input<number>(14);

  divElement = viewChild<ElementRef>('map');
  map = signal<maplibregl.Map | null>(null);
  environments = environment;

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = this.divElement()!.nativeElement;

    const map = new maplibregl.Map({
      container: element, // container id
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${this.environments.api_key}`, // style URL maptiler
      center: this.lngLat(), // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
      attributionControl: false, //remove mapLibre logo
      interactive: false,
      pitch: 40,
    });

    map.on('style.load', () => {
      map.setProjection({
        type: 'globe', // Set projection to globe
      });
    });

    new maplibregl.Marker().setLngLat(this.lngLat()).addTo(map);
  }
}
