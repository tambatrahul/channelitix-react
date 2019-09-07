import {Component, Input} from '@angular/core';
import {TerritoryService} from '../../../../services/territory.service';
import {Region} from '../../../../models/territory/region';
import {BaseSelectComponent} from '../../base-select.component';

@Component({
  selector: 'region-select',
  templateUrl: 'region-select.component.html'
})
export class RegionSelectComponent extends BaseSelectComponent {

  /**
   * title for select field
   */
  @Input()
  title: string = 'Select Region';

  /**
   * First value text
   */
  @Input()
  first_value: string = 'All';

  /**
   * Country id for filter
   */
  _zone_id: number;

  /**
   * regions list
   *
   * @type {Array}
   */
  regions: Region[] = [];

  constructor(private territoryService: TerritoryService) {
    super();
  }

  /**
   * zone_id getter and setters
   *
   * @param zone_id
   */
  @Input()
  set zone_id(zone_id: number) {
    this._zone_id = zone_id;
    this.fetch();
  }

  get zone_id(): number {
    return this._zone_id;
  }

  /**
   * load regions
   */
  fetch() {
    this.loading = true;
    this.territoryService.regions(null, null, this._zone_id).subscribe(
      response => {
        this.loading = false;
        this.regions = response.regions;
      },
      err => {
        this.loading = false;
      }
    );
  }
}
