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
    visit_day: number = 0;
    visit_month: number;
    attendance: Attendance = new Attendance({});
    hq_headquarter_id: number;
    hq_area_id: number;
    hq_region_id: number;
    grade_id: number;
    visited_twice: number = 0;
    visited_thrice: number = 0;

    constructor(info: any) {
        super(info.id);
        this.visit_date = info.visit_date;
        this.comments = info.comments;
        this.latitude = info.latitude;
        this.longitude = info.longitude;
        this.customer_id = info.customer_id;

        if (info.created_by)
            this.created_by = parseInt(info.created_by);

        if (info.creator)
            this.creator = new User(info.creator);

        this.isSunday = info.isSunday;
        this.hq_area_id = info.hq_area_id;
        this.hq_region_id = info.hq_region_id;
        this.grade_id = info.grade_id;

        if (info.hq_headquarter_id)
            this.hq_headquarter_id = parseInt(info.hq_headquarter_id);

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

        if (info.visit_day)
            this.visit_day = parseInt(info.visit_day);
        this.visit_month = info.visit_month;

        if (info.visited_twice)
            this.visited_twice = parseInt(info.visited_twice);

        if (info.visited_thrice)
            this.visited_thrice = parseInt(info.visited_thrice);
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
