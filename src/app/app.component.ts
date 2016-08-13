import {Component, ViewEncapsulation} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {TranslateService} from "ng2-translate";
import {UserService} from "./services/user.service";
import {User} from "./models/user";
import {State} from "./core/state";

@Component({
    selector: 'nvry-app-root',
    directives: [ROUTER_DIRECTIVES],
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'app.component.html',
    styleUrls: ['../style/app.scss']
})
export class AppComponent {

    constructor(private router: Router,
                private translate: TranslateService,
                private userService: UserService,
                private state: State) {

        translate.use('de');

        this.userService.getOwnUser()
            .then((user: User) => {
                this.state.user = user;
                this.router.navigateByUrl('/dashboard');
            })
            .catch((err) => {
                this.router.navigateByUrl('/login');
            });
    }
}
