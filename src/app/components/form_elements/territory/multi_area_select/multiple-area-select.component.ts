import {Component, Input, Output, EventEmitter} from '@angular/core';
import {MultipleBaseSelectComponent} from '../../base-multiple-select.component';
import {TerritoryService} from '../../../../services/territory.service';
import {Region} from '../../../../models/territory/region';
import {AppConstants} from '../../../../app.constants';

@Component({
  selector: 'multiple-area-select',
  templateUrl: 'multiple-area-select.component.html'
})
export class MultipleAreaSelectComponent extends MultipleBaseSelectComponent {

  /**
   * title for select field
   */
  @Input()
  title: string = 'Select Areas';

  /**
   * Select areas
   *
   * @type {Array}
   */
  @Input()
  area_ids: Array<number> = [];

  /**
   * output selected events
   * @type {EventEmitter}
   */
  @Output()
  selectedArea = new EventEmitter();

  /**
   * country id for filter
   */
  _region_ids: Array<number> = [];
  @Input()
  set region_ids(region_ids) {
    this._region_ids = region_ids;
    this.fetchArea();
  };

  get region_ids() {
    return this._region_ids;
  }


  /**
   * Chart data
   */
  fetchArea = AppConstants.debounce(function () {
    const self = this;
    self.loading = true;
    self.service.area(null, self._region_ids).subscribe(
      response => {
        self.loading = false;
        self.models = response.areas.map(function (t, key) {
          return new Region(t);
        });
      },
      err => {
        self.loading = false;
      }
    );
  }, 1000, false);

  /**
   * Multiple area select component
   * @param service
   */
  constructor(private service: TerritoryService) {
    super();
  }

  /**
   * load headquarters
   */
  fetch() {

  }

  /**
   * when region is selected
   * @param id
   */
  selectValue(id: number) {
    let areas = this.area_ids.map(a_id => a_id);
    if (areas.indexOf(id) < 0) {
      areas.push(id);
    } else {
      areas.splice(areas.indexOf(id), 1);
    }

    this.selectedArea.emit(areas);
  }
}
