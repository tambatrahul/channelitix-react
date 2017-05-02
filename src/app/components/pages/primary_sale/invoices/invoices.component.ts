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
   * loading identifier
   */
@ViewChild('invoice_detail')
  invoice_detail: ElementRef;

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
    if (this._month && this._year) {
      this.loading = true;
      this.saleService.monthly_invoice(this._month + 1, this._year).subscribe(
          response => {
          this.loading = false;

          // convert to models
          this.primary_sales = response.primary_sales.map(function (user, index) {
            return new PrimarySale(user);
          });
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
}
