import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuard, VerificaTokenGuard } from './services/service.index';
import { RegistroComponent } from './registro/registro.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';

const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {
        path: '',
        canActivate: [ LoginGuard ],
        canActivateChild: [ VerificaTokenGuard ],
        component: PagesComponent,
        loadChildren: './pages/pages.module#PagesModules'
    },

    {path: 'registro', component: RegistroComponent},
    {
        path: '',
        component: PagesComponent,
        loadChildren: './pages/pages.module#PagesModules'
    },
    
    // otherwise redirect to home
    { path: '**', component: NotfoundComponent }   

];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true});
