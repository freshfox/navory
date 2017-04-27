import {Component, OnInit} from "@angular/core";
import {PaymentService} from "../../services/payment.service";
import {BankAccount} from "../../models/bank-account";
import {SubscriptionService} from "../../services/subscription.service";

@Component({
	selector: 'nvry-payments',
	templateUrl: './payments.component.html'
})
export class PaymentsComponent implements OnInit {

	private bankAccounts: BankAccount[];
	selectedBankAccount: BankAccount;
	loading: boolean;

	paymentsEnabled: boolean;

	constructor(private paymentService: PaymentService, private subscriptionService: SubscriptionService) {
	}

	ngOnInit() {
		this.paymentsEnabled = this.subscriptionService.paymentsEnabled();

		if (this.paymentsEnabled) {
			this.loading = true;
			this.paymentService.getBankAccounts()
				.subscribe(bankAccounts => {
					this.bankAccounts = bankAccounts;
					this.selectedBankAccount = this.bankAccounts[0];
					this.loading = false;
				})
		}

	}
}
