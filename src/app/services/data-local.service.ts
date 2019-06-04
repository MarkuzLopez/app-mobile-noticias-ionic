import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  noticias: Article[] = [];

  constructor(private storage: Storage) {
    this.cargarFavoritos();
  }

  guardarNoticia(noticia: Article) {

    const existe =  this.noticias.find( news => news.title === noticia.title);

    if (!existe) {
      this.noticias.unshift(noticia); // la primera noticia
      this.storage.set('favoritos', this.noticias); // guardar todo el arreglo de noticias.
    }
  }

  async cargarFavoritos() {
    // this.storage.get('favoritos').then( favoritos => {
    //   console.log('favoritos', favoritos);
    // });
    const favoritos = await this.storage.get('favoritos');

    if (favoritos) {
      this.noticias = favoritos;
    }
  }

  borrarNoticia(noticia: Article ) {

    this.noticias = this.noticias.filter( noti => noti.title !== noticia.title );
    this.storage.set('favoritos', this.noticias);

  }
}
