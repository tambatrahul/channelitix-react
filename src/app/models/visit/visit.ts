import {Model} from "../model";
import {User} from "../user/user";
import {VisitInput} from "./visit_input";
import {Customer} from "../customer/customer";

export class Visit extends Model {

    visit_date: string;
    comments: string;
    latitude: string;
    longitude: string;
    customer_id: number;
    created_by: number;
    creator: User;
    inputs: VisitInput[];
    customer: Customer;

    // for internal use only
    isSunday: boolean = false;
    visit_count: number = 0;
    visit_day: number;

    constructor(info: any) {
        super(info.id);
        this.visit_date = info.visit_date;
        this.comments = info.comments;
        this.latitude = info.latitude;
        this.longitude = info.longitude;
        this.customer_id = info.customer_id;
        this.created_by = info.created_by;
        this.creator = info.creator;
        this.isSunday = info.isSunday;

        if (info.customer)
            this.customer = new Customer(info.customer);

        if (info.inputs)
            this.inputs = info.inputs.map(function (input) {
                return new VisitInput(input);
            });

        // internal
        if (typeof info.visit_count == 'string')
            this.visit_count = parseInt(info.visit_count);
        else if (info.visit_count)
            this.visit_count = info.visit_count;
        else
            this.visit_count = 0;

        this.visit_day = info.visit_day;
    }

    /**
     * get input totals
     *
     * @returns {number}
     */
    get total_inputs() {
        let total:number = 0;
        this.inputs.map(function (input) {
            total += input.value;
        });
        return total;
    }
}
