import {Component, ViewChild, ElementRef, Input} from "@angular/core";
import * as moment from "moment";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {PrimarySaleService} from "../../../../services/primary_sale.service";
import {InvoiceDetail} from "../../../../models/SAP/invoice_detail";
import {PrimarySale} from "../../../../models/sale/primary_sale";
declare let jQuery: any;

@Component({
    selector: 'invoices',
    templateUrl: 'invoices.component.html',
    styleUrls: ['invoices.component.less']
})
export class InvoicesComponent extends ListComponent {

    /**
     * pages number for customer and total customers
     *
     * @type {number}
     */
    public page: number = 1;
    public total: number = 10;
    public btn_loading: boolean = false;

    upload_excel;

    /**
     * loading identifier
     */
    @ViewChild('invoice_detail')
    invoice_detail: ElementRef;

  /**
   * region, area, headquarter
   */
  _zone_id: number = 0;
  @Input()
  set zone_id(zone_id: number) {
    this._zone_id = zone_id;
    this.fetch();
  }

  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.fetch();
  }
    /**
     * region, area, headquarter
     */
    _region_id: number = 0;
    @Input()
    set region_id(region_id: number) {
        this._region_id = region_id;
        this.fetch();
    }

    _area_id: number = 0;
    @Input()
    set area_id(area_id: number) {
        this._area_id = area_id;
        this.fetch();
    }

    _headquarter_id: number = 0;
    @Input()
    set headquarter_id(headquarter_id: number) {
        this._headquarter_id = headquarter_id;
        this.fetch();
    }

    /**
     * invoice to show on popup
     */
    invoice: InvoiceDetail;

    /**
     * month of invoice
     */
    public _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
        this.fetch();
    }

    /**
     * year of invoice
     */
    public _year: number;
    @Input()
    set year(year: number) {
        this._year = year;
    }

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return moment().year(this._year).month(this._month).format("MMMM, YYYY");
    }

    /**
     * primary sales
     *
     * @type {Array}
     */
    public primary_sales: PrimarySale[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private saleService: PrimarySaleService, public _service: AuthService) {
        super(_service);
    }

    /**
     * fetch customer secondary sales from server
     */
    fetch() {
        if ((this._month || this._month == 0) && this._year) {
            let self = this;
            if (this.upload_excel)
                this.upload_excel.remove();
            this.loading = true;
            this.saleService.monthly_invoice(this._month + 1, this._year,
                this._region_id, this._area_id, this._headquarter_id, this.page, this._zone_id, this._department_id).subscribe(
                response => {
                    this.loading = false;

                    // convert to models
                    this.primary_sales = response.primary_sales.map(function (user, index) {
                        return new PrimarySale(user);
                    });
                    this.total = response.total;

                    setTimeout(() => {
                            this.upload_excel = jQuery("#invoices_for_sales").tableExport({
                                formats: ['xlsx'],
                                bootstrap: true,
                                position: "top"
                            });
                    }, 1000);
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * show all tour for user
     * @param invoice
     */
    showInvoice(invoice: InvoiceDetail) {
        this.invoice = invoice;
        jQuery(this.invoice_detail.nativeElement).modal();
    }

    /**
     * Page changed
     *
     * @param page
     */
    pageChanged(page) {
        this.page = page;
        this.fetch();
    }
  /**
   * Download Excel For Stockist sales
   */
  download() {
    this.btn_loading = true;

    this.saleService.invoice_excel_download(this._month + 1, this._year,
      this._region_id, this._area_id, this._headquarter_id).subscribe(
      response => {
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'primary_sales_invoice_report.xls';
        link.click();
        this.btn_loading = false;

      },
      err => {
        this.btn_loading = false;
      }
    );
  }

}
