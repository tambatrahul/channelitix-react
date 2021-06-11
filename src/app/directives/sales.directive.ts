import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {ListComponent} from '../components/base/list.component';


@Directive({
  selector: '[salesStatus]',
})
export class SalesDirective {

  _sales: number = 0;
  @Input()
  set sale_value(sale_value: number) {
    this._sales = sale_value;
  }

  _prv_day_sales: number = 0;
  @Input()
  set prv_day_sales(prv_day_sales: number) {
    this._prv_day_sales = prv_day_sales;
  }

  _actual_sales: number = 0;
  @Input()
  set actual_sales(actual_sales: number) {
    this._actual_sales = actual_sales;
  }

  growth_color: string = "#2ecc71";
  non_growth_color: string = "#e74c3c";
  non_growth_font_color: string = "#FFF";
  growth_font_color: string = "#000";

  /**
   * Sales Directive
   *
   * @param el
   */
  constructor(private el: ElementRef) {
    this.el = el;
  }


  /**
   * on change of growth change colour
   *
   */
  ngOnInit() {

    this.el.nativeElement.style.color = this.growth_font_color;
    this.el.nativeElement.style.backgroundColor = this.non_growth_font_color;

     // set background color depending on sales
    if (this._sales > 0) {
      if (this._sales > this._prv_day_sales && this._actual_sales > 0) {
        this.el.nativeElement.style.color = this.growth_font_color;
        this.el.nativeElement.style.backgroundColor = this.growth_color;
      } else if ( (this._sales === this._prv_day_sales || this._sales < this._prv_day_sales) && (this._actual_sales === 0 || this._actual_sales < 0) && this._prv_day_sales > 0) {
        this.el.nativeElement.style.color = this.non_growth_font_color;
        this.el.nativeElement.style.backgroundColor = this.non_growth_color;
      }
    }


  }
}
