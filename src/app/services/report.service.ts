import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";
import {BaseService} from "./base.service";
import {Result} from "../models/result";

@Injectable()
export class ReportService extends BaseService {

    /**
     * model url
     *
     * @type {string}
     */
    protected modelUrl: string = 'reports';

    /**
     * Report Service constructor
     *
     * @param http
     * @param _router
     * @param _authService
     */
    constructor(protected http: Http, protected _router: Router, protected _authService: AuthService) {
        super(http, _router, _authService);
    }

    /**
     * get all count for dashboard
     *
     * @returns {Observable<Result>}
     */
    counts(from_date, to_date, year, region_ids?: Array<number>,
           area_ids?: Array<number>, headquarter_ids?: Array<number>): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('from_date', String(from_date ? from_date : ''));
        params.set('to_date', String(to_date ? to_date : ''));
        params.set('year', String(year > 0 ? year : ''));

        // prepare get params
        if (headquarter_ids && headquarter_ids.length > 0) {
            headquarter_ids.map(function (h_id) {
                params.append('headquarter_id[]', String(h_id));
            });
        }
        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }

        // make server call
        return this.get(this.getBaseUrl() + '/counts', new RequestOptions({search: params}));
    }

    /**
     * get all summary for user
     *
     * @returns {Observable<Result>}
     */
    summaryForUser(month: number, year: number, user_id: number): Observable<Result> {
        // prepare url
        let url = this.getBaseUrl() + '/summary/' + month + '/' + year + '/' + user_id;

        // make server call
        return this.get(url);
    }

    /**
     * get order and visit trends
     *
     * @returns {Observable<Result>}
     */
    visit_order_trend(from_date, to_date, year,
                      region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>,
                      product_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('from_date', String(from_date ? from_date : ''));
        params.set('to_date', String(to_date ? to_date : ''));
        params.set('year', String(year > 0 ? year : ''));
        params.set('product_id', String(product_id > 0 ? product_id : ''));

        if (headquarter_ids && headquarter_ids.length > 0) {
            headquarter_ids.map(function (h_id) {
                params.append('headquarter_id[]', String(h_id));
            });
        }
        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }

        // prepare url
        let url = this.getBaseUrl() + '/visit_order_trend';

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * get details till month
     * @returns {Observable<Result>}
     */
    till_month_chart(region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>,
                     month?: number, year?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        if (headquarter_ids && headquarter_ids.length > 0) {
            headquarter_ids.map(function (h_id) {
                params.append('headquarter_id[]', String(h_id));
            });
        }
        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }
        if (month)
            params.append('month', String(month));
        if (year)
            params.append('year', String(year));

        // prepare url
        let url = this.getBaseUrl() + '/sap/till_month';

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * get performance for year
     * @returns {Observable<Result>}
     */
    performance(year: number, region_ids?: Array<number>,
                area_ids?: Array<number>, headquarter_ids?: Array<number>): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        if (headquarter_ids && headquarter_ids.length > 0) {
            headquarter_ids.map(function (h_id) {
                params.append('headquarter_id[]', String(h_id));
            });
        }
        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }

        // prepare url
        let url = this.getBaseUrl() + '/performance/' + year;

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * get all product wise sale for dashboard
     *
     * @returns {Observable<Result>}
     */
    product_wise_sale(month, year, region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        if (headquarter_ids && headquarter_ids.length > 0) {
            headquarter_ids.map(function (h_id) {
                params.append('headquarter_id[]', String(h_id));
            });
        }
        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }

        // make server call
        return this.get(this.getBaseUrl() + '/target_performance/' + month + '/' + year, new RequestOptions({search: params}));
    }

    /**
     * get all product wise sale for dashboard
     *
     * @returns {Observable<Result>}
     */
    product_wise_sale_for_sk(month, year, region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        if (headquarter_ids && headquarter_ids.length > 0) {
            headquarter_ids.map(function (h_id) {
                params.append('headquarter_id[]', String(h_id));
            });
        }
        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }

        // make server call
        return this.get(this.getBaseUrl() + '/target_performance_productwise/' + month + '/' + year, new RequestOptions({search: params}));
    }

    /**
     * brick wise customers
     */
    brick_wise_customers() {
        return this.get(this.getBaseUrl() + '/brick_wise_customers');
    }

    /**
     * brick wise customers
     */
    hq_wise_visit_counts(month: number, year: number) {
        return this.get(this.getBaseUrl() + '/hq_wise_visits/' + month + "/" + year);
    }

    /**
     * brick wise customers
     */
    stockist_wise_pob(month: number, year: number, region_id?: number, area_id?: number, headquarter_id?: number) {

        // prepare get params
        let params = new URLSearchParams();
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        return this.get(this.getBaseUrl() + '/stockist_report/' + month + "/" + year, new RequestOptions({search: params}));
    }

    /**
     * brick wise customers
     */
    synergy_stockist_wise_pob(month: number, year: number, region_id?: number, area_id?: number, headquarter_id?: number) {

        // prepare get params
        let params = new URLSearchParams();
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        return this.get(this.getBaseUrl() + '/synergy_stockist_report/' + month + "/" + year, new RequestOptions({search: params}));
    }

    /**
     * executive summary report api
     */
    executive_summary(month: number, year: number) {
        return this.get(this.getBaseUrl() + '/executive_summary/' + month + "/" + year, new RequestOptions({}));
    }

    /**
     * Monthly Stockist wise sale report api
     */
    sap_stockist_wise_monthly(month: number, year: number, region_id?: number, area_id?: number, headquarter_id?: number) {

        // prepare get params
        let params = new URLSearchParams();
        if (month)
            params.append('month', String(month));
        if (year)
            params.append('year', String(year));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        return this.get(this.getBaseUrl() + '/stockist_wise_sap_monthly', new RequestOptions({search: params}));
    }

    /**
     * Monthly Stockist wise sale report api
     */
    sap_stockist_wise_yearly(month: number, year: number, region_id?: number, area_id?: number, headquarter_id?: number) {

        // prepare get params
        let params = new URLSearchParams();
        if (month)
            params.append('month', String(month));
        if (year)
            params.append('year', String(year));
        params.set('region_id', String(region_id > 0 ? region_id : ''));
        params.set('area_id', String(area_id > 0 ? area_id : ''));
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        return this.get(this.getBaseUrl() + '/stockist_wise_sap_yearly', new RequestOptions({search: params}));
    }

    /**
     * get order and visit trends
     *
     * @returns {Observable<Result>}
     */
    productivity_analysis(from_date, to_date): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        params.set('from_date', String(from_date ? from_date : ''));
        params.set('to_date', String(to_date ? to_date : ''));

        // prepare url
        let url = this.getBaseUrl() + '/productivity_analysis';

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * Customer Data Dashboard Service
     */
    customer_data() {
        return this.get(this.getBaseUrl() + '/dashboard/customer_data', new RequestOptions({}));
    }

    /**
     * Sales API
     *
     * @param month
     * @param year
     * @returns {Observable<Result>}
     */
    sales(month: number, year: number) {
        return this.get(this.getBaseUrl() + '/dashboard/sales/' + month + "/" + year);
    }

    /**
     * Yearly Sales
     *
     * @param year
     * @returns {Observable<Result>}
     */
    sales_yearly(year: number) {
        return this.get(this.getBaseUrl() + '/dashboard/sales_yearly/' + year);
    }

    /**
     * POB Sales
     *
     * @returns {Observable<Result>}
     */
    pob(month: number, year: number) {
        return this.get(this.getBaseUrl() + '/dashboard/pob/' + month + '/' + year);
    }

    /**
     *  FF Effort Metrics Sales
     *
     * @returns {Observable<Result>}
     */
    ff_effort_metrics(month: number, year: number) {
        return this.get(this.getBaseUrl() + '/dashboard/ff_effort_metrics/' + month + '/' + year);
    }

    /**
     * Dashboard people route
     *
     * @param month
     * @param year
     * @returns {Observable<Result>}
     */
    people(month: number, year: number) {
        return this.get(this.getBaseUrl() + '/dashboard/people/' + month + "/" + year, new RequestOptions({}));
    }

    /**
     * Customer Brick Coverage
     *
     * @param month
     * @param year
     * @param headquarter_id
     * @returns {Observable<Result>}
     */
    brick_coverage(year: number, headquarter_id: number) {

        // prepare get params
        let params = new URLSearchParams();
        params.set('headquarter_id', String(headquarter_id > 0 ? headquarter_id : ''));

        return this.get(this.getBaseUrl() + '/brick_coverage_report/' + year, new RequestOptions({search: params}));
    }

    /**
     * get details till month
     * @returns {Observable<Result>}
     */
    stockist_sales_monthly(region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>,
                     month?: number, year?: number, customer_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        if (headquarter_ids && headquarter_ids.length > 0) {
            headquarter_ids.map(function (h_id) {
                params.append('headquarter_id[]', String(h_id));
            });
        }
        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }
        if (month)
            params.append('month', String(month));
        if (year)
            params.append('year', String(year));

        if(customer_id && customer_id > 0)
            params.append('customer_id', String(customer_id));

        // prepare url
        let url = this.getBaseUrl() + '/graph/stockist_sales/monthly';

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }

    /**
     * get details till month
     * @returns {Observable<Result>}
     */
    stockist_sales_yearly(region_ids?: Array<number>, area_ids?: Array<number>, headquarter_ids?: Array<number>,
                           month?: number, year?: number, customer_id?: number): Observable<Result> {

        // prepare get params
        let params = new URLSearchParams();
        if (headquarter_ids && headquarter_ids.length > 0) {
            headquarter_ids.map(function (h_id) {
                params.append('headquarter_id[]', String(h_id));
            });
        }
        if (area_ids && area_ids.length > 0) {
            area_ids.map(function (area_id) {
                params.append('area_id[]', String(area_id));
            });
        }
        if (region_ids && region_ids.length > 0) {
            region_ids.map(function (region_id) {
                params.append('region_id[]', String(region_id));
            });
        }
        if (month)
            params.append('month', String(month));
        if (year)
            params.append('year', String(year));

        if(customer_id && customer_id > 0)
            params.append('customer_id', String(customer_id));

        // prepare url
        let url = this.getBaseUrl() + '/graph/stockist_sales/yearly';

        // make server call
        return this.get(url, new RequestOptions({search: params}));
    }
}
