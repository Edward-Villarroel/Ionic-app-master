import { Component } from '@angular/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Map, tileLayer } from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
}
