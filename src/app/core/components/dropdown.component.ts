import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'nvry-dropdown',
    template: `
        <div class="dropdown__inner" (click)="onClickInner($event)">
            <button class="dropdown-target" (click)="toggle($event)">
                <nvry-icon name="arrow-sorted-down" [class.rotate-180-deg]="shown"></nvry-icon>
            </button>
            <div class="dropdown-content" *ngIf="shown">
                <ng-content></ng-content>
            </div>
        </div>
        <div class="dropdown-overlay" (click)="onClickOverlay($event)" *ngIf="shown"></div>
    `
})
export class DropdownComponent implements OnInit {

    private shown: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    toggle(event) {
        this.shown = !this.shown;
        event.stopPropagation();
    }

    hide() {
        this.shown = false;
    }

    onClickOverlay(event) {
        this.hide();
        event.stopPropagation();
    }

    onClickInner(event) {
        event.stopPropagation();
    }
}
