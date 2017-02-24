import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {AppConstants} from "../../app.constants";
import {Observable} from "rxjs";
import {Result} from "../../models/result";
import {User} from "../../models/user/user";

@Injectable()
export class LoginService {

  protected baseUrl: string;

  private user: User;

  constructor(public http: Http) {
    this.baseUrl = AppConstants.API_ENDPOINT + 'auth';
  }

  /**
   * get children for user
   */
  login(username: string, password: string): Observable<Result> {

    // make server call
    return this.http.post(this.baseUrl + '/login', {username: username, password: password}, {withCredentials: true})
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * get user for token
   */
  forToken(token: number): Observable<Result> {

    // make server call
    return this.http.get(this.baseUrl + '/forToken/' + token)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
