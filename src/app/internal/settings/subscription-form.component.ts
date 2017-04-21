import {AfterViewInit, Component, ElementRef, OnInit} from "@angular/core";
import {Step} from "../../core/components/steps.component";
import {TranslateService} from "ng2-translate";
import {Account} from "../../models/account";
import {State} from "../../core/state";
import * as braintree from "braintree-web";
import * as $ from "jquery";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Helpers} from "../../core/helpers";


@Component({
	templateUrl: './subscription-form.component.html',
	host: {
		'class': 'subscription-form'
	}
})
export class SubscriptionFormComponent implements OnInit, AfterViewInit {

	private hostedFieldsInstance;
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

	selectedPlanId: string = 'pro-yearly';
	accountForm: FormGroup;

	constructor(private state: State, private translate: TranslateService, private fb: FormBuilder, private el: ElementRef) {
	}

	ngOnInit() {
		this.stepInfo = [
			{
				name: this.translate.instant('settings.subscription.steps.choose-plan'),
			},
			{
				name: this.translate.instant('settings.subscription.steps.details'),
			},
			{
				name: this.translate.instant('settings.subscription.steps.payment-method'),
			}
		];

		this.account = this.state.user.account;

		this.accountForm = this.fb.group({
			company_name: [this.account.company_name, Validators.required],
			address: [this.account.address, Validators.required],
			zip: [this.account.zip, Validators.required],
			city: [this.account.city, Validators.required]
		});
	}

	ngAfterViewInit() {
		this.initBraintree();
	}

	private initBraintree() {
		braintree.client.create({
			authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b'
		}, (err, clientInstance) => {
			if (err) {
				console.error(err);
				return;
			}
			this.createHostedFields(clientInstance);
			this.createPayPalButton(clientInstance);
		});
	}

	goToNextStep() {

		switch (this.currentStepIndex) {
			case 0:
				this.currentStepIndex++;
				break;
			case 1:
				Helpers.validateAllFields(this.accountForm);
				if (this.accountForm.valid) {
					this.currentStepIndex++;
				}
		}
	}

	selectPlan(plan: SubscriptionPlan) {
		this.selectedPlanId = plan.id;
	}

	isPlanSelected(plan: SubscriptionPlan): boolean {
		return plan.id === this.selectedPlanId;
	}

	private createPayPalButton(clientInstance) {

		let payPalButton = this.el.nativeElement.querySelector('#paypal-button');

		// Create PayPal component
		braintree.paypal.create({
			client: clientInstance
		}, function (paypalErr, paypalInstance) {
			payPalButton.addEventListener('click', function () {
				// Tokenize here!
				paypalInstance.tokenize({
					flow: 'vault', // This enables the Vault flow
					billingAgreementDescription: 'Your agreement description',
					locale: 'en_US',
					enableShippingAddress: false
				}, function (err, tokenizationPayload) {
					// Tokenization complete
					// Send tokenizationPayload.nonce to server
					console.log(tokenizationPayload);
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
		}, function (err, hostedFieldsInstance) {
			if (err) {
				console.error(err);
				return;
			}

			hostedFieldsInstance.on('validityChange', function (event) {
				// Check if all fields are valid, then show submit button
				var formValid = Object.keys(event.fields).every(function (key) {
					return event.fields[key].isValid;
				});

				if (formValid) {
					$('#button-pay').addClass('show-button');
				} else {
					$('#button-pay').removeClass('show-button');
				}
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

			submit.addEventListener('click', function (event) {
				event.preventDefault();

				hostedFieldsInstance.tokenize(function (err, payload) {
					if (err) {
						console.error(err);
						return;
					}

					// This is where you would submit payload.nonce to your server
					alert('Submit your nonce to your server here!');
				});
			}, false);
		});
	}

	submit() {
		this.hostedFieldsInstance.tokenize(function (err, payload) {
			if (err) {
				console.error(err);
				return;
			}

			// This is where you would submit payload.nonce to your server
			alert('Submit your nonce to your server here!');
		});
	}

}

class SubscriptionPlan {
	id: string;
	title: string;
	savings: number;
	price: number;
	note: string;
}
