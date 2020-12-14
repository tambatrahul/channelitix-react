import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {User} from "../../../../models/user/user";
import {Router} from "@angular/router";

@Component({
    selector: 'header-comp',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.less']
})
export class HeaderComponent {

    /**
     * Logged in user
     */
    public user: User;
    public continueUrl: string;

    /**
     * Header component constructor
     *
     * @param _router
     * @param _authService
     */
    constructor(public _router: Router, private _authService: AuthService) {
        this.user = _authService.user;
    }


    // /**
    //  * on load of call fetch
    //  */
    // ngOnInit() {
    //     if (localStorage.getItem("user") == null || localStorage.getItem("user") == 'null') {
    //       this.continueUrl = encodeURIComponent('https://geo.channelitix.com/login');
    //         window.location.href = 'http://localhost:3003/login?continue=' + this.continueUrl;
    //     }
    // }

  /**
   * on load of call fetch
   */
  ngOnInit() {
    if (localStorage.getItem("user") == null || localStorage.getItem("user") == 'null') {
      this._router.navigate(['/login']);
    }
  }
    /**
     * actions on view load
     */
    ngAfterViewInit() {
        let pCon = jQuery('.page-container');

        let fxHeader = pCon.hasClass('fixed-header');
        let conInnnerWidth = jQuery('.main-container').innerWidth();

        if (fxHeader) {
            jQuery('.top-bar').css({
                'width': conInnnerWidth + 'px'
            });
        }

        jQuery('.leftbar-action').on('click', function (event) {
            event.preventDefault();

            if (pCon.hasClass('list-menu-view')) {
                pCon.removeClass('list-menu-view');
                pCon.addClass('hide-list-menu');
            } else {
                pCon.removeClass('hide-list-menu');
                pCon.addClass('list-menu-view');
            }

        });
        jQuery('.leftbar-action-mobile').on('click', function (event) {
            event.preventDefault();

            if (pCon.hasClass('list-menu-view')) {
                pCon.removeClass('list-menu-view');
                pCon.addClass('hide-list-menu');

            } else {
                pCon.removeClass('hide-list-menu');
                pCon.addClass('list-menu-view');
            }
        });

        jQuery('.aside-close').on('click', function (ev) {
            pCon.removeClass('hide-list-menu');
            pCon.addClass('list-menu-view');
        });
    }

    /**
     * logout user
     */
    logout() {
        this._authService.logout();
    }
}
