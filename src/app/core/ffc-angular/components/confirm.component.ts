import {Component, OnInit, Input, Output} from "@angular/core";

@Component({
    selector: 'ff-confirm',
    template: `
        <div class="modal-header" *ngIf="title">
            {{ title }}
        </div>

        <div class="modal-inner">
            <p class="nmb">{{ message }}</p>
        </div>

        <div class="modal-footer">
            <button ff-button class="ff-button--secondary" (click)="cancel()">Abbrechen</button>
            <button ff-button (click)="confirm()">Löschen</button>
        </div>
    `
})
export class ConfirmComponent implements OnInit {

    @Input() title: string;
    @Input() message: string;

    @Output() onCancel: Function;
    @Output() onConfirm: Function;

    constructor() {
    }

    ngOnInit() {
    }

    confirm() {
        this.onConfirm();
    }

    cancel() {
        this.onCancel();
    }

}
