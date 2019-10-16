import {Model} from '../model';

export class UserTerritoryCustomer extends Model {


  status: string;
  user_id: number;
  customer_id: number;
  hq_headquarter_id: number;
  hq_area_id: number;
  hq_region_id: number;
  hq_zone_id: number;


  constructor(info: any) {
    super(info.id);
    this.status = info.status;
    this.user_id = info.user_id;
    this.customer_id = info.customer_id;
    this.hq_headquarter_id = info.hq_headquarter_id;
    this.hq_area_id = info.hq_area_id;
    this.hq_region_id = info.hq_region_id;
    this.hq_zone_id = info.hq_zone_id;
  }
}
