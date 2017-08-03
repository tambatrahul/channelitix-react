import {Component, Input, Output, EventEmitter} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {TerritoryService} from "../../../../services/territory.service";

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
     *Emit headquarters
     */
    @Output()
    headquarters = new EventEmitter();

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
                this.headquarters.emit({
                    'headquarters' : this.models
                })
            },
            err => {
                this.loading = false;
            }
        );
    }
}
