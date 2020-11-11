import {Component, Input} from "@angular/core";
import {TerritoryService} from "../../../../services/territory.service";
import {Region} from "../../../../models/territory/region";
import {BaseSelectComponent} from "../../base-select.component";
import {HQZone} from '../../../../models/territory/zone';

@Component({
    selector: 'zone-select',
    templateUrl: 'zone-select.component.html'
})
export class ZoneSelectComponent extends BaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Zone";

    /**
     * First value text
     */
    @Input()
    first_value: string = "All";

    /**
     * Country id for filter
     */
    _country_id: number;

    /**
     * regions list
     *
     * @type {Array}
     */
    zones: HQZone[] = [];

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
        this.territoryService.zones(this._country_id).subscribe(
            response => {
                this.loading = false;
                this.zones = response.zones;
            },
            err => {
                this.loading = false;
            }
        );
    }
}
