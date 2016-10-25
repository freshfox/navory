import {
    Component, style, animate, transition, trigger, Input, ComponentFactoryResolver, Type,
    ViewContainerRef, ViewChild
} from '@angular/core';

@Component({
    selector: 'nvry-modal',
    template: `
		<div [@backdrop] tabindex="1" class="modal {{ class }}" *ngIf="isShown" (click)="onClick($event)">
			<div [@dialog] class="modal-dialog">
				<div #inner></div>
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
    @Input() class: string;
    @ViewChild('inner', {read: ViewContainerRef}) innerContainer: ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {

    }

    public show(component: any, data: any = null) {
        this.isShown = true;

        setTimeout(() => {
            let resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(component);
            let childComponent = this.innerContainer.createComponent(resolvedComponent);
            data.
            childComponent

        }, 1);

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
