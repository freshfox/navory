import {AfterViewInit, Component, ComponentRef, Injector, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {animate, AnimationEvent, state, style, transition, trigger} from "@angular/animations";
import {ModalService} from "../services/modal.service";

@Component({
    selector: "ff-modal-placeholder",
    template: `
        <div class="modal-outer" [@modalOuter]="state">
            <div [@modal]="state" (@modal.done)="modalAnimationDone($event)" tabindex="1" class="modal"
                 [class.modal--no-padding]="!padding"
                 [class.modal--large]="isLarge()"
                 [class.modal--full-width]="isFullWidth()"
                 [class.modal--clean]="isClean()">
                <div class="modal-dialog">
                    <div class="modal-dialog__inner">
                        <ng-template #modalplaceholder></ng-template>
                        <nvry-button *ngIf="showCloseButton && !clean" class="button--clear modal__close-button-inside"
                                     (click)="hide()">
                            <nvry-icon name="cross"></nvry-icon>
                        </nvry-button>
                    </div>
                </div>
            </div>
            <div [@backdrop]="state" class="modal-backdrop" (click)="onBackdropClicked()"></div>
            <button ff-button *ngIf="showCloseButton && clean" class="modal__close-button" [@closeButton]="state"
                         (click)="hide()">
                <ff-icon name="cross"></ff-icon>
            </button>
        </div>
    `,
    animations: [
        trigger('modalOuter', [
            state('shown', style({display: 'flex'})),
            state('hidden', style({display: 'none'})),
            transition('hidden <=> shown', [
                animate('0.2s ease')
            ])
        ]),
        trigger('modal', [
            state('shown', style({transform: 'scale3d(1, 1, 1)', opacity: 1, display: 'block'})),
            state('hidden', style({transform: 'scale3d(0.7, 0.7, 0.7)', opacity: 0})),
            transition('hidden <=> shown', [
                animate('0.2s ease')
            ])
        ]),
        trigger('backdrop', [
            state('shown', style({opacity: 1, display: 'block'})),
            state('hidden', style({opacity: 0, display: 'none'})),
            transition('hidden <=> shown', [
                animate('0.2s ease')
            ])
        ]),
        trigger('closeButton', [
            state('shown', style({opacity: 1, display: 'block'})),
            state('hidden', style({opacity: 0, display: 'none'})),
            transition('hidden <=> shown', [
                animate('0.1s ease')
            ])
        ])
    ],
    host: {'class': 'modal-placeholder'}
})
export class ModalPlaceholderComponent implements OnInit, AfterViewInit {

    private isShown: boolean = false;
    private componentRef: ComponentRef<any>;
    padding: boolean = false;
    modalSize: ModalSize = ModalSize.Regular;
    clean: boolean = false;
    showCloseButton: boolean = true;

    @ViewChild("modalplaceholder", {read: ViewContainerRef}) viewContainerRef;

    constructor(private modalService: ModalService, private injector: Injector) {
    }

    get state(): string {
        return this.isShown ? 'shown' : 'hidden';
    }

    ngOnInit() {
        this.modalService.registerInjector(this.injector);
        this.modalService.registerPlaceholder(this);
    }

    ngAfterViewInit() {
        this.modalService.registerViewContainerRef(this.viewContainerRef);
    }

    registerComponentRef(componentRef: ComponentRef<any>) {
        this.componentRef = componentRef;
    }

    isLarge(): boolean {
        return this.modalSize == ModalSize.Large;
    }

    isFullWidth(): boolean {
        return this.modalSize == ModalSize.FullWidth;
    }

    isClean(): boolean {
        return this.clean;
    }

    onBackdropClicked() {
        this.hide();
    }

    show() {
        this.isShown = true;
        let body = document.querySelector('body');
        body.className += ' no-scroll';
    }

    hide() {
        this.isShown = false;
        this.unlockBodyScroll();
    }

    modalAnimationDone(event: AnimationEvent) {
        if (event.toState === 'hidden' && this.componentRef) {
            this.componentRef.destroy();
        }
    }

    private unlockBodyScroll() {
        this.removeClass(document.querySelector('body'), 'no-scroll');
    }

    private removeClass(element, clazz) {
        let newClassName = "";
        let i;
        let classes = element.className.split(" ");
        for (i = 0; i < classes.length; i++) {
            if (classes[i] !== clazz) {
                newClassName += classes[i] + " ";
            }
        }
        element.className = newClassName;
    }

}

export enum ModalSize {
    Regular = 'regular' as any,
    Large = 'large' as any,
    FullWidth = 'fullwidth' as any,
}

export interface ModalOptions {
    parameters?: Object;
    size?: ModalSize;
    clean?: boolean;
    padding?: boolean;
    showCloseButton?: boolean;
}