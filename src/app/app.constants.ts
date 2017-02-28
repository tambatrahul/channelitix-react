import * as moment from "moment";
import {Attendance} from "./models/attendance/attendance";
import {Role} from "./models/role";

export class AppConstants {
  static API_ENDPOINT: string = 'api/v1/';
  static EMAIL_REGEX: string = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

  // roles of user
  static roles: Array<Role> = [
    new Role({id: 6, name: 'COUNTRY_MNG', title: 'Country Managers'}),
    new Role({id: 5, name: 'REGION_MNG', title: 'Region Managers'}),
    new Role({id: 4, name: 'AREA_MNG', title: 'Area Managers'}),
    new Role({id: 3, name: 'TERRITORY_MNG', title: 'Territory Managers'}),
    new Role({id: 2, name: 'HQ_MNG', title: 'Medical Reps'})
  ];

  /**
   * get list of all child roles
   *
   * @param role_id
   */
  static getChildRoles(role_id) {
    return this.roles.filter(role => role.id < role_id)
  }

  /**
   * Prepare monthly Skeleton
   *
   * @param month
   * @param year
   */
  static prepareMonthSkeleton(month: number, year: number) {

    // get date
    let date = moment().year(year).month(month);

    // get start date and end date of month
    let start_day = date.startOf('month').date();
    let end_day = date.endOf('month').date();

    // prepare skeleton for all date
    let skeleton = new Array(end_day);
    for (start_day; start_day <= end_day; start_day++) {
      if (moment().month(month).year(year).date(start_day).day() == 0)
        skeleton[start_day - 1] = new Attendance({status: 'holiday'});
      else
        skeleton[start_day - 1] = {};
    }

    return skeleton;
  }
}
