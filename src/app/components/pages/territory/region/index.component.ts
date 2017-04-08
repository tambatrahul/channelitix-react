import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {Region} from "../../../../models/territory/region";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {TerritoryService} from "../../../../services/territory.service";
import {BrickService} from "../../../../services/brick.service";


@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class RegionComponent extends ListComponent {

    /**
     * regions
     *
     * @type {{}}
     */
    public regions: Region[] = [];

    /**
     * User Component Constructor
     */
    constructor(private territoryService: TerritoryService, private brickService: BrickService,
                public _router: Router, public _service: AuthService) {
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
        this.loading = true;
        this.territoryService.regions().subscribe(
            response => {
                this.loading = false;
                this.regions = response.regions.map(function (region) {
                    return new Region(region);
                });
            },
            err => {
                this.loading = false;
            }
        );
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
