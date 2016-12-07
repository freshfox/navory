import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {State} from "../core/state";

@Component({
	templateUrl: './public.html',
})
export class PublicComponent {

    constructor(private state: State, private router: Router, private route: ActivatedRoute) {
        this.state.user = this.route.snapshot.data['user'];
        if(this.state.user) {
            router.navigateByUrl('/dashboard');
        }
    }

}
