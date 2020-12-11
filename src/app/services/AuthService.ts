import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {User} from "../models/user/user";

@Injectable()
export class AuthService {
    /**
     * logged in user
     */
    public user: User;

    public auth_token: string;

    /**
     * auth Service constructor
     *
     * @param http
     * @param _router
     * @param _cookieService
     */
    constructor(public http: Http, public _router: Router) {
        if (localStorage.getItem("auth_token") != "undefined" && localStorage.getItem("auth_token") !== null && localStorage.getItem("auth_token") !== "null") {
            //this.user = new User(JSON.parse(localStorage.getItem("user")));
            this.auth_token = localStorage.getItem("auth_token");
        }
    }

    /**
     * Check if the user is logged in or not
     * redirect to login pages when user is not correct
     */
    checkCredentials() {
        if (localStorage.getItem("auth_token") === null || localStorage.getItem("auth_token") === 'null') {
            this._router.navigate(['/login']);
        }
    }

    /**
     * logout user
     */
    logout() {
        localStorage.setItem("auth_token", null);
        // this._cookieService.put('auth_token', '');
        this._router.navigate(['/login']);
    }
}
