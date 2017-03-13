import {Component, Input} from "@angular/core";
import {TerritoryService} from "../../../../../services/territory.service";
import {BaseSelectComponent} from "../../../section/base-select.component";

@Component({
    selector: 'brick-select',
    templateUrl: 'brick-select.component.html'
})
export class BrickSelectComponent extends BaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Brick";

    /**
     * First value text
     */
    @Input()
    first_value: string = "All";

    /**
     * Territory id for filter
     */
    private _territory_id: number;

    constructor(private territoryService: TerritoryService) {
        super();
    }

    /**
     * territory_id getter and setters
     *
     * @param territory_id
     */
    @Input()
    set territory_id(territory_id: number) {
        this._territory_id = territory_id;
        this.fetch();
    }

    get territory_id(): number {
        return this._territory_id;
    }

    /**
     * load bricks
     */
    fetch() {
        this.loading = true;
        this.territoryService.brick(this.territory_id).subscribe(
            response => {
                this.loading = false;
                this.models = response.bricks;
            },
            err => {
                this.loading = false;
            }
        );
    }
}
