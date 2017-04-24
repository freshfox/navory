import {
	AfterViewInit,
	Component,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	Injectable,
	Injector,
	NgModule,
	OnInit,
	ReflectiveInjector,
	ViewChild,
	ViewContainerRef
} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {BrowserModule} from "@angular/platform-browser";
import {ConfirmComponent} from "./components/confirm.component";
import {animate, AnimationEvent, state, style, transition, trigger} from "@angular/animations";
import {CoreModule} from "./core.module";

@Injectable()
export class ModalService {
	private vcRef: ViewContainerRef;
	private injector: Injector;
	public activeInstances: number = 0;

	private placeholder: ModalPlaceholderComponent;

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {
	}

	hideCurrentModal() {
		this.placeholder.hide();
	}

	registerViewContainerRef(vcRef: ViewContainerRef): void {
		this.vcRef = vcRef;
	}

	registerPlaceholder(placeholder: ModalPlaceholderComponent) {
		this.placeholder = placeholder;
	}

	registerInjector(injector: Injector): void {
		this.injector = injector;
	}

	createConfirmRequest(title: string, message: string, onCancel: Function, onConfirm: Function) {
		this.create(ConfirmComponent, {
			parameters: {
				title: title,
				message: message,
				onCancel: onCancel,
				onConfirm: onConfirm
			}
		});
	}

	create<T>(component: any, options?: ModalOptions): Observable<ComponentRef<T>> {
		options = Object.assign({}, {
			size: ModalSize.Regular,
			padding: false,
			clean: false,
			showCloseButton: false
		}, options);

		let factory = this.componentFactoryResolver.resolveComponentFactory(component);
		return this.createFromFactory(factory, options);
	}

	private createFromFactory<T>(componentFactory: ComponentFactory<T>, options: ModalOptions): Observable<ComponentRef<T>> {
		this.placeholder.show();

		let componentRef$ = new ReplaySubject();
		const childInjector = ReflectiveInjector.resolveAndCreate([], this.injector);
		let componentRef = this.vcRef.createComponent(componentFactory, 0, childInjector);
		// pass the @Input parameters to the instance
		Object.assign(componentRef.instance, options.parameters);

		this.placeholder.padding = options.padding;
		this.placeholder.modalSize = options.size;
		this.placeholder.clean = options.clean;
		this.placeholder.showCloseButton = options.showCloseButton;

		this.placeholder.registerComponentRef(componentRef);
		componentRef$.next(componentRef);
		componentRef$.complete();
		return componentRef$.asObservable();
	}
}

// this is the modal-placeholder, it will container the created modals
@Component({
	selector: "nvry-modal-placeholder",
	template: `
		<div class="modal-outer" [@modalOuter]="state">
			<div [@modal]="state" (@modal.done)="modalAnimationDone($event)" tabindex="1" class="modal"
				 [class.modal--no-padding]="!padding"
				 [class.modal--large]="isLarge()"
				 [class.modal--full-width]="isFullWidth()"
				 [class.modal--clean]="isClean()">
				<div class="modal-dialog">
					<ng-template #modalplaceholder></ng-template>
				</div>
			</div>
			<div [@backdrop]="state" class="modal-backdrop" (click)="onBackdropClicked()"></div>
			<nvry-button *ngIf="showCloseButton" class="modal__close-button" [@closeButton]="state" (click)="hide()">
				<nvry-icon name="cross"></nvry-icon>
			</nvry-button>
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
			state('shown', style({transform: 'scale3d(1, 1, 1)', display: 'block'})),
			state('hidden', style({transform: 'scale3d(0, 0, 0)'})),
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
	showCloseButton: boolean = false;

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

export class ModalOptions {
	parameters?: Object;
	size?: ModalSize;
	clean?: boolean;
	padding?: boolean;
	showCloseButton?: boolean;
}


// module definition
@NgModule({
	imports: [BrowserModule, CoreModule],
	declarations: [ModalPlaceholderComponent],
	exports: [ModalPlaceholderComponent],
	providers: [ModalService]
})
export class ModalModule {
}
