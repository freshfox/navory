import {
	Component,
	style,
	animate,
	transition,
	trigger,
	Input,
	ContentChild,
	TemplateRef,
	OnDestroy
} from "@angular/core";

@Component({
	selector: 'nvry-modal',
	template: `
		<div tabindex="1" class="modal {{ class }}" *ngIf="isShown" (click)="onClick($event)" [class.modal--clean]="clean">
			<div [@dialog] class="modal-dialog">
				<ng-content></ng-content>
			</div>
						
			<nvry-button *ngIf="showCloseButton" class="modal__close-button" (click)="hide()" icon="cross"></nvry-button>
		</div>
        <div [@backdrop] class="modal-backdrop" *ngIf="isShown"></div>`,
	animations: [
		trigger('dialog', [
			transition('void => *', [
				style({transform: 'scale3d(0, 0, 0)'}),
				animate('0.3s ease')
			]),
			transition('* => void', [
				animate('0.3s ease', style({transform: 'scale3d(.0, .0, .0)'}))
			])
		]),
		trigger('backdrop', [
			transition('void => *', [
				style({opacity: 1}),
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
export class ModalComponent implements OnDestroy {

	private isShown: boolean = false;
	private data: any;
	@Input() class: string;
	@Input() clean: boolean = false;
	@Input() showCloseButton: boolean = false;

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
		for (i = 0; i < classes.length; i++) {
			if (classes[i] !== clazz) {
				newClassName += classes[i] + " ";
			}
		}
		element.className = newClassName;
	}

}
