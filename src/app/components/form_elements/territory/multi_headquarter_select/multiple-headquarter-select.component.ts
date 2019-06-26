import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MultipleBaseSelectComponent} from "../../base-multiple-select.component";
import {TerritoryService} from "../../../../services/territory.service";
import {Headquarter} from "../../../../models/territory/headquarter";
import {AppConstants} from '../../../../app.constants';
import {Region} from '../../../../models/territory/region';

@Component({
    selector: 'multiple-headquarter-select',
    templateUrl: 'multiple-headquarter-select.component.html'
})
export class MultipleHeadquarterSelectComponent extends MultipleBaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Headquarters";

    /**
     * Select headquarters
     *
     * @type {Array}
     */
    @Input()
    headquarter_ids: Array<number> = [];

    /**
     * output selected events
     * @type {EventEmitter}
     */
    @Output()
    selectedHeadquarter = new EventEmitter();

    /**
     * country id for filter
     */
    _area_ids: Array<number> = [];
    @Input()
    set area_ids(area_ids) {
        this._area_ids = area_ids;
        this.fetchHeadquarter();
    };

    get area_ids() {
        return this._area_ids;
    }

  /**
   * Chart data
   */
  fetchHeadquarter = AppConstants.debounce(function () {
    const self = this;
    self.loading = true;
    self.service.headquarter(null, null, self.area_ids).subscribe(
      response => {
        self.loading = false;
        self.models = response.headquarters.map(function (t, key) {
          return new Headquarter(t);
        });
      },
      err => {
        self.loading = false;
      }
    );
  }, 1000, false);


  /**
     * Multiple headquarter select component
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
        let headquarters = this.headquarter_ids.map(a_id => a_id);
        if (headquarters.indexOf(id) < 0)
            headquarters.push(id);
        else
            headquarters.splice(headquarters.indexOf(id), 1);

        this.selectedHeadquarter.emit(headquarters);
    }
}
