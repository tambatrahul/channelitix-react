import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {ReportService} from "../../../../services/report.service";

declare let jQuery: any;

@Component({
    templateUrl: 'report_icons_ui.html',
    styleUrls: ['report_icons_ui.less']
})
export class ReportIconsComponent extends ListComponent {


    /**
     * User Component Constructor
     */
    constructor(public _service: AuthService, public reportService: ReportService) {
        super(_service);
    }

    /**
     * on load of call fetch
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * load users for logged in user
     */
    fetch() {

    }
}
