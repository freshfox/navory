import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {FormValidator} from "../../core/form-validator";
import {Helpers} from "../../core/helpers";
import {Payment} from "../../models/payment";
import {BankAccount} from "../../models/bank-account";

@Component({
	selector: 'nvry-book-payment',
	template: `
		<div class="modal-header">
				{{ 'general.book-incoming-payment' | translate }}
		</div>
		<div class="modal-inner">
			<div class="add-payment-form">
				<nvry-input class="description" [(ngModel)]="payment.description" [label]="'general.description' | translate"></nvry-input>
				
				<nvry-input type="date"
						[formControl]="form.controls.date"
						[(ngModel)]="payment.date"
						[label]="'general.date' | translate"></nvry-input>
		
				<nvry-input 
				class="amount" 
				type="money" 
				[label]="'general.amount' | translate" 
				[(ngModel)]="payment.amount" 
				></nvry-input>
			</div>
		</div>
		
		
		<div class="modal-footer">
			<nvry-button class="button--secondary" (click)="cancel()">{{ 'general.cancel' | translate }}</nvry-button>
			<nvry-button (click)="save()" [loading]="saving">{{ 'general.save' | translate }}</nvry-button>
		</div>
	`
})
export class BookPaymentComponent implements OnInit {

	@Input() amount: number;
	@Input() description: string;
	@Input() saving: boolean = false;

	@Output() onSave: EventEmitter<Payment> = new EventEmitter<Payment>();
	@Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

	private form: FormGroup;
	private payment: Payment;
	private loading: boolean = false;

	constructor(private fb: FormBuilder) {
	}

	ngOnInit() {
		this.payment = new Payment();
		this.payment.amount = this.amount;
		this.payment.description = this.description;

		this.form = this.fb.group({
			date: ['', Validators.compose([Validators.required, FormValidator.date])],
		});
	}

	private cancel() {
		this.onCancel.next();
	}

	private save() {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			this.loading = true;
			this.payment.bank_account = new BankAccount({id: 1});
			this.onSave.emit(this.payment);
		}
	}
}
