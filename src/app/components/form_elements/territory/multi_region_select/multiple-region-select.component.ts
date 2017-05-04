import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MultipleBaseSelectComponent} from "../../base-multiple-select.component";
import {TerritoryService} from "../../../../services/territory.service";
import {Headquarter} from "../../../../models/territory/headquarter";
import {Region} from "../../../../models/territory/region";

@Component({
    selector: 'multiple-region-select',
    templateUrl: 'multiple-region-select.component.html'
})
export class MultipleRegionSelectComponent extends MultipleBaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Regions";

    /**
     * Select regions
     *
     * @type {Array}
     */
    @Input()
    region_ids: Array<number> = [];

    /**
     * country id for filter
     */
    private _country_id: number;

    /**
     * output selected events
     * @type {EventEmitter}
     */
    @Output()
    selectedRegion = new EventEmitter();

    /**
     * Multiple region select component
     * @param service
     */
    constructor(private service: TerritoryService) {
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
     * load headquarters
     */
    fetch() {
        this.loading = true;
        this.service.regions(this._country_id).subscribe(
            response => {
                this.loading = false;
                this.models = response.regions.map(function (t, key) {
                    return new Region(t);
                });
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * when region is selected
     * @param id
     */
    selectValue(id: number) {
        let regions = this.region_ids.map(region_id => region_id);
        if (regions.indexOf(id) < 0)
            regions.push(id);
        else
            regions.splice(regions.indexOf(id), 1);

        this.selectedRegion.emit(regions);
    }
}
