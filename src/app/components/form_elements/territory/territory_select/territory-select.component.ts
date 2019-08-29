import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {TerritoryService} from "../../../../services/territory.service";
import {AppConstants} from '../../../../app.constants';

@Component({
    selector: 'territory-select',
    templateUrl: 'territory-select.component.html'
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
   * Chart data
   */
  fetchTerritory = AppConstants.debounce(function () {
    const self = this;
    self.loading = true;
    self.territoryService.territory(self._headquarter_id).subscribe(
      response => {
        self.loading = false;
        self.models = response.territories;
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
        return this._headquarter_id;
    }

    /**
     * load territories
     */
    fetch() {
        this.fetchTerritory();
    }
}
