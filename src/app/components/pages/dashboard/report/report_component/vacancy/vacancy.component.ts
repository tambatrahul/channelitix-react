import {Component, Input} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../../../base/list.component";
import {AuthService} from "../../../../../../services/AuthService";
import {ReportService} from "../../../../../../services/report.service";
import {Region} from "../../../../../../models/territory/region";
import {User} from "../../../../../../models/user/user";
import * as moment from "moment";
declare let jQuery: any;


@Component({
  selector: '[vacancy-data-report]',
  templateUrl: 'vacancy.component.html',
  styleUrls: ['vacancy.component.less']
})
export class VacancyDataComponent extends ListComponent {

  public _month_str: string = '';
  public _regions: Region[];
  @Input()
  set regions(regions) {
    this._regions = regions;
    this.fetch();
  }

  show_data: boolean = false;

  /**
   * month of sales
   */
  public _month: number;
  @Input()
  set month(month: number) {
    this._month = month;
    this._month_str = moment().month(this._month).format('MMM');
    this.fetch();
  }

  /**
   * year of sale
   */
  public _year: number;
  @Input()
  set year(year: number) {
    this._year = year;
    this.fetch();
  }

  total_active: number = 0;
  total_attritions: number = 0;
  total_attritions_yearly: number = 0;

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * load users for logged in user
   */
  fetch() {
    if (this._regions && this._regions.length > 0) {
      this.loading = true;
      this.reportService.people(this._month + 1, this._year).subscribe(
        response => {
          this.total_active = 0;
          this.total_attritions = 0;
          this.total_attritions_yearly = 0;

          // get active users
          let users = response.users.map(user => new User(user));

          // get attritions_month & yearly
          let attritions_month = response.attritions_month.map(user => new User(user));
          let attritions_year = response.attritions_year.map(user => new User(user));

          // map customer count with regions
          this._regions.map(region => {
            region.active_users_count = 0;
            region.attritions_month_count = 0;
            region.attritions_year_count = 0;
            // adding active users
            users.map(user => {
              if (region.id == user.hq_region_id) {
                region.active_users_count += user.user_count;
              }
            });

            // add attritions monthly
            attritions_month.map(user => {
              if (region.id == user.hq_region_id) {
                region.attritions_month_count += user.user_count;
              }
            });

            // add attritions yearly
            attritions_year.map(user => {
              if (region.id == user.hq_region_id)
                region.attritions_year_count += user.user_count;
            });

            this.total_active += (region.totalHq - region.active_users_count);
            this.total_attritions += region.attritions_month_count;
            this.total_attritions_yearly += region.attritions_year_count;
          });

          this.loading = false;
        }, error => {
          this.loading = false;
        }
      );
    }
  }
}
