
import {Component, ComponentRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TableOptions} from '../../lib/ffc-angular/components/table/table-options.model';
import {Invoice} from '../../models/invoice';
import {Subscription} from '../../models/subscription';
import {ModalService, ModalSize} from '../../lib/ffc-angular/services/modal.service';
import {TranslateService} from '@ngx-translate/core';
import {AnalyticsEventType, AnalyticsService} from '../../services/analytics.service';
import {ColumnAlignment} from '../../lib/ffc-angular/components/table/column-alignment.enum';
import {DatePipe} from '../../core/pipes/date.pipe';
import {NumberPipe} from '../../lib/ffc-angular/pipes/number.pipe';
import {SubscriptionService} from '../../services/subscription.service';
import {CancelSubscriptionComponent} from './cancel-subscription.component';
import {InvoiceService} from '../../services/invoice.service';
import {SubscriptionFormComponent} from './subscription-form.component';
import {State} from '../../core/state';
import {NotificationsService} from 'angular2-notifications';

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
	loading: boolean = false;

	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;
	@ViewChild('servicePeriodColumn') servicePeriodColumn: TemplateRef<any>;

	constructor(private modalService: ModalService,
				private translate: TranslateService,
				private datePipe: DatePipe,
				private numberPipe: NumberPipe,
				private invoiceService: InvoiceService,
				private state: State,
				private subscriptionService: SubscriptionService,
				private notificationService: NotificationsService,
				private analytics: AnalyticsService
	) {
	}

	ngOnInit() {
		this.loading = true;

		this.subscriptionService.getSubscriptionInvoices()
			.subscribe(invoices => this.invoices = invoices);

		this.subscriptionService.getSubscription()
			.subscribe(subscription => {
				this.loading = false;
				this.subscription = subscription
			});

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
					width: 15,
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
		this.analytics.trackEvent(AnalyticsEventType.ClickOnPlanBuyButton);
		this.modalService.create(SubscriptionFormComponent, {
			size: ModalSize.Large,
			padding: false,
			parameters: {
				plans: this.plans
			}
		}).subscribe((ref: ComponentRef<SubscriptionFormComponent>) => {
			ref.instance.onSuccess.subscribe((data) => {
				this.analytics.trackEvent(AnalyticsEventType.ActivateSubscription);
				this.subscription = data.subscription;
				this.state.features = data.features;
				this.modalService.hideCurrentModal();
			});
		});
	}

	get proPrice(): number {
		return this.yearly ? 10 : 12;
	}

	downloadInvoice(invoice: Invoice) {
		this.invoiceService.downloadSubscriptionInvoicePDF(invoice);
	}

	cancelSubscription() {
		this.modalService.create(CancelSubscriptionComponent)
			.subscribe((ref: ComponentRef<CancelSubscriptionComponent>) => {
				ref.instance.onCancel.subscribe(() => {
					this.modalService.hideCurrentModal();
				});

				ref.instance.onSuccess.subscribe((data) => {
					this.subscription = data.subscription;
					this.state.features = data.features;
					this.modalService.hideCurrentModal();
					this.notificationService.success(null, this.translate.instant('settings.subscription.subscription-cancel-success'));
				});
			});
	}
}

export class SubscriptionPlan {
	id: string;
	title: string;
	savings: number;
	price: number;
	note: string;
}
