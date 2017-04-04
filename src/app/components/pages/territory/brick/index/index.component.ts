import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../../base/list.component";
import {Brick} from "../../../../../models/territory/brick";
import {BrickService} from "../../../../../services/brick.service";
import {AuthService} from "../../../../../services/AuthService";
import {TerritoryService} from "../../../../../services/territory.service";


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
    public _region_id: number = 0;
    public _area_id: number = 0;
    public _territory_id: number = 0;
    public _headquarter_id: number = 0;

    /**
     * User Component Constructor
     */
    constructor(private territoryService: TerritoryService,private brickService: BrickService,
                public _router: Router,public _service: AuthService, public route: ActivatedRoute) {
        super(_service);
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.route.params.subscribe(params => {
            this._region_id = params['region_id'];
            this._area_id = params['area_id'];
            this._headquarter_id = params['headquarter_id'];
            this._territory_id = params['territory_id'];
            this.loading = true;
            this.territoryService.brick(this._territory_id).subscribe(
                response => {
                    this.loading = false;
                    this.bricks = response.bricks;
                },
                err => {
                    this.loading = false;
                }
            );
        });
    }

    /**
     * Download Excel For Bricks
     */
    excel_download(){
        this.route.params.subscribe(params => {
            this.loading = true;
            this.brickService.brick_excel_download().subscribe(
                response => {
                    this.loading = false;
                },
                err => {
                    this.loading = false;
                }
            );
        });
    }

    /**
     * Update Brick
     */
    updateBrick(id: number) {
        this._router.navigate(['/bricks/update/', id]);
    }
}
