import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {Category} from "../../models/category";

@Component({
	selector: 'nvry-expense-category-selection',
	template: `
		<div class="flex" style="max-height: 600px;">
			<div class="overflow-y-auto p-6 py-8 w-full">
				<div class="grid grid-cols-3 gap-4 gap-y-8 w-full">
					<div *ngFor="let category of categories">
						<h3 class="font-bold mb-1">{{ category.name }}</h3>
						<div class="space-y-1">
							<button *ngFor="let subCategory of category.sub_categories" (click)="onCategorySelected(subCategory)" class="block hover:text-primary">{{ subCategory.name }}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
        `
})
export class ExpenseCategorySelectionComponent implements OnInit {

	@Input() categories: Category[];
	@Output() categorySelected: EventEmitter<Category> = new EventEmitter<Category>();

	constructor() {
	}

	ngOnInit() {
	}

	onCategorySelected(category: Category) {
		this.categorySelected.next(category);
	}

}
