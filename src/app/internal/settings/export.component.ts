import {Component, OnInit} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExportType, AccountService} from "../../services/account.service";
var moment = require("moment");

@Component({
	selector: 'nvry-export',
	templateUrl: './export.component.html'
})
export class ExportComponent implements OnInit {

	exportTypes;
	type: ExportType;
	startDate: string;
	endDate: string;

	form: FormGroup;

	constructor(private translate: TranslateService, private fb: FormBuilder, private accountService: AccountService) {
		this.exportTypes = [
			{
				value: ExportType.Income,
				name: this.translate.instant('general.income')
			},
			{
				value: ExportType.Invoices,
				name: this.translate.instant('general.invoices')
			},
			{
				value: ExportType.Expenses,
				name: this.translate.instant('general.expenses')
			}];
	}

	ngOnInit() {
		setTimeout(() => {
			this.startDate = moment().startOf('year').toDate();
			this.endDate = moment().endOf('year').toDate();
		}, 1)

		this.form = this.fb.group({
			type: [""],
			startDate: ["", Validators.required],
			endDate: ["", Validators.required],
		});
	}

	download() {
		if (this.form.valid) {
			this.accountService.downloadExport(this.type, this.startDate, this.endDate);
		}
	}

}
