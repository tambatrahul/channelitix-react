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
     * User Component Constructor
     */
    constructor(private brickService: BrickService, public _router: Router, public _service: AuthService) {
        super(_service);
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
}
