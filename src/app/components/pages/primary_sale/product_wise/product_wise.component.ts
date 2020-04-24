import {Component, Input} from '@angular/core';
import {AuthService} from '../../../../services/AuthService';
import {ListComponent} from '../../../base/list.component';
import {PrimarySaleService} from '../../../../services/primary_sale.service';
import {InvoiceDetail} from '../../../../models/SAP/invoice_detail';
import {Product} from '../../../../models/order/product';

declare let jQuery: any;

@Component({
  selector: 'product-wise',
  templateUrl: 'product_wise.component.html',
  styleUrls: ['product_wise.component.less']
})
export class ProductWiseComponent extends ListComponent {

  fractionSize: string = '1.0-2';
  /**
   * title for form
   *
   * @type {string}
   */
  title: string = '';

    total_amount: number = 0;
    btn_loading: boolean = false;

  upload_excel;

  /**
   * region, area, headquarter
   */
  _zone_id: number = 0;
  @Input()
  set zone_id(zone_id: number) {
    this._zone_id = zone_id;
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

  _department_id: number = 0;
  @Input()
  set department_id(department_id: number) {
    this._department_id = department_id;
    this.fetch();
  }

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
   * invoice detail
   *
   * @type {Array}
   */
  public invoice_details: InvoiceDetail[] = [];

  public products: Product[] = [];


  /**
   * Monthly Tour Program Constructor
   *
   * @param saleService
   * @param _service
   */
  constructor(private saleService: PrimarySaleService, public _service: AuthService) {
    super(_service);
  }

  fetch() {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).substring(0, 3) == 'te-') {
        localStorage.removeItem(localStorage.key(i));
      }
    }

    if ((this._month || this._month == 0) && this._year && !this.loading) {
      this.loading = true;
      this.saleService.monthly_product(this._month + 1, this._year,
        this._region_id, this._area_id, this._headquarter_id, this._zone_id, this._department_id).subscribe(
        response => {
          this.loading = false;

          // convert to models
          this.invoice_details = response.invoice_details.map(function (user, index) {
            return new InvoiceDetail(user);
          });

          this.products = response.products.map(product => new Product(product));
          this.prepareData();
        },
        err => {
          this.loading = false;
        }
      );
    }
  }

  prepareData() {
    let self = this;
    this.total_amount = 0;
    this.products.map(function (product) {
      self.invoice_details.map(function (id) {
        if (id.product && id.product.id == product.id) {
          product.invoice_detail = id;
          self.total_amount += id.total_net_amount;
        }
      });
    });

        setTimeout(() => {
            if (this.upload_excel) {
                this.upload_excel.reset();
            }
            else
                this.upload_excel = jQuery("#product_wise_sale").tableExport({
                    formats: ['xlsx'],
                    bootstrap: true,
                    position: "top"
                });
        }, 1000);
    }
  /**
   * Download Excel For Product sales
   */
  download() {
    this.btn_loading = true;

    this.saleService.product_excel_download(this._month + 1, this._year,
      this._region_id, this._area_id, this._headquarter_id, this._department_id).subscribe(
      response => {
        let blob: Blob = response.blob();

        // Doing it this way allows you to name the file
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'primary_sales_product_report.xls';
        link.click();
        this.btn_loading = false;

      },
      err => {
        this.btn_loading = false;
      }
    );
  }
}

