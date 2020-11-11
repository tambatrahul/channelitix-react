import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../../../../base/base_auth.component";
import {Headquarter} from "../../../../../../../models/territory/headquarter";
import {TerritoryService} from "../../../../../../../services/territory.service";
import {AuthService} from "../../../../../../../services/AuthService";
import {Area} from "../../../../../../../models/territory/area";

declare let jQuery: any;

@Component({
  selector: 'area-list',
  templateUrl: 'area_list.component.html',
  styleUrls: ['area_list.component.less']
})
export class AreaListComponent extends BaseAuthComponent {


  _area_ids = [];
  _areas = [];

  @Input()
  set area_ids(area_ids) {
    this._areas = [];
    this._area_ids = [];
    this._areas = area_ids;
    area_ids.map(area_id => {
      this._area_ids.push(area_id.area_id);
    });
    this.fetch();
  }

  /**
   * visits
   *
   * @type {{}}
   */
  public areas: Area[] = [];

  _title = '';
  @Input()
  set title(title) {
    this._title = title;
  }

  /**
   * Visit
   *
   * @param territoryService
   * @param _service
   */
  constructor(private territoryService: TerritoryService, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Fetch Headquarter List
   */
  fetch() {
    this.areas = [];
    this.loading = true;
    if (this._area_ids && this._area_ids.length > 0) {
      this.territoryService.area(null, null, this._area_ids)
        .subscribe(response => {
          this.areas = response.areas.map(area => new Area(area));
          this.prepareData();
          this.loading = false;
        }, err => {
          this.loading = false;
        });
    }
  }

  /**
   * Prepare Headquarter Data
   */
  prepareData() {
    this.areas.map(area => {
      this._areas.map(_area => {
        if (_area.area_id == area.id)
          area.norm = _area.count;
      });
    });
  }
}
