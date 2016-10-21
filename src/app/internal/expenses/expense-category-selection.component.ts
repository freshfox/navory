import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Category} from "../../models/category";

@Component({
    selector: 'nvry-expense-category-selection',
    template: `
        <div class="category-selection">
            <div class="category-selection__column" *ngFor="let category of categories">
                <h3>{{ category.name }}</h3>
                <button class="category" data-id="{{ this.id }}" *ngFor="let subCategory of category.sub_categories" (click)="onCategorySelected(subCategory)">{{ subCategory.name }}</button>
            </div>
        </div>
        `
})
export class ExpenseCategorySelectionComponent implements OnInit {

    @Input() categories: Category[];
    @Output() categorySelected: EventEmitter<Category> = new EventEmitter<Category>();

    constructor() { }

    ngOnInit() { }

    onCategorySelected(category: Category) {
        this.categorySelected.next(category);
    }

}
