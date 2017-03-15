import {Component, Input} from "@angular/core";
import {MultipleBaseSelectComponent} from "../../base-multiple-select.component";
import {TerritoryService} from "../../../../services/territory.service";
import {Headquarter} from "../../../../models/territory/headquarter";

@Component({
    selector: 'multiple-headquarter-select',
    templateUrl: 'multiple-headquarter-select.component.html'
})
export class MultipleHeadquarterSelectComponent extends MultipleBaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Headquarters";

    /**
     * Select Headquarter
     *
     * @type {Array}
     */
    @Input()
    territory_ids: Array<number> = [];

    /**
     * area id for filter
     */
    private _area_id: number;

    /**
     * Multiple territory select component
     * @param service
     */
    constructor(private service: TerritoryService) {
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
        this.service.headquarter(this._area_id).subscribe(
            response => {
                this.loading = false;
                this.models = response.headquarters.map(function (t, key) {
                    return new Headquarter(t);
                });
            },
            err => {
                this.loading = false;
            }
        );
    }
}
