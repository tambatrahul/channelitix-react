import {Component, Input} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {PrimarySaleService} from "../../../../services/primary_sale.service";
import {InvoiceDetail} from "../../../../models/SAP/invoice_detail";
import {AppConstants} from '../../../../app.constants';
declare let jQuery: any;

@Component({
    selector: 'stockist-wise',
    templateUrl: 'stockist_wise.component.html',
    styleUrls: ['stockist_wise.component.less']
})
export class StockistWiseComponent extends ListComponent {

    /**
     * title for form
     *
     * @type {string}
     */
    title: string = "";

    upload_excel;

  total_amount: number = 0;
  btn_loading: boolean = false;

  /**
   * pages number for customer and total customers
   *
   * @type {number}
   */
  public page: number = 1;
  public total: number = 10;

    public _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
        this.fetchStockistWiseSale();
    }

    public _year: number;
    @Input()
    set year(year: number) {
        this._year = year;
    }

  /**
   * region, area, headquarter
   */
  _zone_id: number = 0;
  @Input()
  set zone_id(zone_id: number) {
    this._zone_id = zone_id;
    this.fetchStockistWiseSale();
  }

  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.fetchStockistWiseSale();
  }

    /**
     * region, area, headquarter
     */
    _region_id: number = 0;
    @Input()
    set region_id(region_id: number) {
        this._region_id = region_id;
        this.fetchStockistWiseSale();
    }

    _area_id: number = 0;
    @Input()
    set area_id(area_id: number) {
        this._area_id = area_id;
        this.fetchStockistWiseSale();
    }

    _headquarter_id: number = 0;
    @Input()
    set headquarter_id(headquarter_id: number) {
        this._headquarter_id = headquarter_id;
        this.fetchStockistWiseSale();
    }

    /**
     * invoice detail
     *
     * @type {Array}
     */
    public invoice_details: InvoiceDetail[] = [];

  /**
   * fetch from server
   */
  fetchStockistWiseSale = AppConstants.debounce(function () {
    let self = this;
    if ((self._month || self._month == 0) && self._year && !this.loading) {
      if (self.upload_excel) {
        self.upload_excel.remove();
      }

      this.loading = true;
      self.saleService.monthly_stockist(self._month + 1,
        self._year, self._region_id, self._area_id, self._headquarter_id, self.page, self._zone_id, self._department_id).subscribe(
        response => {

          // convert to models
          self.total_amount = 0;
          self.invoice_details = response.invoice_details.map(function (user, index) {
            let invoice_de = new InvoiceDetail(user);
            self.total_amount += invoice_de.total_net_amount;
            return invoice_de;
          });
          self.total = response.total;
          self.loading = false;
          setTimeout(() => {
            self.upload_excel = jQuery('#stockist_wise_sale1').tableExport({
              formats: ['xlsx'],
              bootstrap: true,
              position: 'top'
            });
          }, 1000);
        },
        err => {
          this.loading = false;
        }
      );
    }
  }, 1000, false);


  /**
     * Monthly Tour Program Constructor
     *
     * @param saleService
     * @param _service
     */
    constructor(private saleService: PrimarySaleService, public _service: AuthService) {
        super(_service);
    }

  protected fetch() {

  }

  /**
   * Page changed
   *
   * @param page
   */
  pageChanged(page) {
    this.page = page;
    this.fetchStockistWiseSale();
  }

  /**
   * Download Excel For Stockist sales
   */
  download() {
    this.btn_loading = true;

    this.saleService.stockist_excel_download(this._month + 1, this._year,
      this._region_id, this._area_id, this._headquarter_id, this._department_id).subscribe(
      response => {
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'primary_sales_stockist_report.xls';
        link.click();
        this.btn_loading = false;

      },
      err => {
        this.btn_loading = false;
      }
    );
  }

}
