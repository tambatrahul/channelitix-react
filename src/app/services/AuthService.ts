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

    /**
     * auth Service constructor
     *
     * @param http
     * @param _router
     * @param _cookieService
     */
    constructor(public http: Http, public _router: Router) {
        if (localStorage.getItem("user") != "undefined" && localStorage.getItem("user") !== null && localStorage.getItem("user") !== "null") {
            this.user = new User(JSON.parse(localStorage.getItem("user")));
        }
    }

    /**
     * Check if the user is logged in or not
     * redirect to login pages when user is not correct
     */
    checkCredentials() {
        if (localStorage.getItem("user") === null || localStorage.getItem("user") === 'null') {
            this._router.navigate(['/login']);
        }
    }

    /**
     * logout user
     */
    logout() {
        localStorage.setItem("user", null);
        // this._cookieService.put('auth_token', '');
        this._router.navigate(['/login']);
    }
}
