import {Model} from "../model";

export class Brand extends Model {

  name: string;

  // for internal use only
  primary_sale: number = 0;
  secondary_sale: number = 0;
  month_target: number = 0;
  opening: number = 0;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
  }

  /**
   * get system primary plan
   *
   * @returns {number}
   */
  get system_primary_plan() {
    return this.secondary_sale * 1.5 - (this.opening - this.secondary_sale)
  }

  /**
   * get variance to target
   *
   * @returns {number}
   */
  get variance_to_target() {
    return this.month_target - this.primary_sale
  }
}
