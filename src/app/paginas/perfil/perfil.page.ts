import { Component, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  profileImage: string | null = null;

  constructor(private photoService: PhotoService) { }

  ngOnInit() {
    console.log('Cargando imagen de perfil...');
    this.loadProfileImage();
  }

  async cambiarFoto() {
    const actionSheet = document.createElement('ion-action-sheet');
    actionSheet.header = 'Seleccionar Imagen';
    actionSheet.buttons = [
      {
        text: 'Tomar una foto',
        icon: 'camera',
        handler: async () => {
          await this.photoService.addNewToGallery();
          this.loadProfileImage(); 
        }
      },
      {
        text: 'Seleccionar desde la galería',
        icon: 'image',
        handler: async () => {
          await this.photoService.addNewToGallery(); 
          this.loadProfileImage(); 
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ];
    document.body.appendChild(actionSheet);
    await actionSheet.present();
  }

  async loadProfileImage() {
    await this.photoService.loadSaved();

    if (this.photoService.photos && this.photoService.photos.length > 0) {
      this.profileImage = this.photoService.photos[0].webviewPath || null;
    } else {
      this.profileImage = null;
    }
  }
}
