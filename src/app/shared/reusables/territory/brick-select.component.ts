import {Component, Input, Output, EventEmitter} from "@angular/core";
import {TerritoryService} from "../../../base/services/territory.service";
import {Brick} from "../../../models/territory/brick";

@Component({
    selector: 'brick-select',
    templateUrl: 'templates/brick-select.component.html'
})
export class BrickSelectComponent {

    /**
     * selected brick
     */
    @Input()
    brick_id: number;

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Brick";

    @Output()
    onBrickChanged = new EventEmitter();

    /**
     * headquarter id for filter
     */
    private _headquarter_id: number;

    /**
     * loading for server call
     * @type {boolean}
     */
    private loading: boolean = false;

    /**
     * brick list
     *
     * @type {Array}
     */
    private bricks: Brick[] = [];

    constructor(private territoryService: TerritoryService) {
    }

    /**
     * on load of component load territories
     */
    ngOnInit() {
        this.fetch();
    }

    /**
     * brick_id getter and setters
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
     * load bricks
     */
    fetch() {
        this.loading = true;
        this.territoryService.brick(this._headquarter_id).subscribe(
            response => {
                this.loading = false;
                this.bricks = response.bricks;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * emit on change of value
     */
    onBrickChange(b_id) {
        this.brick_id = b_id;
        this.onBrickChanged.emit(b_id);
    }
}
