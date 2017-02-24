import {Injectable} from "@angular/core";
import {Http, URLSearchParams, Response} from "@angular/http";
import {AppConstants} from "../app.constants";
import {Observable} from "rxjs";
import {Result} from "../models/result";

@Injectable()
export class CustomerService {

    protected baseUrl: string;
    protected customerTypeUrl: string;

    constructor(public http: Http) {
        this.baseUrl = AppConstants.API_ENDPOINT + 'customers';
        this.customerTypeUrl = AppConstants.API_ENDPOINT + 'customer_types';
    }

    /**
     * get all customer for user
     *
     * @returns {Observable<Result>}
     */
    all(customer_type_id?: number, grade_id?: number, page?: number, area_id?: number, territory_id?: number,
        headquarter_id?: number, brick_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('customer_type_id', String(customer_type_id > 0 ? customer_type_id : ''));
        params.set('grade_id', String(grade_id > 0 ? grade_id : ''));
        params.set('page', String(page > 0 ? page : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('territory_id', String(territory_id > 0 ? territory_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));
        params.set('brick_id', String(brick_id > 0 ? brick_id : ''));

        // make server call
        return this.http.get(this.baseUrl, {search: params})
            .map((res: Response) => {
                return res.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    /**
     * customer counts with customer type
     *
     * @returns {Observable<Result>}
     */
    counts(): Observable<Result> {

        // make server call
        return this.http.get(this.baseUrl + '/counts')
            .map((res: Response) => {
                return res.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}
