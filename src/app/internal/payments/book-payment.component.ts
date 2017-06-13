import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {FormValidator} from "../../core/form-validator";
import {Helpers} from "../../core/helpers";
import {Payment} from "../../models/payment";
import {BankAccount} from "../../models/bank-account";
import {PaymentService} from "../../services/payment.service";

@Component({
	selector: 'nvry-book-payment',
	template: `
		<div class="modal-header">
				{{ headline }}
		</div>
		<div class="modal-inner">
			<div class="add-payment-form" *ngIf="!loading">
				<ff-input class="description" [(ngModel)]="description" [label]="'general.description' | translate"></ff-input>
				
				<ff-input type="date"
						[formControl]="form.controls.date"
						[(ngModel)]="date"
						[label]="'general.date' | translate"></ff-input>
		
				<ff-input 
				class="amount" 
				[class.amount--expense]="isExpenseBooking"
				type="money" 
				[label]="'general.amount' | translate" 
				[(ngModel)]="amount"
				(ngModelChange)="onPaymentAmountChange($event)"
				></ff-input>
			</div>
			
			<ff-spinner *ngIf="loading"></ff-spinner>
		</div>
		
		
		<div class="modal-footer">
			<button ff-button class="ff-button--secondary" (click)="cancel()">{{ 'general.cancel' | translate }}</button>
			<button ff-button (click)="save()" [loading]="saving" [disabled]="loading">{{ 'general.save' | translate }}</button>
		</div>
		
	`
})
export class BookPaymentComponent implements OnInit {

	@Input() headline: string;
	@Input() isExpenseBooking: boolean = false;

	@Input() amount: number;
	@Input() description: string;
	date: string;

	@Input() saving: boolean = false;

	@Output() onSave: EventEmitter<Payment> = new EventEmitter<Payment>();
	@Output() onCancel: EventEmitter<any> = new EventEmitter<any>();


	private form: FormGroup;
	private payment: Payment;
	private realPaymentAmount: number;
	loading: boolean = false;
	private bankAccounts: BankAccount[];

	constructor(private fb: FormBuilder, private paymentService: PaymentService) {
	}

	ngOnInit() {
		this.loading = true;
		this.paymentService.getBankAccounts()
			.subscribe(bankAccounts => {
				this.bankAccounts = bankAccounts;
				this.loading = false;
			});

		this.form = this.fb.group({
			date: ['', Validators.compose([Validators.required, FormValidator.date])],
		});
	}

	private onPaymentAmountChange(amount: number) {
		if (this.isExpenseBooking) {
			this.realPaymentAmount = amount * -1;
		} else {
			this.realPaymentAmount = amount;
		}
	}

	cancel() {
		this.onCancel.next();
	}

	save() {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			let payment = new Payment();
			payment.amount = this.realPaymentAmount;
			payment.date = this.date;
			payment.description = this.description;
			payment.bank_account = this.bankAccounts[0];

			this.onSave.emit(payment);
		}
	}
}
