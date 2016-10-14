import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'nvry-spinner',
    templateUrl: `
        <svg class="spinner" width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>`
})
export class SpinnerComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }

}
