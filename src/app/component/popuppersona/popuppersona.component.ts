import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Marker } from 'src/app/models/marker';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-popuppersona',
  templateUrl: './popuppersona.component.html',
  styleUrls: ['./popuppersona.component.scss'],

  imports: [IonicModule, CommonModule], 
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopuppersonaComponent  implements OnInit {

  markers:Marker[]=[];
  constructor(
    private popoverController:PopoverController,
    private mapService:MapService,
  ) { }
  ionViewWillEnter() {
    this.loadMarkers();
  }
  async loadMarkers() {
    this.markers = await this.mapService.getUserMarkers();
  }
  centerMapOnMarker(marker: Marker): void {
    this.mapService.centerMapOnMarker(marker);
  }
  closePopover() {
    this.popoverController.dismiss();
  }
  ngOnInit() {}

}
