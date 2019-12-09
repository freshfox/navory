import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
	imports: [BrowserModule, MatProgressSpinnerModule, MatTooltipModule],
})
export class FFMaterialModule {
}
