import {Model} from '../../model';


export class UserInput extends Model {

  name: string;
  user_id: number = 0;
  qty: number = 0;
  used_qty: number = 0;
  input_id: number = 0;
  hq_headquarter_id: number = 0;
  hq_area_id: number = 0;
  hq_region_id: number = 0;
  hq_zone_id: number = 0;
  // for internal use only
  answer_id: number;

  constructor(info: any) {
    super(info.id);
    this.user_id = info.user_id;
    this.qty = info.quantity;
    this.used_qty = parseInt(info.used_qty);
    this.input_id = parseInt(info.input_id);
    this.hq_headquarter_id = info.hq_headquarter_id;
    this.hq_area_id = info.hq_area_id;
    this.hq_region_id = info.hq_region_id;
    this.hq_zone_id = info.hq_zone_id;

  }
}
