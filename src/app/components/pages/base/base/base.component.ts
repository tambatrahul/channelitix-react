import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";

@Component({
    templateUrl: 'base.component.html'
})
export class BaseComponent {

    constructor(protected _router: Router, public _service: AuthService) {
        if (_service.user.role_id != 3)
            _router.navigateByUrl('/dashboard');
        else if(_service.user.role_id == 3)
            _router.navigateByUrl('/attendances/monthly');
        else if(_service.user.role_id == 7)
            _router.navigateByUrl('/visits');
    }
}
