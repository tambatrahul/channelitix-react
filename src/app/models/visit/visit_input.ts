import {Model} from "../model";
import {UserInput} from '../V2/user/user_input';
import {UserInputAcknowledgement} from '../V2/user/user_input_acknowledgement';

export class VisitInput extends Model {

  name: string;
  value: number = 0;
  qty: number = 0;
  input_id: number = 0;
  user_quantity: UserInput[];
  total_quantity: UserInputAcknowledgement[];
  // for internal use only
  answer_id: number;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.answer_id = info.answer_id;

    if (info.value)
      this.value = parseInt(info.value);

    // customer Quantity
    if (info.user_quantity)
      this.user_quantity = info.user_quantity.map(function (uq) {
        return new UserInput(uq);
      })

    // customer total Quantity
    if (info.total_quantity)
      this.total_quantity = info.total_quantity.map(function (tq) {
        return new UserInputAcknowledgement(tq);
      });
  }

  get final_quantity() {
    let total_qty: number = 0;
    let total_used: number = 0;
    this.total_quantity.map(function (totqty) {
      total_qty += +totqty.qty;
    });
    this.user_quantity.map(function (usedqty) {
      total_used += usedqty.used_qty;
    });

    return this.total_quantity ? +total_qty - (this.user_quantity && total_used > 0 ? +total_used : 0) : 0;
  }
}
