import {Injectable} from "@angular/core";
import {User} from "../models/user";

@Injectable()
export class State {

    user: User;
    selectedExpenseMonthIndex: number;

}
