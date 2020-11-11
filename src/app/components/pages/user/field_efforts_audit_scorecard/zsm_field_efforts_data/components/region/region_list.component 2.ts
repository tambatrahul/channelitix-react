import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../../../../base/base_auth.component";
import {Headquarter} from "../../../../../../../models/territory/headquarter";
import {TerritoryService} from "../../../../../../../services/territory.service";
import {AuthService} from "../../../../../../../services/AuthService";
import {Region} from "../../../../../../../models/territory/region";

declare let jQuery: any;

@Component({
  selector: 'region-list',
  templateUrl: 'region_list.component.html',
  styleUrls: ['region_list.component.less']
})
export class RegionListComponent extends BaseAuthComponent {


  _region_ids = [];
  _regions = [];

  @Input()
  set region_ids(region_ids) {
    this._regions = [];
    this._region_ids = [];
    this._regions = region_ids;
    region_ids.map(region_id => {
      this._region_ids.push(region_id.region_id);
    });
    this.fetch();
  }

  /**
   * visits
   *
   * @type {{}}
   */
  public regions: Region[] = [];

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
    this.regions = [];
    this.loading = true;
    if (this._region_ids && this._region_ids.length > 0) {
      this.territoryService.regions(null,  this._region_ids)
        .subscribe(response => {
          this.regions = response.regions.map(region => new Region(region));
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
    this.regions.map(region => {
      this._regions.map(_region => {
        if (_region.region_id == region.id)
          region.norm = _region.count;
      });
    });
  }
}
