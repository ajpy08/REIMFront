import { Material } from './materiales/material.models';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable()
export class AlmacenService {
  material: Material;
  constructor(
    public http: HttpClient,
    public router: Router
  ) { }
}
