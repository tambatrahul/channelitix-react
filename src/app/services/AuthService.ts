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
            this._router.navigate(['/login?token=eyJhbGciOiJNRDUiLCJ0eXBlIjoiSldUIn0=.eyJ1c2VyX2lkIjoxLCJoZWFkcXVhcnRlcl9jb2RlIjoiMTo4NTo4Nzo4OCIsInJvbGUiOiJITyBBRE1JTiIsInJvbGVfaWQiOjMsInBlcm1pc3Npb25zIjp7IlVTRVIiOlsidmlldyIsImNyZWF0ZSIsInVwZGF0ZSIsImRlbGV0ZSJdLCJIRUFEUVVBUlRFUiI6WyJ2aWV3IiwiY3JlYXRlIiwidXBkYXRlIiwiZGVsZXRlIl0sIk9SR0FOSVpBVElPTiI6WyJ2aWV3IiwiY3JlYXRlIiwidXBkYXRlIiwiZGVsZXRlIl0sIkRFUEFSVE1FTlQiOlsidmlldyIsImNyZWF0ZSIsInVwZGF0ZSIsImRlbGV0ZSJdfX0=.dbb36895dd5349b94af6740b2f97c1c6']);
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
