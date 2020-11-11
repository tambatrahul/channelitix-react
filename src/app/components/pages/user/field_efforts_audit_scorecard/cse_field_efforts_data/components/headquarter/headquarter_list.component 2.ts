import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../../../../base/base_auth.component";
import {Headquarter} from "../../../../../../../models/territory/headquarter";
import {TerritoryService} from "../../../../../../../services/territory.service";
import {AuthService} from "../../../../../../../services/AuthService";

declare let jQuery: any;

@Component({
  selector: 'headquarter-list',
  templateUrl: 'headquarter_list.component.html',
  styleUrls: ['headquarter_list.component.less']
})
export class HeadquarterListComponent extends BaseAuthComponent {


  _headquarter_ids = [];
  _hqs = [];

  @Input()
  set headquarter_ids(headquarter_ids) {
    this._hqs = [];
    this._headquarter_ids = [];
    this._hqs = headquarter_ids;
    headquarter_ids.map(hq_id => {
      this._headquarter_ids.push(hq_id.headquarter_id);
    });
    this.fetch();
  }

  /**
   * visits
   *
   * @type {{}}
   */
  public headquarters: Headquarter[] = [];

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
    this.headquarters = [];
    this.loading = true;
    if (this._headquarter_ids && this._headquarter_ids.length > 0) {
      this.territoryService.headquarter(null, null, null, this._headquarter_ids)
        .subscribe(response => {
          this.headquarters = response.headquarters.map(hq => new Headquarter(hq));
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
    this.headquarters.map(headquarter => {
      this._hqs.map(_hq => {
        if (_hq.headquarter_id == headquarter.id)
          headquarter.norm = _hq.count;
      });
    });
  }
}
