import {Component, Input, Output, EventEmitter} from "@angular/core";
import {TerritoryService} from "../../../services/territory.service";
import {Headquarter} from "../../../models/territory/headquarter";

@Component({
    selector: 'headquarter-select',
    templateUrl: '../../../templates/page/section/headquarter-select.component.html'
})
export class HeadquarterSelectComponent {

    /**
     * selected territory
     */
    @Input()
    headquarter_id: number;

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Headquarter";

    @Output()
    onHeadquarterChanged = new EventEmitter();

    /**
     * Territory id for filter
     */
    private _territory_id: number;

    /**
     * loading for server call
     * @type {boolean}
     */
    private loading: boolean = false;

    /**
     * headquarters list
     *
     * @type {Array}
     */
    private headquarters: Headquarter[] = [];

    constructor(private territoryService: TerritoryService) {
    }

    /**
     * on load of component load territories
     */
    ngOnInit() {
        this.fetch();
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
     * load headquarters
     */
    fetch() {
        this.loading = true;
        this.territoryService.headquarter(this._territory_id).subscribe(
            response => {
                this.loading = false;
                this.headquarters = response.headquarters;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * emit on change of value
     */
    onHeadquarterChange(h_id) {
        this.headquarter_id = h_id;
        this.onHeadquarterChanged.emit(h_id);
    }
}
