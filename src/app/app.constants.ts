import * as moment from "moment";

export class AppConstants {
  static API_ENDPOINT: string = 'api/v1/';
  static EMAIL_REGEX: string = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

  // roles of user
  static roles: Array<Object> = [
    {id: 6, name: 'COUNTRY_MNG'},
    {id: 5, name: 'REGION_MNG'},
    {id: 4, name: 'AREA_MNG'},
    {id: 3, name: 'TERRITORY_MNG'},
    {id: 2, name: 'HQ_MNG'},
    {id: 1, name: 'BRICK_MNG'}
  ];

  /**
   * Prepare monthly Skeleton
   *
   * @param month
   * @param year
   */
  static prepareMonthSkeleton(month: number, year: number) {

    // get date
    let date = moment().year(year).month(month - 1);

    // get start date and end date of month
    let start_day = date.startOf('month').date();
    let end_day = date.endOf('month').date();

    // prepare skeleton for all date
    let skeleton = new Array(end_day);
    for (start_day; start_day <= end_day; start_day++) {
      skeleton[start_day - 1] = {};
    }

    return skeleton;
  }
}
