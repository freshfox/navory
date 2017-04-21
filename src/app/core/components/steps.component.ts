import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
	selector: 'nvry-steps',
	template: `
		<div class="step"
			 [class.step--current]="indexForStep(step) == currentIndex"
			 [class.step--done]="isStepDone(step)"
			 *ngFor="let step of steps">

			<div class="text">
				<div>{{ step.name }}</div>
				<p *ngIf="step.getValue" class="step__value">{{ step.getValue() }}</p>
			</div>
			<a href="javascript:void(0)"class="step__change-link" *ngIf="isStepDone(step)" (click)="changeLinkClicked(step)">ändern</a>
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

	setCurrentIndex(number) {
		this.currentIndex = number;
		this.currentIndexChange.emit(this.currentIndex);
	}

	changeLinkClicked(step: Step) {
		this.setCurrentIndex(this.indexForStep(step));
	}
}

export class Step {
	name: string;
	getValue?: Function;
}
