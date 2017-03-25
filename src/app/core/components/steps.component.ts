import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'nvry-steps',
	template: `
		<div 	class="step"
				[class.step--current]="step == currentIndex" 
				[class.step--done]="step < currentIndex"
				*ngFor="let step of steps" 
				(click)="stepClicked(step)">
			
				<nvry-icon [name]="stepInfo[step].icon"></nvry-icon>
				<span class="text">{{ step + 1 }}. {{ stepInfo[step].name }}</span>
		</div>
	`,
})
export class StepsComponent {

	steps: Array<number>;

	@Input() currentIndex: number = 0;
	@Input() numberOfSteps: number;
	@Input() stepInfo: StepInfo[];
	@Output() currentIndexChange:EventEmitter<number> = new EventEmitter<number>();

	ngOnInit() {
		this.steps = Array(this.numberOfSteps).fill(1).map((x,i)=>i);
	}

	stepClicked(number) {
		//this.currentIndex = number;
		//this.currentIndexChange.emit(this.currentIndex);
	}
}

export interface StepInfo {
	name: string;
	icon: string;
}
