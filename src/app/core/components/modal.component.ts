import {
    Component, style, animate, transition, trigger, Input,
    ViewContainerRef, ViewChild, ContentChild, TemplateRef
} from '@angular/core';

@Component({
    selector: 'nvry-modal',
    template: `
		<div [@backdrop] tabindex="1" class="modal {{ class }}" *ngIf="isShown" (click)="onClick($event)">
			<div [@dialog] class="modal-dialog" *ngIf="!clean">
				<ng-content></ng-content>
			</div>
			
			<ng-content *ngIf="clean"></ng-content>
			
			<nvry-button *ngIf="showCloseButton" class="modal__close-button" (click)="hide()" icon="cross"></nvry-button>
		</div>`,
    animations: [
        trigger('dialog', [
            transition('void => *', [
                style({ transform: 'scale3d(0, 0, 0)' }),
                animate('0.3s ease')
            ]),
            transition('* => void', [
                animate('0.3s ease', style({ transform: 'scale3d(.0, .0, .0)' }))
            ])
        ]),
        trigger('backdrop', [
            transition('void => *', [
                style({ opacity: 1 }),
                animate('0.3s ease')
            ]),
            transition('* => void', [
                animate('0.3s ease', style({
                    opacity: 0
                }))
            ])
        ])
    ]
})
export class ModalComponent {

    private isShown: boolean = false;
    private data: any;
    @Input() class: string;
    @Input() clean: boolean = false;
    @Input() showCloseButton: boolean = false;
    @ViewChild('inner', {read: ViewContainerRef}) innerContainer: ViewContainerRef;

    @ContentChild('closeButton') closeButton: TemplateRef<any>;


    constructor() {
    }

    show(data: any = null) {
        this.isShown = true;
        this.data = data;

        let body = document.querySelector('body');
        body.className += ' no-scroll';
    }

    hide() {
        this.isShown = false;
        this.data = null;
        this.unlockBodyScroll();
    }

    ngOnDestroy() {
        this.unlockBodyScroll();
    }

    private unlockBodyScroll() {
        this.removeClass(document.querySelector('body'), 'no-scroll');
    }

    private onClick(event) {
        if (event.target.className.startsWith('modal')) {
            this.hide();
        }
    }

    private removeClass(element, clazz) {
        var newClassName = "";
        var i;
        var classes = element.className.split(" ");
        for(i = 0; i < classes.length; i++) {
            if(classes[i] !== clazz) {
                newClassName += classes[i] + " ";
            }
        }
        element.className = newClassName;
    }

}
