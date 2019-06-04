import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { NoticiasService } from '../../services/noticias.service';
import { Article } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  @ViewChild(IonSegment) segment: IonSegment;

  categorias = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  noticias: Article [] = [];
  constructor(private noticiaServices: NoticiasService) {}

  ngOnInit() {
    this.segment.value =  this.categorias[0]; /// para sselecionar uno al cargar el tab
    this.cargarNoticia(this.categorias[0]);
  }
  cambioNoticia(event) {
    this.noticias = [];
    this.cargarNoticia(event.detail.value);
    // console.log(event.detail.value); 
  }

  cargarNoticia(categoria: string, event?) {
    this.noticiaServices.getTopHeaddlinesCategoria(categoria).subscribe(resp => {
      this.noticias.push(...resp.articles);

      if (event) {
        event.target.complete();
      }
    });
  }

  loadData(evento) {
     this.cargarNoticia(this.segment.value, evento);
  }

}
