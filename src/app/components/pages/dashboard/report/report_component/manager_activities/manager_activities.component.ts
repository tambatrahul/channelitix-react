import {Component, Input} from "@angular/core";
import {ReportService} from "../../../../../../services/report.service";
import {AuthService} from "../../../../../../services/AuthService";
import {Region} from "../../../../../../models/territory/region";
import {ListComponent} from "../../../../../base/list.component";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: '[manager-activities]',
    styleUrls: ['manager_activities.component.less'],
    templateUrl: 'manager_activities.component.html'
})
export class ManagerActivitiesComponent extends ListComponent {

    public _regions: Region[];
    @Input()
    set regions(regions) {
        this._regions = regions;
        this.fetch();
    }


    /**
     * month of sales
     */
    public _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
    }

    /**
     * year of sale
     */
    public _year: number;
    @Input()
    set year(year: number) {
        this._year = year;
    }


    show_data: boolean = false;

    /**
     * User Component Constructor
     */
    constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * Chart data
     */
    fetch() {

    }
}
