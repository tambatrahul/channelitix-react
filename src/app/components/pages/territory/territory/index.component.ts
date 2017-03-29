import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Territory} from "../../../../models/territory/territory";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {TerritoryService} from "../../../../services/territory.service";


@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class TerritoryComponent extends ListComponent {

    /**
     * territorys
     *
     * @type {{}}
     */
    public territorys: Territory[] = [];

    /**
     * region id for filter
     */
    private _headquarter_id: number;
    private _area_id: number;
    private _region_id: number;

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
            this._area_id = params['area_id'];
            this._headquarter_id = params['headquarter_id'];
            this.loading = true;
            this.territoryService.territory(this._headquarter_id).subscribe(
                response => {
                    this.loading = false;
                    this.territorys = response.territories.map(function (territory) {
                        return new Territory(territory);
                    });
                },
                err => {
                    this.loading = false;
                }
            );
        });
    }
}
