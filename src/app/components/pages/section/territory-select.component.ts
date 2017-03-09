import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Territory} from "../../../models/territory/territory";
import {TerritoryService} from "../../../services/territory.service";
import {BaseSelectComponent} from "./base-select.component";

@Component({
  selector: 'territory-select',
  templateUrl: '../../../templates/pages/section/territory-select.component.html'
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
   * Headquarter id for filter
   */
  private _headquarter_id: number;

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
   * headquarter_id getter and setters
   *
   * @param headquarter_id
   */
  @Input()
  set headquarter_id(headquarter_id: number) {
    this._headquarter_id = headquarter_id;
    this.fetch();
  }

  get headquarter_id(): number {
    return this.headquarter_id;
  }

  /**
   * load territories
   */
  fetch() {
    this.loading = true;
    this.territoryService.territory(this._headquarter_id).subscribe(
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
