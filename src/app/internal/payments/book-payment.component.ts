import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {FormValidator} from "../../core/form-validator";
import {Helpers} from "../../core/helpers";
import {Payment} from "../../models/payment";
import {InvoiceService} from "../../services/invoice.service";
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
			<nvry-button (click)="save()">{{ 'general.save' | translate }}</nvry-button>
		</div>
	`
})
export class BookPaymentComponent implements OnInit {

	@Input() invoiceId: string;
	@Input() amount: number;
	@Input() description: string;

	@Output() onSaved: EventEmitter<Payment> = new EventEmitter<Payment>();
	@Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

	private form: FormGroup;
	private payment: Payment;
	private loading: boolean = false;

    constructor(private fb: FormBuilder, private invoiceService: InvoiceService) {
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
    	this.loading = true;
    	this.payment.bank_account = new BankAccount({ id: 1 });
		this.invoiceService.addPayment(this.invoiceId, this.payment)
			.subscribe((payment: Payment) => {
				this.onSaved.emit(payment);
				this.loading = false;
			});
	}

}
