import {Model} from "../model";
import {Grade} from "./grade";

export class CustomerType extends Model {

    name: string;
    grades: Grade[] = [];
    customer_count: number = 0;

    // for internal use
    brick_count: number = 0;
    v2_count: number = 0;
    v3_count: number = 0;
    hq_headquarter_id: number = 0;
    visit_count: number = 0;
    attendance_count: number = 0;
    order_count: number = 0;
    total_pob: number = 0;
    total_call_avg: number = 0;
    total_productive_avg: number = 0;

    constructor(info: any) {
        super(info.id);
        this.name = info.name;
        if (info.customer_count)
            this.customer_count = parseInt(info.customer_count);
        if (info.grades) {
            this.grades = info.grades.map(g => new Grade(g));
        } else {
            this.grades = [];
        }
    }

    get withNoAdded() {
        return "Bricks With No " + this.name;
    }

    /**
     * Customer count for type A customers
     * @returns {number}
     */
    get aCustomerCount() {
        let count = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('A') >= 0) {
                count += grade.customer_count;
            }
        });
        return count;
    }

    /**
     * Customer count for type A customers
     * @returns {number}
     */
    get bCustomerCount() {
        let count = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('B') >= 0) {
                count += grade.customer_count;
            }
        });
        return count;
    }

    /**
     * Visit count for type A customers
     * @returns {number}
     */
    get aVisitCount() {
        let count = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('A') >= 0) {
                count += grade.visit_count;
            }
        });
        return count;
    }

    /**
     * Visit count for type B customers
     *
     * @returns {number}
     */
    get bVisitCount() {
        let count = 0;
        this.grades.map(grade => {
            if (grade.name.indexOf('B') >= 0) {
                count += grade.visit_count;
            }
        });
        return count;
    }

    /**
     * Visit count for customers
     * @returns {number}
     */
    get visitCount() {
        let count = 0;
        this.grades.map(grade => {
            count += grade.visit_count;
        });
        return count;
    }

    /**
     * Customer count
     * @returns {number}
     */
    get customerCount() {
        let count = 0;
        this.grades.map(grade => {
            count += grade.customer_count;
        });
        return count;
    }

    /**
     * calculate percentage for visit for customer
     * @returns {number}
     */
    get percentageCount() {
        let visitCount = this.visitCount;
        let customerCount = this.customerCount;
        if (customerCount == 0)
            return 0;
        return (visitCount/customerCount) * 100
    }

    /**
     * calculate percentage for visit for customer
     * @returns {number}
     */
    get v2PercentageCount() {
        let customerCount = this.customerCount;
        if (this.v2_count == 0)
            return 0;
        return (this.v2_count/customerCount) * 100
    }

    /**
     * calculate percentage for visit for customer
     * @returns {number}
     */
    get v3PercentageCount() {
        let customerCount = this.customerCount;
        if (this.v3_count == 0)
            return 0;
        return (this.v3_count/customerCount) * 100
    }
}
