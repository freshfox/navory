import {Component, OnInit} from "@angular/core";
import {PaymentService} from "../../services/payment.service";
import {BankAccount} from "../../models/bank-account";

@Component({
	selector: 'nvry-payments',
	templateUrl: './payments.component.html'
})
export class PaymentsComponent implements OnInit {

	private bankAccounts: BankAccount[];
	private selectedBankAccount: BankAccount;
	private loading: boolean;

	constructor(private paymentService: PaymentService) {
	}

	ngOnInit() {
		this.loading = true;
		this.paymentService.getBankAccounts()
			.subscribe(bankAccounts => {
				this.bankAccounts = bankAccounts;
				this.selectedBankAccount = this.bankAccounts[0];
				this.loading = false;
			})
	}
}
