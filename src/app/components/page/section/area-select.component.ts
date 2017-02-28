import {Component, Input, Output, EventEmitter} from "@angular/core";
import {TerritoryService} from "../../../services/territory.service";
import {Area} from "../../../models/territory/area";
import {BaseSelectComponent} from "./base-select.component";

@Component({
  selector: 'area-select',
  templateUrl: '../../../templates/page/section/area-select.component.html'
})
export class AreaSelectComponent extends BaseSelectComponent {

  /**
   * title for select field
   */
  @Input()
  title: string = "Select Area";

  /**
   * Region id for filter
   */
  private _region_id: number;

  /**
   * areas list
   *
   * @type {Array}
   */
  private areas: Area[] = [];

  constructor(private territoryService: TerritoryService) {
    super();
  }

  /**
   * region_id getter and setters
   *
   * @param region_id
   */
  @Input()
  set region_id(region_id: number) {
    this._region_id = region_id;
    this.fetch();
  }

  get region_id(): number {
    return this._region_id;
  }

  /**
   * load areas
   */
  fetch() {
    this.loading = true;
    this.territoryService.area(this._region_id).subscribe(
      response => {
        this.loading = false;
        this.areas = response.areas;
      },
      err => {
        this.loading = false;
      }
    );
  }
}
