import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'nvry-dropdown',
    template: `
        <button class="dropdown-target" (click)="toggle()">
            <nvry-icon name="arrow-sorted-down" [class.rotate-180-deg]="shown"></nvry-icon>
        </button>
        <div class="dropdown-content" *ngIf="shown">
            <ng-content></ng-content>
        </div>
        <div class="dropdown-overlay" (click)="hide()" *ngIf="shown"></div>
    `
})
export class DropdownComponent implements OnInit {

    private shown: boolean = false;

    constructor() { }

    ngOnInit() { }

    toggle() {
        this.shown = !this.shown;
    }

    hide() {
        this.shown = false;
    }
}
