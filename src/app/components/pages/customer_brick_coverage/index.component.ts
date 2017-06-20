import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Region} from "../../../models/territory/region";
import {ListComponent} from "../../base/list.component";
import {AuthService} from "../../../services/AuthService";
import * as moment from "moment";
declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class CustomerBrickCoverageComponent extends ListComponent {

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * regions
   *
   * @type {{}}
   */
  public regions: Region[] = [];

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
    this.month = moment().month();
    this.year = moment().year();
  }

  /**
   * load users for logged in user
   */
  fetch() {

  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.fetch();
  }

  /**
   * set regions
   *
   * @param regions
   */
  setRegions(regions: Region[]) {
    this.regions = regions;
  }
}
