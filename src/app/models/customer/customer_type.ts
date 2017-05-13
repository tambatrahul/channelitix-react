import {Model} from "../model";
import {Grade} from "./grade";

export class CustomerType extends Model {

    name: string;
    grades: Grade[] = [];
    customer_count: number = 0;

    // for internal use
    brick_count: number = 0;

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
}
