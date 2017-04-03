import {
	Component,
	NgModule,
	ViewChild,
	OnInit,
	ViewContainerRef,
	ReflectiveInjector,
	Injectable,
	Injector,
	ComponentRef,
	trigger,
	transition,
	style,
	animate,
	AfterViewInit,
	state,
	ComponentFactory,
	ComponentFactoryResolver
} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {BrowserModule} from "@angular/platform-browser";
import {ConfirmComponent} from "./components/confirm.component";

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
			title: title,
			message: message,
			onCancel: onCancel,
			onConfirm: onConfirm
		});
	}

	create<T>(component: any, parameters?: Object, slim: boolean = true): Observable<ComponentRef<T>> {
		let factory = this.componentFactoryResolver.resolveComponentFactory(component);
		return this.createFromFactory(factory, parameters, slim);
	}

	private createFromFactory<T>(componentFactory: ComponentFactory<T>, parameters?: Object, slim: boolean = true): Observable<ComponentRef<T>> {
		this.placeholder.show();
		this.placeholder.slim = slim;

		let componentRef$ = new ReplaySubject();
		const childInjector = ReflectiveInjector.resolveAndCreate([], this.injector);
		let componentRef = this.vcRef.createComponent(componentFactory, 0, childInjector);
		// pass the @Input parameters to the instance
		Object.assign(componentRef.instance, parameters);
		this.activeInstances++;

		this.placeholder.registerComponentRef(componentRef);
		componentRef.instance["destroy"] = () => {
			this.activeInstances--;
			componentRef.destroy();
		};
		componentRef$.next(componentRef);
		componentRef$.complete();
		return componentRef$.asObservable();
	}
}

// this is the modal-placeholder, it will container the created modals
@Component({
	selector: "nvry-modal-placeholder",
	template: `
            <div [@modal]="state" tabindex="1" class="modal" [class.modal--no-padding]="!padding" [class.modal--slim]="slim" (click)="onClick($event)">
                <div class="modal-dialog">
                    <div #modalplaceholder></div>
                </div>                                
            </div>
            <div [@backdrop]="state" class="modal-backdrop"></div>`,
	animations: [
		trigger('modal', [
			state('shown', style({transform: 'scale3d(1, 1, 1)', display: 'block'})),
			state('hidden', style({transform: 'scale3d(0, 0, 0)'})),
			transition('hidden => shown', [
				animate('250ms ease')
			]),
			transition('shown => hidden', [
				animate('250ms ease')
			])
		]),
		trigger('backdrop', [
			state('shown', style({opacity: 1, display: 'block'})),
			state('hidden', style({opacity: 0, display: 'none'})),
			transition('hidden => shown', [
				animate('250ms ease')
			]),
			transition('shown => hidden', [
				animate('250ms ease')
			])
		])
	]
})
export class ModalPlaceholderComponent implements OnInit, AfterViewInit {

	private isShown: boolean = false;
	private componentRef: ComponentRef<any>;
	public padding: boolean = false;
	public slim: boolean = true;

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

	onClick(event) {
		if (event.target.className.startsWith('modal')) {
			this.hide();
		}
	}

	show() {
		this.isShown = true;
		let body = document.querySelector('body');
		body.className += ' no-scroll';
	}

	hide() {
		this.componentRef.destroy();
		this.isShown = false;
		this.unlockBodyScroll();
	}

	private unlockBodyScroll() {
		this.removeClass(document.querySelector('body'), 'no-scroll');
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

// module definition
@NgModule({
	imports: [BrowserModule],
	declarations: [ModalPlaceholderComponent],
	exports: [ModalPlaceholderComponent],
	providers: [ModalService]
})
export class ModalModule {
}
