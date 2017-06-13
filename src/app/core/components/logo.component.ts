import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'nvry-logo',
    template: `<ff-icon name="logo"></ff-icon>`,
	host: { 'class': 'logo' }
})
export class LogoComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}
