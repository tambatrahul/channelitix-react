import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {BaseComponent} from "../../../base/base.component";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class MoradabadHQComponent extends BaseComponent {


    constructor(public _service: AuthService) {
        super();
    }
}
