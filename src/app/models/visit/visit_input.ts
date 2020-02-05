import {Model} from "../model";
import {UserInput} from '../V2/user/user_input';
import {UserInputAcknowledgement} from '../V2/user/user_input_acknowledgement';

export class VisitInput extends Model {

    name: string;
    value: number = 0;
    qty: number = 0;
    input_id: number = 0;
    quantity: UserInput;
    total_quantity: UserInputAcknowledgement;
    // for internal use only
    answer_id: number;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.answer_id = info.answer_id;

        if (info.value)
            this.value = parseInt(info.value);

      // customer Quantity
      if (info.quantity)
        this.quantity = new UserInput(info.quantity);

      // customer total Quantity
      if (info.total_quantity)
        this.total_quantity = new UserInputAcknowledgement(info.total_quantity);
    }

  get final_quantity() {
    return this.total_quantity ? +this.total_quantity.qty - (this.quantity && this.quantity.used_qty > 0 ? +this.quantity.used_qty : 0) : 0;
  }
}
