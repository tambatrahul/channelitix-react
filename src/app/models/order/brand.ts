import {Model} from "../model";

export class Brand extends Model {

  name: string;
  icon_name: string;
  chl_name: string;

  // for internal use only
  primary_sale: number = 0;
  secondary_sale: number = 0;
  month_target: number = 0;
  opening: number = 0;
  target: number = 0;
  department_id: number = 0;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.department_id = info.department_id;
    if (info.department_id == 1) {
      this.icon_name = info.name;
    }
    if (info.department_id == 2) {
      this.chl_name = info.name;
    }
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

  /**
   * get the pob target
   *
   * @returns {number}
   */
  get pob_target() {
    let variance_target = this.variance_to_target;
    if (this.month_target * 0.5 > variance_target)
      return this.month_target * 0.5;

    return variance_target;
  }

  /**
   * On brand target
   *
   * @returns {boolean}
   */
  get onTarget() {
    if (this.target > 0)
      return this.primary_sale >= this.target;
    else
      return false;
  }
}
