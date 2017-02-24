import {Injectable} from "@angular/core";
import {Http, Response, URLSearchParams} from "@angular/http";
import {AppConstants} from "../app.constants";
import {Observable} from "rxjs";
import {Result} from "../models/result";

@Injectable()
export class TerritoryService {

    protected baseUrl: string;

    constructor(public http: Http) {
        this.baseUrl = AppConstants.API_ENDPOINT + 'areas';
    }

    /**
     * get areas
     */
    public area(): Observable<Result> {
        // prepare url
        let url = this.baseUrl;

        // make server call
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    /**
     * get territories for Area
     */
    public territory(area_id: number): Observable<Result> {
        // prepare url
        let url = this.baseUrl + '/territories';

        // prepare get params
        let params = new URLSearchParams();
        params.set('area_id', String(area_id > 0 ? area_id : ''));

        // make server call
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

    /**
     * get headquarter for territory
     */
    public headquarter(territory_id: number): Observable<Result> {
        // prepare url
        let url = this.baseUrl + '/headquarters';

        // prepare get params
        let params = new URLSearchParams();
        params.set('territory_id', String(territory_id > 0 ? territory_id : ''));

        // make server call
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

    /**
     * get brick for headquarter
     */
    public brick(headquarter_id: number): Observable<Result> {
        // prepare url
        let url = this.baseUrl + '/bricks';

        // prepare get params
        let params = new URLSearchParams();
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        // make server call
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }
}
