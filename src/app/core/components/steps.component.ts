import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
	selector: 'nvry-steps',
	template: `
		<div class="step"
			 [class.step--current]="indexForStep(step) == currentIndex"
			 [class.step--done]="isStepDone(step)"
			 *ngFor="let step of steps"
			 (click)="stepClicked(step)">

			<div class="text">{{ step.name }}</div>
			<nvry-button class="button--clear step__change-link" *ngIf="isStepDone(step)">ändern</nvry-button>
		</div>
	`,
})
export class StepsComponent {


	@Input() currentIndex: number = 0;
	@Input() numberOfSteps: number;
	@Input() steps: Step[];
	@Output() currentIndexChange: EventEmitter<number> = new EventEmitter<number>();

	ngOnInit() {
	}

	indexForStep(step): number {
		return this.steps.indexOf(step);
	}

	isStepDone(step): boolean {
		return this.indexForStep(step) < this.currentIndex;
	}

	stepClicked(number) {
		this.currentIndex = number;
		this.currentIndexChange.emit(this.currentIndex);
	}
}

export interface Step {
	name: string;
}
