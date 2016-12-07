import {Component} from '@angular/core';
import {State} from "../core/state";
import {User} from "../models/user";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
    templateUrl: './internal.component.html'
})
export class InternalComponent {

    navItems = [
        {
            'key': 'dashboard',
            'icon': 'home-outline',
            'routerLink': '/dashboard',
            'title': 'dashboard.title',
        },
        {
            'key': 'income',
            'icon': 'document-text',
            'routerLink': '/invoices',
            'title': 'income.title',
        },
        {
            'key': 'expenses',
            'icon': 'document-text',
            'routerLink': '/expenses',
            'title': 'expenses.title',
        },
        {
            'key': 'payments',
            'icon': 'credit-card',
            'routerLink': '/payments',
            'title': 'payments.title',
        },
        {
            'key': 'reports',
            'icon': 'chart-line-outline',
            'routerLink': '/reports',
            'title': 'reports.title',
        },
        {
            'key': 'customers',
            'icon': 'group-outline',
            'routerLink': '/customers',
            'title': 'customers.title',
        },
        {
            'key': 'settings',
            'icon': 'cog-outline',
            'routerLink': '/settings/account',
            'title': 'settings.title',
        },
    ];

    private loggingOut: boolean = false;
    private notificationOptions = {
        position: ["top", "right"],
        timeOut: 5000,
        showProgressBar: false,
        maxStack: 4
    }

    constructor(private state: State, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
        let bootstrap = this.route.snapshot.data['bootstrap'];
        Object.assign(this.state, bootstrap);
        this.state.expenseCategories = bootstrap.categories;
    }

    private logout() {
        this.loggingOut = true;
        this.authService.logout()
            .subscribe(() => {
                this.loggingOut = false;
                this.router.navigate(['/login']);
            });
    }
}
