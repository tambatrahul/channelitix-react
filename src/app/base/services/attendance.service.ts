import {Injectable} from "@angular/core";
import {Http, URLSearchParams, Response} from "@angular/http";
import {AppConstants} from "../../app.constants";
import {Observable} from "rxjs";
import {Result} from "../../models/result";

@Injectable()
export class AttendanceService {

  protected baseUrl: string;

  constructor(public http: Http) {
    this.baseUrl = AppConstants.API_ENDPOINT + 'attendances';
  }

  /**
   * get attendance report
   */
  forChildren(month: number, year: number, role_id?: number, manager_id?: number): Observable<Result> {

    // prepare url
    let url = this.baseUrl + '/monthly/forChildren/' + month + "/" + year;

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id > 0 ? role_id : ''));
    params.set('manager_id', String(manager_id > 0 ? manager_id : ''));

    // make server call
    return this.http.get(url, {search: params})
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
