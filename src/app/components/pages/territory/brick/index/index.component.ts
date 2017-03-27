import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ListComponent} from "../../../../base/list.component";
import {Brick} from "../../../../../models/territory/brick";
import {BrickService} from "../../../../../services/brick.service";
import {AuthService} from "../../../../../services/AuthService";


@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class BrickComponent extends ListComponent {

    /**
     * bricks
     *
     * @type {{}}
     */
    public bricks: Brick[] = [];

    /**
     * region, territory, area, headquarter & brick id
     */
    public region_id: number = 0;
    public area_id: number = 0;
    public territory_id: number = 0;
    public headquarter_id: number = 0;
    public brick_id: number = 0;
    
    /**
     * User Component Constructor
     */
    constructor(private brickService: BrickService, public _router: Router, public _service: AuthService) {
        super(_service);
    }

    /**
     * initialize component
     */
    ngOnInit() {
        super.ngOnInit();
        this.regionChanged(this._service.user.hq_region_id);
        this.areaChanged(this._service.user.hq_area_id);
        this.headquarterChanged(this._service.user.hq_headquarter_id);
        this.territoryChanged(this._service.user.hq_territory_id);
        this.brickChanged(this._service.user.hq_brick_id);

    }
    
    /**
     * load users for logged in user
     */
    fetch() {
        this.loading = true;
        this.brickService.bricks().subscribe(
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
     * Update Brick
     */
    updateBrick(id: number) {
        this._router.navigate(['/bricks/update/', id]);
    }

    /**
     * when region is changed filter list of customer
     * @param region_id
     */
    regionChanged(region_id) {
        this.region_id = region_id;
        this.areaChanged(0);
    }

    /**
     * when area is changed filter list of customer
     * @param area_id
     */
    areaChanged(area_id) {
        this.area_id = area_id;
        this.headquarterChanged(0);
    }

    /**
     * when territory is changed filter list of customer
     * @param territory_id
     */
    territoryChanged(territory_id) {
        this.territory_id = territory_id;
        this.brickChanged(0);
    }

    /**
     * when headquarter is changed filter list of customer
     * @param headquarter_id
     */
    headquarterChanged(headquarter_id) {
        this.headquarter_id = headquarter_id;
        this.territoryChanged(0);
    }

    /**
     * when brick is changed filter list of customer
     * @param brick_id
     */
    brickChanged(brick_id) {
        this.brick_id = brick_id;
        this.fetch();
    }
}
