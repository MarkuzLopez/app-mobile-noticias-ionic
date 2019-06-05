import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/interfaces';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { ActionSheetController, Platform } from '@ionic/angular';
import { DataLocalService } from '../../services/data-local.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticia: Article;
  @Input() indice: number;
  @Input() enFavoritos;

  constructor(private inBrowserApp: InAppBrowser, 
              private aactionSheetCtrl: ActionSheetController, 
              private socialSharing: SocialSharing,
              private dataLocal: DataLocalService,
              private toastController: ToastController,
              private platform: Platform) { }

  ngOnInit() {}

  verNoticia() {
    const browser = this.inBrowserApp.create(this.noticia.url);
  }

  async presentToast(mensagge: string) {
    const toast = await this.toastController.create({
      message: mensagge,
      duration: 2000
    });
    toast.present();
  }

  async lanzarMenu() {

    let guardarBorrarBtn;

    if (this.enFavoritos) {
      // borrar de favoritos
      guardarBorrarBtn = {
        text: 'Borrar Favorito',
        icon: 'trash',
        cssClass: 'action-dark',
        handler: () => {
          let mensaje = 'Borrado de Favoritos';
          console.log('Borrar de favorito');
          this.presentToast(mensaje);
          this.dataLocal.borrarNoticia(this.noticia);
        }
      };
    } else {
      guardarBorrarBtn = {
        text: 'Favorito',
        icon: 'star',
        cssClass: 'action-dark',
        handler: () => {
          let mensaje = 'Agregado a Favoritos';
          console.log('Favorito');
          this.presentToast(mensaje);
          this.dataLocal.guardarNoticia(this.noticia);
        }
      };
    }

    const actionSheet = await this.aactionSheetCtrl.create({
      buttons: [
      {
        text: 'Compartir',
        icon: 'share',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Share clicked');
          this.compartirNoticia();
        }
      },
      guardarBorrarBtn
      , {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  compartirNoticia() {
    if (this.platform.is('cordova')) {

        this.socialSharing.share(
        this.noticia.title,
        this.noticia.source.name,
        '',
        this.noticia.url
      );

    } else {
      if (navigator['share']) {
        navigator['share']({
            title: this.noticia.title,
            text: this.noticia.description,
            url: this.noticia.url,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        alert('No se pudo comparti porque no se soporta');
      }
    }
  }

}
