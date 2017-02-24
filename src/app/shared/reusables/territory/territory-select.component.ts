import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Territory} from "../../../models/territory/territory";
import {TerritoryService} from "../../../services/territory.service";

@Component({
    selector: 'territory-select',
    templateUrl: 'templates/territory-select.component.html'
})
export class TerritorySelectComponent {

    /**
     * selected territory
     */
    @Input()
    territory_id: number;

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Territory";

    @Output()
    onTerritoryChanged = new EventEmitter();

    /**
     * Area id for filter
     */
    private _area_id: number;

    /**
     * loading for server call
     * @type {boolean}
     */
    private loading: boolean = false;

    /**
     * territories list
     *
     * @type {Array}
     */
    private territories: Territory[] = [];

    constructor(private territoryService: TerritoryService) {
    }

    /**
     * on load of component load territories
     */
    ngOnInit() {
        this.fetch();
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
     * load territories
     */
    fetch() {
        this.loading = true;
        this.territoryService.territory(this._area_id).subscribe(
            response => {
                this.loading = false;
                this.territories = response.territories;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * emit on change of value
     */
    onTerritoryChange(t_id) {
        this.territory_id = t_id;
        this.onTerritoryChanged.emit(t_id);
    }
}
