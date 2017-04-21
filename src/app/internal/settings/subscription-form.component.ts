import {AfterViewInit, Component, ElementRef, NgZone, OnInit} from "@angular/core";
import {Step} from "../../core/components/steps.component";
import {TranslateService} from "ng2-translate";
import {Account} from "../../models/account";
import {State} from "../../core/state";
import * as braintree from "braintree-web";
import * as $ from "jquery";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Helpers} from "../../core/helpers";
import {SubscriptionService} from "../../services/subscription.service";
import {environment} from "../../../environments/environment";
import {AccountService} from "../../services/account.service";


@Component({
	templateUrl: './subscription-form.component.html',
	host: {
		'class': 'subscription-form'
	}
})
export class SubscriptionFormComponent implements OnInit, AfterViewInit {

	merchantId: string = environment.braintreeMerchantId;
	stepInfo: Step[];
	numberOfSteps: number = 3;
	currentStepIndex = 2;
	account: Account;

	plans: SubscriptionPlan[] = [
		{
			id: 'pro-yearly',
			title: 'Jährliche Zahlung',
			savings: 20,
			price: 120,
			note: 'pro Jahr'
		},
		{
			id: 'pro-monthly',
			title: 'Monatliche Zahlung',
			price: 12,
			savings: null,
			note: 'pro Monat'
		}
	];

	selectedPlan: SubscriptionPlan = this.plans[0];
	accountForm: FormGroup;
	accountFormValue: Account;
	sending: boolean = false;

	alertMessage: string;
	private creditCardForm;
	private nonce: string;
	private paymentType: PaymentType;
	payPalInfo: PayPalInfo;


	constructor(private state: State,
				private translate: TranslateService,
				private fb: FormBuilder,
				private el: ElementRef,
				private subscriptionService: SubscriptionService,
				private accountService: AccountService,
				private zone: NgZone) {
	}

	ngOnInit() {
		this.stepInfo = [
			{
				name: this.translate.instant('settings.subscription.steps.choose-plan'),
				getValue: this.getSelectedPlanInfo.bind(this)
			},
			{
				name: this.translate.instant('settings.subscription.steps.details'),
				getValue: this.getAddressInfo.bind(this)
			},
			{
				name: this.translate.instant('settings.subscription.steps.payment-method'),
				getValue: this.getPaymentInfo.bind(this)
			},
			{
				name: this.translate.instant('settings.subscription.steps.review'),
			}
		];

		this.account = this.state.user.account;

		this.accountForm = this.fb.group({
			company_name: [this.account.company_name, Validators.required],
			address: [this.account.address, Validators.required],
			zip: [this.account.zip, Validators.required],
			city: [this.account.city, Validators.required],
			vat_number: [this.account.vat_number]
		});
	}

	ngAfterViewInit() {
		this.initBraintree();
	}

	private initBraintree() {
		this.subscriptionService.getPaymentToken()
			.subscribe(token => {
				braintree.client.create({
					authorization: token
				}, (err, clientInstance) => {
					if (err) {
						console.error(err);
						return;
					}
					this.createHostedFields(clientInstance);
					this.createPayPalButton(clientInstance);
				});
			});
	}

	goToNextStep() {
		this.alertMessage = null;
		switch (this.currentStepIndex) {
			case 0:
				this.currentStepIndex++;
				break;
			case 1:
				Helpers.validateAllFields(this.accountForm);
				if (this.accountForm.valid) {
					this.accountFormValue = this.accountForm.value;
					this.currentStepIndex++;
				}
				break;
			case 2:
				this.goToReviewStep();
		}
	}

	selectPlan(plan: SubscriptionPlan) {
		this.selectedPlan = plan;
	}

	previousStepSelected() {
		this.alertMessage = null;
	}

	getSelectedPlanInfo() {
		let plan = this.selectedPlan;
		return `${plan.title}\nEUR ${plan.price},- ${plan.note}`;
	}

	getAddressInfo() {
		if (this.accountFormValue) {
			let account = this.accountFormValue;
			let text = `${account.company_name}\n${account.address}\n${account.zip} ${account.city}`;
			if (account.vat_number) {
				text += `\nUID: ${account.vat_number}`;
			}

			return text;
		}

		return null;
	}

	getPaymentInfo() {
		switch (this.paymentType) {
			case PaymentType.PayPal:
				return 'PayPal';
			case PaymentType.CreditCard:
				return 'Kreditkarte';
		}
	}

	isPlanSelected(plan: SubscriptionPlan): boolean {
		return plan === this.selectedPlan;
	}

