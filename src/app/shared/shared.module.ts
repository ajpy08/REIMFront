import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
// Pipes
import { PipesModule } from '../pipes/pipes.module';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { ModalDropzoneComponent } from '../components/modal-dropzone/modal-dropzone.component';
import { NotfoundComponent } from './notfound/notfound.component';


@NgModule({

    imports: [
        RouterModule,
        CommonModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule
        ],
    declarations: [
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        ModalUploadComponent,
        ModalDropzoneComponent,
        NotfoundComponent
    ],
    exports: [
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        ModalUploadComponent,
        ModalDropzoneComponent
     ]
    })
    export class SharedModule {}
