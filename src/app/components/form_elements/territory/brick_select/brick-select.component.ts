import {Component, Input} from '@angular/core';
import {BaseSelectComponent} from '../../base-select.component';
import {TerritoryService} from '../../../../services/territory.service';
import {AppConstants} from '../../../../app.constants';

@Component({
  selector: 'brick-select',
  templateUrl: 'brick-select.component.html'
})
export class BrickSelectComponent extends BaseSelectComponent {

  /**
   * title for select field
   */
  @Input()
  title: string = 'Select Brick';

  /**
   * First value text
   */
  @Input()
  first_value: string = 'All';

  /**
   * Territory id for filter
   */
  private _territory_id: number;

  /**
   * Chart data
   */
  fetchBrick = AppConstants.debounce(function () {
    const self = this;
    self.loading = true;
    self.territoryService.brick(self.territory_id).subscribe(
      response => {
        self.loading = false;
        self.models = response.bricks;
      },
      err => {
        self.loading = false;
      }
    );
  }, 1000, false);

  constructor(private territoryService: TerritoryService) {
    super();
  }

  /**
   * territory_id getter and setters
   *
   * @param territory_id
   */
  @Input()
  set territory_id(territory_id: number) {
    this._territory_id = territory_id;
    this.fetch();
  }

  get territory_id(): number {
    return this._territory_id;
  }

  /**
   * load bricks
   */
  fetch() {
    this.fetchBrick();
  }
}
