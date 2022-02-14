import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {VisitService} from '../../../../services/visit.service';
import {UserInputPos} from '../../../../models/visit/user_input_pos';
import {UserInputSummary} from '../../../../models/visit/user_input_summary';
import {ListComponent} from '../../../base/list.component';
import {AuthService} from '../../../../services/AuthService';
import {Headquarter} from '../../../../models/territory/headquarter';
import {Area} from '../../../../models/territory/area';

declare let jQuery: any;

@Component({
  templateUrl: 'input_inventory.component.html',
  styleUrls: ['input_inventory.component.less']
})
export class InputInventoryComponent extends ListComponent {

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;
  public input_pos: UserInputPos [];

  /**
   * region, territory, area, headquarter & brick id
   */
  public zone_id: number = 0;
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;
  public _headquarters: Headquarter[] = [];
  public _areas: Area[] = [];
  btn_loading: boolean = false;
  public department_id: number = 0;

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public visitService: VisitService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();

    this.month = moment().month();
    this.year = moment().year();

    if (this._service.user.role_id == 3) {
      this.region_id = this._service.user.hq_region_id;
      this.area_id = this._service.user.hq_area_id;
      this.headquarter_id = this._service.user.hq_headquarter_id;
    }

    if (this._service.user.role_id == 4) {
      this.region_id = this._service.user.hq_region_id;
      this.area_id = this._service.user.hq_area_id;
    }
    if (this._service.user.role_id == 5) {
      this.region_id = this._service.user.hq_region_id;
    }
    if (this._service.user.role_id == 6) {
      this.zone_id = this._service.user.hq_zone_id;
    }
    if (this._service.user.role_id == 7) {
      this.zone_id = 1;
    }


    if (this._service.user.departments.length > 0)
      this.department_id = 0;

    if (this._service.user.departments.length > 0 && this._service.user.role_id == 6)
      this.department_id = this._service.user.departments[0].pivot.department_id;
  }

  /**
   * load users for logged in user
   */
  fetch() {
    if ((this.month || this.month == 0) && this.year) {
      this.loading = true;
      this.visitService.fetchInputSummary(this.month + 1, this.year, this.headquarter_id).subscribe(
        response => {
          this.input_pos = response.input_pos;
          this.loading = false;
        }, err => {
          this.loading = false;
        }
      );
    }
  }

  /**
   * get areas
   */
  areas(data) {
    this._areas = data.areas;
  }

  /**
   * get headquarters
   */
  headquarters(data) {
    this._headquarters = data.headquarters;
  }

  /**
   * when region is changed filter list of customer
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.zone_id = zone_id;
    this.regionChanged(0);
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.region_id = region_id;
    this.areaChanged(0);
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.area_id = area_id;
    this.headquarterChanged(0);
  }


  /**
   * when headquarter is changed filter list of customer
   * @param headquarter_id
   */
  headquarterChanged(headquarter_id) {
    this.headquarter_id = headquarter_id;
  }

  /**
   * department Filter
   *
   * @param department_id
   */
  departmentChanged(department_id) {
    this.department_id = department_id;
    this.fetch();
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
  }
}
