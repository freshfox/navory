import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {State} from "../core/state";

@Component({
	template: require('./public.html'),
	directives: [ROUTER_DIRECTIVES],
})
export class PublicComponent {

    constructor(private state: State, private router: Router) {
        if(state.user) {
            router.navigateByUrl('/dashboard');
        }
    }

}
