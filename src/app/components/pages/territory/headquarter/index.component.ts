import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Headquarter} from "../../../../models/territory/headquarter";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {TerritoryService} from "../../../../services/territory.service";
import {BrickService} from "../../../../services/brick.service";


@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class HeadquarterComponent extends ListComponent {

    /**
     * headquarters
     *
     * @type {{}}
     */
    public headquarters: Headquarter[] = [];

    /**
     * region id for filter
     */
    private _area_id: number;
    private _region_id: number;
    private _country_id: number;

    /**
     * User Component Constructor
     */
    constructor(private territoryService: TerritoryService, private brickService: BrickService,
                public _router: Router, public _service: AuthService, public route: ActivatedRoute) {
        super(_service);
    }

    /**
     * initialize component
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.route.params.subscribe(params => {
            this._region_id = params['region_id'];
            this._area_id = params['area_id'];
            this.loading = true;
            this.territoryService.headquarter(this._area_id, this._region_id).subscribe(
                response => {
                    this.loading = false;
                    this.headquarters = response.headquarters.map(function (headquarter) {
                        return new Headquarter(headquarter);
                    });
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
    excel_download() {
        this.brickService.brick_excel_download().subscribe(
            response => {
                let blob: Blob = response.blob();

                // Doing it this way allows you to name the file
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "Bricks.xls";
                link.click();
            },
            err => {
            }
        );
    }
}
