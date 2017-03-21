import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'nvry-logo',
    template: `<nvry-icon name="logo"></nvry-icon>`,
	host: { 'class': 'logo' }
})
export class LogoComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}
