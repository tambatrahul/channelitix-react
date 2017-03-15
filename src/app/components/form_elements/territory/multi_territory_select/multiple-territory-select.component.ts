import {Component, Input} from "@angular/core";
import {MultipleBaseSelectComponent} from "../../base-multiple-select.component";
import {TerritoryService} from "../../../../services/territory.service";
import {Territory} from "../../../../models/territory/territory";

@Component({
    selector: 'multiple-territory-select',
    templateUrl: 'multiple-territory-select.component.html'
})
export class MultipleTerritorySelectComponent extends MultipleBaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Territories";

    /**
     * Select Territory
     *
     * @type {Array}
     */
    @Input()
    territory_ids: Array<number> = [];

    /**
     * role id for filter
     */
    private _headquarter_id: number;

    /**
     * Multiple territory select component
     * @param service
     */
    constructor(private service: TerritoryService) {
        super();
    }

    /**
     * headquarter_id getter and setters
     *
     * @param headquarter_id
     */
    @Input()
    set headquarter_id(headquarter_id: number) {
        this._headquarter_id = headquarter_id;
        this.fetch();
    }

    get headquarter_id(): number {
        return this._headquarter_id;
    }

    /**
     * load territories
     */
    fetch() {
        this.loading = true;
        this.service.territory(this._headquarter_id).subscribe(
            response => {
                this.loading = false;
                this.models = response.territories.map(function (t, key) {
                    return new Territory(t);
                });
            },
            err => {
                this.loading = false;
            }
        );
    }
}
