import {Component, Input} from "@angular/core";
import {Brick} from "../../../../../../../models/territory/brick";
import {BaseAuthComponent} from "../../../../../../base/base_auth.component";
import {TerritoryService} from "../../../../../../../services/territory.service";
import {AuthService} from "../../../../../../../services/AuthService";

declare let jQuery: any;

@Component({
  selector: 'brick-list',
  templateUrl: 'brick_list.component.html',
  styleUrls: ['brick_list.component.less']
})
export class BrickListComponent extends BaseAuthComponent {


  _brick_ids = [];
  _bricks = [];

  @Input()
  set brick_ids(brick_ids) {
    this._bricks = [];
    this._brick_ids = [];
    this._bricks = brick_ids;
    brick_ids.map(brick_id => {
      this._brick_ids.push(brick_id.brick_id);
    });
    this.fetch();
  }

  /**
   * visits
   *
   * @type {{}}
   */
  public bricks: Brick[] = [];

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
    this.bricks = [];
    this.loading = true;
    if (this._brick_ids && this._brick_ids.length > 0) {
      this.territoryService.brick(null, null, null, this._brick_ids)
        .subscribe(response => {
          this.bricks = response.bricks.map(brick => new Brick(brick));
          this.prepareData();
          this.loading = false;
        }, err => {
          this.loading = false;
        });
    }
  }

  /**
   * Prepare Brick Data
   */
  prepareData() {
    this.bricks.map(brick => {
      this._bricks.map(_brick => {
        if (_brick.brick_id == brick.id)
          brick.norm = _brick.count;
      });
    });
  }
}
