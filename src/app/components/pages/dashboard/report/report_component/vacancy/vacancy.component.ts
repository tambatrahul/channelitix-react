import {Component, Input} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../../../base/list.component";
import {AuthService} from "../../../../../../services/AuthService";
import {ReportService} from "../../../../../../services/report.service";
import {Region} from "../../../../../../models/territory/region";
import {User} from "../../../../../../models/user/user";
declare let jQuery: any;

@Component({
  selector: '[vacancy-data-report]',
  templateUrl: 'vacancy.component.html',
  styleUrls: ['vacancy.component.less']
})
export class VacancyDataComponent extends ListComponent {

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
  }

  /**
   * year of sale
   */
  public _year: number;
  @Input()
  set year(year: number) {
    this._year = year;
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

          // get active users
          let users = response.users.map(user => new User(user));

          // get attritions_month & yearly
          let attritions_month = response.attritions_month.map(user => new User(user));
          let attritions_year = response.attritions_year.map(user => new User(user));

          // map customer count with regions
          this._regions.map(region => {
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
                this.total_attritions += user.user_count;
              }
            });

            // add attritions yearly
            attritions_year.map(user => {
              if (region.id == user.hq_region_id)
                region.attritions_year_count += user.user_count;
            });

            this.total_active += (region.headquarters_count - region.active_users_count);
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
