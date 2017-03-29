import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {Region} from "../../../../models/territory/region";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {TerritoryService} from "../../../../services/territory.service";


@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class RegionComponent extends ListComponent {

    /**
     * regions
     *
     * @type {{}}
     */
    public regions: Region[] = [];

    /**
     * User Component Constructor
     */
    constructor(private territoryService: TerritoryService, public _router: Router, public _service: AuthService) {
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
        this.loading = true;
        this.territoryService.regions().subscribe(
            response => {
                this.loading = false;
                this.regions = response.regions.map(function (region) {
                    return new Region(region);
                });
            },
            err => {
                this.loading = false;
            }
        );
    }
}
