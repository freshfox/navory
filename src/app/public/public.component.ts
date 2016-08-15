import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {State} from "../core/state";

@Component({
	template: require('./public.html'),
	directives: [ROUTER_DIRECTIVES],
})
export class PublicComponent {

    constructor(private state: State, private router: Router, private route: ActivatedRoute) {
        this.state.user = this.route.snapshot.data['user'];
        if(this.state.user) {
            router.navigateByUrl('/dashboard');
        }
    }

}
