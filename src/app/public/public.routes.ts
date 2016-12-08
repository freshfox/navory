import {Routes} from "@angular/router";
import {PublicComponent} from "./public.component";
import {LoginComponent} from "./login.component";
import {SignupComponent} from "./signup.component";
import {ForgotPasswordComponent} from "./forgot-password.component";
import {ResetPasswordComponent} from "./reset-password.component";
import {FiveZeroThreeComponent} from "../core/components/503.component";

export const PublicRoutes: Routes = [
	{
		path: '',
		component: PublicComponent,
		children: [
			{path: 'login', component: LoginComponent},
			{path: 'forgot-password', component: ForgotPasswordComponent},
			{path: 'forgot-password/:token', component: ResetPasswordComponent},
			{path: 'signup', component: SignupComponent},
		]
	},
	{
		path: 'oops',
		component: FiveZeroThreeComponent
	}
];
