import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    templateUrl: 'base.component.html'
})
export class BaseComponent {

    constructor(protected _router: Router) {
        _router.navigateByUrl('/dashboard');
    }
}
