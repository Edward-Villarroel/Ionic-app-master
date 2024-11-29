import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Marker } from 'src/app/models/marker';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-popuptienda',
  templateUrl: './popuptienda.component.html',
  styleUrls: ['./popuptienda.component.scss'],

  imports: [IonicModule, CommonModule], 
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopuptiendaComponent  implements OnInit {
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

  closePopover() {
    this.popoverController.dismiss();
  }
  ngOnInit() {}

}
