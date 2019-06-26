import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';


@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  label = '';
  constructor(
    private router: Router,
    public title: Title,
    public meta: Meta
  ) {

this.getDataRouter()
    .subscribe( data => {
       this.label = data.titulo;
       this.title.setTitle(this.label);
       // tslint:disable-next-line:prefer-const
       let metaTag: MetaDefinition = {
       name: 'description',
       content: this.label
       };
       this.meta.updateTag(metaTag);
      });
}
  ngOnInit() {
  }
getDataRouter() {
    return this.router.events
    .pipe(
    filter( evento => evento instanceof ActivationEnd ),
    filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
    map( (evento: ActivationEnd) => evento.snapshot.data));
}
 }
