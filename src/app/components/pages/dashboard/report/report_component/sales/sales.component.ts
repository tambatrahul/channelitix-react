import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ReportService} from "../../../../../../services/report.service";
import {AuthService} from "../../../../../../services/AuthService";
import {Region} from "../../../../../../models/territory/region";
import {Observable} from "rxjs";
import {Target} from "../../../../../../models/SAP/target";
import {PrimarySale} from "../../../../../../models/sale/primary_sale";
import {ListComponent} from "../../../../../base/list.component";
import {Product} from "../../../../../../models/order/product";
import {Brand} from "../../../../../../models/order/brand";

@Component({
  selector: '[sales]',
  styleUrls: ['sales.component.less'],
  templateUrl: 'sales.component.html'
})
export class SalesComponent extends ListComponent {

  /**
   * Date changed emitter
   */
  @Output()
  setRegions = new EventEmitter();

  /**
   * month of sales
   */
  public _month: number;
  @Input()
  set month(month: number) {
    this._month = month;
    this.fetch();
  }

  /**
   * year of sale
   */
  public _year: number;
  @Input()
  set year(year: number) {
    this._year = year;
    this.fetch();
  }

  /**
   * regions
   *
   * @type {{}}
   */
  public regions: Region[] = [];

  /**
   * List of Products
   */
  public products: Product[] = [];

  /**
   * List of Brands
   */
  public brands: Brand[] = [];

  /**
   * target and primary params
   * @type {number}
   */
  public total_primary_sale: number = 0;
  public total_target: number = 0;
  public total_yearly_primary_sale: number = 0;
  public total_yearly_target: number = 0;

  /**
   * TillMonthChartComponent constructor
   */
  constructor(private reportService: ReportService, public _service: AuthService) {
    super(_service);
  }

  /**
   * initialize data
   */
  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Chart data
   */
  fetch() {
    if (!this.loading && (this._month || this._month == 0) && this._year) {
      this.loading = true;
      Observable.forkJoin(
        this.reportService.sales(this._month + 1, this._year),
        this.reportService.sales_yearly(this._year)
      ).subscribe(data => {

        // get regions
        this.regions = data[0].regions.map(region => new Region(region));

        // get targets monthly
        let targets = data[0].targets.map(target => new Target(target));
        let primaries = data[0].primary_sales.map(ps => new PrimarySale(ps));

        // get products
        this.products = data[0].products.map(prd => new Product(prd));

        // get brands
        this.brands = data[0].brands.map(br => new Brand(br));

        // get targets monthly
        let yearly_targets = data[1].targets.map(target => new Target(target));
        let yearly_primaries = data[1].primary_sales.map(ps => new PrimarySale(ps));

        // prepare data for table
        this.prepareData(targets, primaries, this.products,this.brands);
        this.prepareYearlyData(yearly_targets, yearly_primaries, this.products);
        this.setRegions.emit(this.regions);
        this.loading = false;
      });
    }
  }

  /**
   * Prepare data for primary sales
   * @param targets
   * @param primaries
   * @param products
   * @param brands
   */
  prepareData(targets: Target[], primaries: PrimarySale[], products: Product[],brands:Brand[]) {
    this.total_primary_sale = 0;
    this.total_target = 0;
    this.regions.map(region => {
      region.target = 0;
      region.primary = 0;
      region.products = products.map(prd => new Product(prd));
      region.brands = brands.map(br => new Brand(br));
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          headquarter.target = 0;
          headquarter.primary = 0;
          targets.map(target => {
            if (headquarter.id == target.hq_headquarter_id) {
              headquarter.target += target.total_target ? target.total_target : 0;
              region.target += target.total_target ? target.total_target : 0;

              // set brand
              region.brands.map(br => {
                if (br.id == target.brand_id)
                  br.target += target.total_target ? target.total_target : 0;
              });
              this.brands.map(br => {
                if (br.id == target.product_id)
                  br.target += target.total_target ? target.total_target : 0;
              });

              // product
              region.products.map(prd => {
                if (prd.id == target.product_id)
                  prd.target += target.total_target ? target.total_target : 0;
              });
              this.products.map(prd => {
                if (prd.id == target.product_id)
                  prd.target += target.total_target ? target.total_target : 0;
              });
            }
          });

          primaries.map(primary => {
            if (primary.hq_headquarter_id == headquarter.id) {
              headquarter.primary += primary.total_net_amount;
              region.primary += primary.total_net_amount;

              // set brands
              region.brands.map(br => {
                if (br.id == primary.brand_id)
                  br.primary_sale += primary.total_net_amount;
              });
              this.brands.map(br => {
                if (br.id == primary.brand_id)
                  br.primary_sale += primary.total_net_amount;
              });

              region.products.map(prd => {
                if (prd.code == primary.prd_code)
                  prd.primary_sale += primary.total_net_amount;
              });
              this.products.map(prd => {
                if (prd.code == primary.prd_code)
                  prd.primary_sale += primary.total_net_amount;
              });
            }
          });
        });
      });

      this.total_primary_sale += region.primary;
      this.total_target += region.target;
    });
  };

  /**
   *
   * @param targets
   * @param primaries
   * @param products
   */
  prepareYearlyData(targets: Target[], primaries: PrimarySale[], products: Product[]) {
    this.total_yearly_primary_sale = 0;
    this.total_yearly_target = 0;
    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          targets.map(target => {
            if (headquarter.id == target.hq_headquarter_id) {
              headquarter.yearly_target = target.total_target ? target.total_target : 0;
              region.yearly_target += target.total_target ? target.total_target : 0;
            }
          });

          primaries.map(primary => {
            if (primary.hq_headquarter_id == headquarter.id) {
              headquarter.yearly_primary = primary.total_net_amount;
              region.yearly_primary += primary.total_net_amount;
            }
          })
        });
      });

      this.total_yearly_primary_sale += region.yearly_primary;
      this.total_yearly_target += region.yearly_target;
    });
  }

  /**
   * get total target count
   * @returns {number}
   */
  get onTargetCount() {
    let value = 0;
    this.regions.map(region => {
      value += region.products.filter(prd => prd.onTarget).length;
    });

    return value;
  }

  /**
   * get total target count
   * @returns {number}
   */
  get onBrandTargetCount() {
    let value = 0;
    this.regions.map(region => {
      value += region.brands.filter(br => br.onTarget).length;
    });

    return value;
  }

  /**
   * get hq on budget count
   * @returns {any}
   */
  get onBudgetHqTotal() {
    return this.regions.reduce((a, b) => {
      return a + b.onBudgetHq
    }, 0);
  }

  /**
   * get hq on budget count to 90%
   * @returns {any}
   */
  get onBudgetHq90Total() {
    return this.regions.reduce((a, b) => {
      return a + b.onBudgetHq90
    }, 0);
  }

  /**
   * get hq on budget count less than 90%
   * @returns {any}
   */
  get onBudgetHqLess90Total() {
    return this.regions.reduce((a, b) => {
      return a + b.onBudgetHqLess90
    }, 0);
  }

  /**
   * get hq count
   * @returns {any}
   */
  get onHqTotal() {
    return this.regions.reduce((a, b) => {
      return a + b.totalHq;
    }, 0);
  }
}
