import {Component, Input, Output, EventEmitter} from "@angular/core";
import {TerritoryService} from "../../../services/territory.service";
import {Brick} from "../../../models/territory/brick";
import {BaseService} from "../../../services/base.service";
import {BaseSelectComponent} from "./base-select.component";

@Component({
  selector: 'brick-select',
  templateUrl: '../../../templates/page/section/brick-select.component.html'
})
export class BrickSelectComponent extends BaseSelectComponent {

  /**
   * title for select field
   */
  @Input()
  title: string = "Select Brick";

  /**
   * First value text
   */
  @Input()
  first_value: string = "All";

  /**
   * headquarter id for filter
   */
  private _territory_id: number;

  /**
   * brick list
   *
   * @type {Array}
   */
  private bricks: Brick[] = [];

  constructor(private territoryService: TerritoryService) {
    super();
  }

  /**
   * brick_id getter and setters
   *
   * @param territory_id
   */
  @Input()
  set territory_id(territory_id: number) {
    this._territory_id = territory_id;
    this.value = 0;
    this.fetch();
  }

  get territory_id(): number {
    return this._territory_id;
  }

  /**
   * load bricks
   */
  fetch() {
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
  }
}
