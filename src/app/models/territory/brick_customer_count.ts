import {Model} from "../model";
import {CustomerType} from "../customer/customer_type";
import {Country} from "./country";
import {Area} from "./area";

export class BrickCustomerCount extends Model {

  hq_region_id: number;
  hq_headquarter_id: number;
  total_bricks: number;
  hub_physician_count: number;

  constructor(info: any) {
    super(info.id);

    // region id
    if (info.hq_region_id)
      this.hq_region_id = info.hq_region_id;

    // headquarter id
    if (info.hq_headquarter_id)
      this.hq_headquarter_id = info.hq_headquarter_id;

    // total bricks
    if (info.total_bricks)
      this.total_bricks = parseInt(info.total_bricks);

    // total hub physician count
    if (info.hub_physician_count)
      this.hub_physician_count = parseInt(info.hub_physician_count);
  }

  get percent() {
    return (this.hub_physician_count / this.total_bricks) * 100;
  }

  get isPercent70() {
    return this.percent >= 70;
  }
}
