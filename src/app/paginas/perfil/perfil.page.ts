import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  @ViewChild('profileAvatar', { static: true }) avatarElement?: ElementRef;

  constructor() { }

  ngOnInit() { }

  async cambiarFoto() {
    // Crear un Action Sheet para que el usuario elija entre tomar una foto o seleccionar desde la galería
    const actionSheet = document.createElement('ion-action-sheet');
    actionSheet.header = 'Seleccionar Imagen';
    actionSheet.buttons = [
      {
        text: 'Tomar una foto',
        icon: 'camera',
        handler: async () => {
          await this.tomarFoto(CameraSource.Camera);
        }
      },
      {
        text: 'Seleccionar desde la galería',
        icon: 'image',
        handler: async () => {
          await this.tomarFoto(CameraSource.Photos);
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

  async tomarFoto(source: CameraSource) {
    try {
      // Obtener la imagen desde la cámara o galería
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: source
      });

      // URL de la imagen seleccionada o tomada
      const imageUrl = image.webPath;

      // Verificar si el URL de la imagen es válido y luego actualizar el elemento img
      if (imageUrl && this.avatarElement) {
        this.avatarElement.nativeElement.src = imageUrl;
      }
    } catch (error) {
      console.error('Error al tomar o seleccionar la foto:', error);
    }
  }
}
