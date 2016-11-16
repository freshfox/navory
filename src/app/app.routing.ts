import {Routes, RouterModule} from '@angular/router';

import {PublicRoutes} from './public/public.routes';
import {InternalRoutes} from './internal/internal.routes';

export const appRoutes: Routes = [
    ...InternalRoutes,
    ...PublicRoutes
];

export const routing = RouterModule.forRoot(appRoutes);
