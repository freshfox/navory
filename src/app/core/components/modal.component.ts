import {Component, style, animate, transition, trigger} from '@angular/core';

@Component({
    selector: 'nvry-modal',
    template: `
		<div [@backdrop] tabindex="1" class="modal" *ngIf="isShown" (click)="onClick($event)">
			<div [@dialog] class="modal-dialog">
				<ng-content></ng-content>
			</div>
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
                animate('0.2s ease')
            ]),
            transition('* => void', [
                animate('0.2s ease', style({
                    opacity: 0
                }))
            ])
        ])
    ]
})
export class ModalComponent {

    private isShown: boolean = false;

    public show(data: any = null) {
        this.isShown = true;
        let body = document.querySelector('body');
        body.className += ' no-scroll';
    }

    public hide() {
        this.isShown = false;
        this.unlockBodyScroll();
    }

    ngOnDestroy() {
        this.unlockBodyScroll();
    }

    unlockBodyScroll() {
        this.removeClass(document.querySelector('body'), 'no-scroll');
    }

    private onClick(event) {
        if (event.target.className == 'modal') {
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
