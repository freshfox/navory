import {Injectable} from '@angular/core';

@Injectable()
export class CustomersService {

	private customersUrl = '/customers';

	/*getCustomers(): Observable<Customer[]> {
		console.log(BaseService.prototype);
		return BaseService.prototype.get.call(this, this.customersUrl).map(
			response => {
				return response.json();
			}
		);
	}*/

}
