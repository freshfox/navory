import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {User} from "../models/user";

@Injectable()
export class UserService extends BaseService {

    private userMeUrl = '/user';

    constructor(http: Http) {
        super(http);
    }

    getOwnUser() {
        return this.get(this.userMeUrl)
            .then(data => {
                return data as User;
            });
    }

}