	goToReviewStep() {
		if (this.nonce) {
			this.currentStepIndex++;
		} else {
			this.sending = true;
			this.creditCardForm.tokenize((err, payload) => {
				this.sending = false;
				if (err) {
					console.log(err);
					switch(err.code) {
						case 'HOSTED_FIELDS_FIELDS_EMPTY':
							this.alertMessage = 'Bitte trage deine Zahlungsdaten ein.';
							break;
						default:
							this.alertMessage = 'Wir konnten diese Kreditkarte nicht verifizieren.';
					}
					return;
				}

				this.nonce = payload.nonce;
				this.currentStepIndex++;
			});
		}
	}

	submit() {
		this.sending = true;
		this.accountService.updateAccount(this.accountFormValue)
			.subscribe(() => {

			});
	}

	isPayPalAccountLinked(): boolean {
		return this.paymentType === PaymentType.PayPal;
	}

	removePayPalLink() {
		this.paymentType = null;
		this.payPalInfo = null;
	}

	private createPayPalButton(clientInstance) {

		let payPalButton = this.el.nativeElement.querySelector('#paypal-button');

		// Create PayPal component
		braintree.paypal.create({
			client: clientInstance
		}, (paypalErr, paypalInstance) => {
			payPalButton.addEventListener('click', () => {
				// Tokenize here!
				paypalInstance.tokenize({
					flow: 'vault', // This enables the Vault flow
					billingAgreementDescription: 'Your agreement description',
					enableShippingAddress: false
				}, (err, tokenizationPayload) => {
					// Tokenization complete
					console.log(tokenizationPayload);
					let data = tokenizationPayload;

					this.zone.run(() => {
						this.nonce = data.nonce;
						this.paymentType = PaymentType.PayPal;
						this.payPalInfo = {
							name: `${data.details.firstName} ${data.details.lastName}`,
							email: data.details.email
						}
					});
				});
			});
		});
	}

	private createHostedFields(clientInstance) {

		let form = this.el.nativeElement.querySelector('#credit-card-form');
		let submit = this.el.nativeElement.querySelector('input[type="submit"]');

		// Create input fields and add text styles
		braintree.hostedFields.create({
			client: clientInstance,
			styles: {
				'input': {
					'color': '#282c37',
					'font-size': '16px',
					'transition': 'color 0.1s',
					'line-height': '3'
				},
				// Style the text of an invalid input
				'input.invalid': {
					'color': '#E53A40'
				},
				// placeholder styles need to be individually adjusted
				'::-webkit-input-placeholder': {
					'color': 'rgba(0,0,0,0.6)'
				},
				':-moz-placeholder': {
					'color': 'rgba(0,0,0,0.6)'
				},
				'::-moz-placeholder': {
					'color': 'rgba(0,0,0,0.6)'
				},
				':-ms-input-placeholder': {
					'color': 'rgba(0,0,0,0.6)'
				}

			},
			// Add information for individual fields
			fields: {
				number: {
					selector: '#card-number',
					placeholder: '1111 1111 1111 1111'
				},
				cvv: {
					selector: '#cvv',
					placeholder: '123'
				},
				expirationDate: {
					selector: '#expiration-date',
					placeholder: '10 / 2019'
				}
			}
		}, (err, hostedFieldsInstance) => {
			if (err) {
				console.error(err);
				return;
			}

			this.creditCardForm = hostedFieldsInstance;

			hostedFieldsInstance.on('validityChange', function (event) {
				// Check if all fields are valid, then show submit button
				let formValid = Object.keys(event.fields).every(function (key) {
					return event.fields[key].isValid;
				});
			});

			hostedFieldsInstance.on('empty', function (event) {
				$('header').removeClass('header-slide');
				$('#card-image').removeClass();
				$(form).removeClass();
			});

			hostedFieldsInstance.on('cardTypeChange', function (event) {
				// Change card bg depending on card type
				if (event.cards.length === 1) {
					console.log(form);
					$(form).removeClass().addClass(`card-type ${event.cards[0].type}`);
					$('#card-image').removeClass().addClass(event.cards[0].type);
					$('header').addClass('header-slide');

					// Change the CVV length for AmericanExpress cards
					if (event.cards[0].code.size === 4) {
						hostedFieldsInstance.setAttribute({
							field: 'cvv',
							attribute: 'placeholder',
							value: '1234'
						});
					}
				} else {
					hostedFieldsInstance.setAttribute({
						field: 'cvv',
						attribute: 'placeholder',
						value: '123'
					});
				}
			});
		});
	}
}

interface PayPalInfo {
	name: string;
	email: string;
}

enum PaymentType {
	PayPal = 'paypal' as any,
	CreditCard = 'creditcard' as any
}

class SubscriptionPlan {
	id: string;
	title: string;
	savings: number;
	price: number;
	note: string;
}
