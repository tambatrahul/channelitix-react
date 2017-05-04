import {Input} from "@angular/core";
import {ListComponent} from "../../base/list.component";
import {AuthService} from "../../../services/AuthService";
declare let jQuery: any;


export abstract class BaseDashboardComponent extends ListComponent {


    /**
     * region id for filter
     */
    _region_ids: Array<number> = [];
    @Input()
    set region_ids(region_ids) {
        this._region_ids = region_ids;
        this.fetch();
    };

    /**
     * area id for filter
     */
    _area_ids: Array<number> = [];
    @Input()
    set area_ids(area_ids) {
        this._area_ids = area_ids;
        this.fetch();
    };

    /**
     * headquarter id for filter
     */
    _headquarter_ids: Array<number> = [];
    @Input()
    set headquarter_ids(headquarter_ids) {
        this._headquarter_ids = headquarter_ids;
        this.fetch();
    };

    /**
     * Base Component Constructor
     * @param _service
     */
    constructor(public _service: AuthService) {
        super(_service);
    }
}
