import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Area} from "../../../../models/territory/area";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {TerritoryService} from "../../../../services/territory.service";


@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class AreaComponent extends ListComponent {

    /**
     * areas
     *
     * @type {{}}
     */
    public areas: Area[] = [];

    /**
     * region id for filter
     */
    private _region_id: number;
    private _country_id: number;

    /**
     * User Component Constructor
     */
    constructor(private territoryService: TerritoryService, public _router: Router,
                public _service: AuthService, public route: ActivatedRoute) {
        super(_service);
    }

    /**
     * initialize component
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.route.params.subscribe(params => {
            this._region_id = params['region_id'];
            this.loading = true;
            this.territoryService.area(this._region_id).subscribe(
                response => {
                    this.loading = false;
                    this.areas = response.areas.map(function (area) {
                        return new Area(area);
                    });
                },
                err => {
                    this.loading = false;
                }
            );
        });
    }
}
