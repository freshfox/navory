import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {PublicRoutes} from "./public/public.routes";
import {InternalRoutes} from "./internal/internal.routes";

@NgModule({
	imports: [
		RouterModule.forRoot([
			...InternalRoutes,
			...PublicRoutes
		])
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule {
}
