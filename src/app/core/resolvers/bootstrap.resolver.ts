import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {BootstrapService} from "../../services/bootstrap.service";

@Injectable()
export class BootstrapResolver implements Resolve<any> {

    constructor(private bootstrapService: BootstrapService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.bootstrapService.getBootstrapData();
    }
}
