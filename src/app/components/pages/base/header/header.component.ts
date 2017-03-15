import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {User} from "../../../../models/user/user";
import {Router} from "@angular/router";

@Component({
    selector: 'header-comp',
    templateUrl: 'header.component.html'
})
export class HeaderComponent {

    /**
     * Logged in user
     */
    public user: User;

    /**
     * Header component constructor
     *
     * @param _router
     * @param _authService
     */
    constructor(public _router: Router, private _authService: AuthService) {
        this.user = _authService.user;
    }


    /**
     * on load of call fetch
     */
    ngOnInit() {
        if (localStorage.getItem("user") == null || localStorage.getItem("user") == 'null') {
            this._router.navigate(['/login']);
        }
    }

    /**
     * logout user
     */
    logout() {
        this._authService.logout();
    }
}
