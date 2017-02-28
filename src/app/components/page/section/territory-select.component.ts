import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Territory} from "../../../models/territory/territory";
import {TerritoryService} from "../../../services/territory.service";
import {BaseSelectComponent} from "./base-select.component";

@Component({
  selector: 'territory-select',
  templateUrl: '../../../templates/page/section/territory-select.component.html'
})
export class TerritorySelectComponent extends BaseSelectComponent {

  /**
   * title for select field
   */
  @Input()
  title: string = "Select Territory";

  /**
   * First value text
   */
  @Input()
  first_value: string = "All";

  /**
   * Area id for filter
   */
  private _area_id: number;

  /**
   * territories list
   *
   * @type {Array}
   */
  private territories: Territory[] = [];

  constructor(private territoryService: TerritoryService) {
    super();
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
}
