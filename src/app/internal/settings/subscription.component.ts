import {Component, ComponentRef, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ModalService, ModalSize} from "../../core/modal.module";
import {SubscriptionFormComponent} from "./subscription-form.component";
import {TableOptions} from "../../core/components/table/table-options.model";
import {DatePipe} from "../../core/pipes/date.pipe";
import {ColumnAlignment} from "../../core/components/table/column-alignment.enum";
import {NumberPipe} from "../../core/pipes/number.pipe";
import {Invoice} from "../../models/invoice";
import {TranslateService} from "@ngx-translate/core";
import {InvoiceService} from "../../services/invoice.service";
import {SubscriptionService} from "../../services/subscription.service";
import {CancelSubscriptionComponent} from "./cancel-subscription.component";
import {NotificationsService} from "angular2-notifications/dist";
import {Subscription} from "../../models/subscription";

@Component({
	selector: 'nvry-subscription',
	templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {


	yearly: boolean = true;

	plans: SubscriptionPlan[] = [
		{
			id: 'pro-yearly',
			title: 'Jährliche Zahlung',
			savings: 20,
			price: 120,
			note: 'exl. USt. pro Jahr'
		},
		{
			id: 'pro-monthly',
			title: 'Monatliche Zahlung',
			price: 12,
			savings: null,
			note: 'exkl. USt. pro Monat'
		}
	];

	invoiceTableOptions: TableOptions;
	invoices: Invoice[] = [];
	subscription: Subscription;

	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;
	@ViewChild('servicePeriodColumn') servicePeriodColumn: TemplateRef<any>;

	constructor(private modalService: ModalService,
				private translate: TranslateService,
				private datePipe: DatePipe,
				private numberPipe: NumberPipe,
				private invoiceService: InvoiceService,
				private subscriptionService: SubscriptionService,
				private notificationService: NotificationsService) {
	}

	ngOnInit() {
		this.subscriptionService.getSubscriptionInvoices()
			.subscribe(invoices => this.invoices = invoices);

		this.subscriptionService.getSubscription()
			.subscribe(subscription => this.subscription = subscription);

		this.invoiceTableOptions = new TableOptions({
			itemsClickable: false,
			columns: [
				{name: this.translate.instant('general.date'), prop: 'date', pipe: this.datePipe, width: 30},
				{
					name: this.translate.instant('general.period'),
					width: 20,
					cellTemplate: this.servicePeriodColumn,
				},
				{
					name: this.translate.instant('general.amount_net'),
					prop: 'amount',
					pipe: this.numberPipe,
					width: 30,
					alignment: ColumnAlignment.Right
				},
				{
					width: 10,
					cellTemplate: this.actionsColumn,
					alignment: ColumnAlignment.Right
				},
			]
		});
	}

	get isSubscriptionActive(): boolean {
		return !!this.activePlan;
	}

	get activePlan(): SubscriptionPlan {
		let activePlan = null;

		if (this.subscription) {
			for (let plan of this.plans) {
				if (plan.id == this.subscription.plan_id) {
					return plan;
				}
			}
		}

		return activePlan;
	}

	openPaymentModal() {
		this.modalService.create(SubscriptionFormComponent, {
			size: ModalSize.Large,
			padding: false,
			parameters: {
				plans: this.plans
			}
		}).subscribe((ref: ComponentRef<SubscriptionFormComponent>) => {
			ref.instance.onSuccess.subscribe(() => {
				window.location.reload();
				this.modalService.hideCurrentModal();
			});
		});
	}

	get proPrice(): number {
		return this.yearly ? 10 : 12;
	}

	downloadInvoice(invoice: Invoice) {
		this.invoiceService.downloadInvoicePDF(invoice);
	}

	cancelSubscription() {
		this.modalService.create(CancelSubscriptionComponent)
			.subscribe((ref: ComponentRef<CancelSubscriptionComponent>) => {
				ref.instance.onCancel.subscribe(() => {
					this.modalService.hideCurrentModal();
				});

				ref.instance.onSuccess.subscribe(() => {
					this.modalService.hideCurrentModal();
					this.notificationService.success(this.translate.instant('settings.subscription.subscription-cancel-success'));
				});
			});
		;
	}
}

export class SubscriptionPlan {
	id: string;
	title: string;
	savings: number;
	price: number;
	note: string;
}
