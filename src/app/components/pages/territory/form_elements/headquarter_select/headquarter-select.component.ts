import {Component, Input} from "@angular/core";
import {TerritoryService} from "../../../../../services/territory.service";
import {BaseSelectComponent} from "../../../section/base-select.component";

@Component({
    selector: 'headquarter-select',
    templateUrl: 'headquarter-select.component.html'
})
export class HeadquarterSelectComponent extends BaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Headquarter";

    /**
     * First value text
     */
    @Input()
    first_value: string = "All";

    /**
     * Area id for filter
     */
    private _area_id: number;

    constructor(private territoryService: TerritoryService) {
        super();
    }

    /**
     * area_id getter and setters
     *
     * @param area_id
     */
    @Input()
    set area_id(area_id: number) {
        this._area_id = area_id;
        this.fetch();
    }

    get area_id(): number {
        return this._area_id;
    }

    /**
     * load headquarters
     */
    fetch() {
        this.loading = true;
        this.territoryService.headquarter(this._area_id).subscribe(
            response => {
                this.loading = false;
                this.models = response.headquarters;
            },
            err => {
                this.loading = false;
            }
        );
    }
}
