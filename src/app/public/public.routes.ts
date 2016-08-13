import {Routes} from '@angular/router';
import {PublicComponent} from './public.component';
import {LoginComponent} from './login.component';
import {SignupComponent} from './signup.component';

export const PublicRoutes: Routes = [
	{
		path: '',
		component: PublicComponent,
		children: [
			{ path: 'login',  component: LoginComponent },
			// { path: 'forgot-password', component: ForgotPasswordComponent },
			{ path: 'signup',     component: SignupComponent },
		]
	}
];
