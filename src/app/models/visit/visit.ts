import {Model} from "../model";
import {User} from "../user/user";
import {VisitInput} from "./visit_input";
import {Customer} from "../customer/customer";
import {InputAnswer} from "./input_answer";
import {Attendance} from "../attendance/attendance";

export class Visit extends Model {

    visit_date: string;
    comments: string;
    latitude: string;
    longitude: string;
    customer_id: number;
    created_by: number;
    creator: User;
    inputs: VisitInput[];
    input_answers: InputAnswer[];
    customer: Customer;

    // for internal use only
    isSunday: boolean = false;
    visit_count: number = 0;
    visit_day: number;
    visit_month: number;
    attendance: Attendance = new Attendance({});

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

        // set customer
        if (info.customer)
            this.customer = new Customer(info.customer);

        // inputs
        if (info.inputs)
            this.inputs = info.inputs.map(function (input) {
                return new VisitInput(input);
            });

        // input answers
        if (info.input_answers)
            this.input_answers = info.input_answers.map(function (input) {
                return new InputAnswer(input);
            });

        // internal
        if (info.visit_count)
            this.visit_count = parseInt(info.visit_count);
        else
            this.visit_count = 0;

        this.visit_day = info.visit_day;
        this.visit_month = info.visit_month;
    }

    /**
     * get input totals
     *
     * @returns {number}
     */
    get total_inputs() {
        let total: number = 0;
        this.inputs.map(function (input) {
            total += input.value;
        });
        return total;
    }
}
