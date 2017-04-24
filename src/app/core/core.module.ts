// module definition
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IconComponent} from "./components/icon";
import {ButtonComponent} from "./components/button.component";

@NgModule({
	imports: [BrowserModule],
	declarations: [IconComponent, ButtonComponent],
	exports: [IconComponent, ButtonComponent],
})
export class CoreModule {
}
