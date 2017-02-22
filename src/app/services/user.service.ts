import {Injectable} from "@angular/core";
import {Http, URLSearchParams, Response} from "@angular/http";
import {AppConstants} from "../app.constants";
import {Observable} from "rxjs";
import {Result} from "../models/result";

@Injectable()
export class UserService {

  protected baseUrl: string;

  constructor(public http: Http) {
    this.baseUrl = AppConstants.API_ENDPOINT + 'users';
  }

  /**
   * get children for user
   */
  children(month: number, year: number, role_id?: number): Observable<Result> {

    // prepare url
    let url = this.baseUrl + '/children';

    // prepare get params
    let params = new URLSearchParams();
    params.set('role_id', String(role_id ? role_id : ''));

    // make server call
    return this.http.get(url, {search: params})
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
