import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import maplibregl, { LngLatLike } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { v4 as UUID } from 'uuid';
import { JsonPipe } from '@angular/common';

interface Marker {
  id: string;
  maplibreMarker: maplibregl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<maplibregl.Map | null>(null);
  markers = signal<Marker[]>([]);
  environments = environment;

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = this.divElement()!.nativeElement;

    const map = new maplibregl.Map({
      container: element, // container id
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${this.environments.api_key}`, // style URL
      center: [-43.183382, -22.971961], // starting position [lng, lat]
      zoom: 14, // starting zoom
      attributionControl: false, //remove mapLibre logo
    });

    map.on('style.load', () => {
      map.setProjection({
        type: 'globe', // Set projection to globe
      });
    });

    this.mapListeners(map);
  }

  mapListeners(map: maplibregl.Map) {
    map.on('click', (event) => {
      this.mapClick(event, map);
    });

    this.map.set(map);
  }

  mapClick(event: maplibregl.MapMouseEvent, map: maplibregl.Map) {
    // generic color for markers
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    // create marker
    const marker = new maplibregl.Marker({
      draggable: false,
      color: color,
    })
      .setLngLat(event.lngLat)
      .addTo(map);

    const newMarker: Marker = {
      id: UUID(),
      maplibreMarker: marker,
    };
    this.markers.update((markers) => [newMarker, ...this.markers()]);
    // this.markers.set([newMarker, ...this.markers()]);
    console.log(this.markers());
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;
    this.map()?.flyTo({
      center: lngLat,
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;
    const map = this.map();
    marker.maplibreMarker.remove();

    this.markers.set(this.markers().filter((m) => m.id !== marker.id));
    // this.markers.update(this.markers().filter((m) => m.id !== marker.id));
  }
}
