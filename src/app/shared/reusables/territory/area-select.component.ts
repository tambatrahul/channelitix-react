import {Component, Input, Output, EventEmitter} from "@angular/core";
import {TerritoryService} from "../../../base/services/territory.service";
import {Area} from "../../../models/territory/Area";

@Component({
    selector: 'area-select',
    templateUrl: 'templates/area-select.component.html'
})
export class AreaSelectComponent {

    /**
     * selected Area
     */
    @Input()
    area_id: number;

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Area";

    /**
     * event on Area changed
     *
     * @type {EventEmitter}
     */
    @Output()
    onAreaChanged = new EventEmitter();

    /**
     * loading for server call
     * @type {boolean}
     */
    private loading: boolean = false;

    /**
     * areas list
     *
     * @type {Array}
     */
    private areas: Area[] = [];

    constructor(private territoryService: TerritoryService) {
    }

    /**
     * on load of component load territories
     */
    ngOnInit() {
        this.fetch();
    }

    /**
     * load areas
     */
    fetch() {
        this.loading = true;
        this.territoryService.area().subscribe(
            response => {
                this.loading = false;
                this.areas = response.areas;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * Territory changed
     */
    onAreaChange(a_id) {
        this.area_id = a_id;
        this.onAreaChanged.emit(a_id);
    }
}
