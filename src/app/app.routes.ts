import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuard, VerificaTokenGuard } from './services/service.index';

const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {
        path: '',
        canActivate: [ LoginGuard ],
        canActivateChild: [ VerificaTokenGuard ],
        component: PagesComponent,
        loadChildren: './pages/pages.module#PagesModules'
    }

];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true});
