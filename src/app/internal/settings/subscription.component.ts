import {Component, OnInit} from "@angular/core";
import {ModalService} from "../../core/modal.module";
import {SubscriptionFormComponent} from "./subscription-form.component";

@Component({
	selector: 'nvry-subscription',
	templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {


	yearly: boolean = true;


	constructor(private modalService: ModalService) {

	}

	ngOnInit() {
		this.openPaymentModal();
	}

	openPaymentModal() {
		this.modalService.create(SubscriptionFormComponent, null, false);
	}

	get proPrice(): number {
		return this.yearly ? 10 : 12;
	}
}
