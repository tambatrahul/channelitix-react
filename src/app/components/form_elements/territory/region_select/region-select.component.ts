import {Component, Input} from "@angular/core";
import {TerritoryService} from "../../../../services/territory.service";
import {Region} from "../../../../models/territory/region";
import {BaseSelectComponent} from "../../base-select.component";

@Component({
    selector: 'region-select',
    templateUrl: 'region-select.component.html'
})
export class RegionSelectComponent extends BaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Region";

    /**
     * First value text
     */
    @Input()
    first_value: string = "All";

    /**
     * Country id for filter
     */
    private _country_id: number;

    /**
     * regions list
     *
     * @type {Array}
     */
    private regions: Region[] = [];

    constructor(private territoryService: TerritoryService) {
        super();
    }

    /**
     * country_id getter and setters
     *
     * @param country_id
     */
    @Input()
    set country_id(country_id: number) {
        this._country_id = country_id;
        this.fetch();
    }

    get country_id(): number {
        return this._country_id;
    }

    /**
     * load regions
     */
    fetch() {
        this.loading = true;
        this.territoryService.regions(this._country_id).subscribe(
            response => {
                this.loading = false;
                this.regions = response.regions;
            },
            err => {
                this.loading = false;
            }
        );
    }
}
