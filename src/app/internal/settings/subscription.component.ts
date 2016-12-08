import {Component, OnInit, AfterViewInit} from '@angular/core';
let braintree = require('braintree-web');
let $ = require('jquery');

@Component({
    selector: 'nvry-subscription',
    templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements AfterViewInit {
    constructor() { }

    ngAfterViewInit() {
    	braintree.client.create({
    		authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b'
		}, (err, clientInstance) => {
			if (err) {
				console.error(err);
				return;
			}
			this.createHostedFields(clientInstance);
		});
	}

	private createHostedFields(braintreeClient) {

		var form = document.querySelector('#my-sample-form');
		var submit = document.querySelector('input[type="submit"]');

		// Create input fields and add text styles
		braintree.hostedFields.create({
			client: braintreeClient,
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
				':-ms-input-placeholder ': {
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
					$(form).removeClass().addClass(event.cards[0].type);
					$('#card-image').removeClass().addClass(event.cards[0].type);
					$('header').addClass('header-slide');

					// Change the CVV length for AmericanExpress cards
					if (event.cards[0].code.size === 4) {
						hostedFieldsInstance.setPlaceholder('cvv', '1234');
					}
				} else {
					hostedFieldsInstance.setPlaceholder('cvv', '123');
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
}
