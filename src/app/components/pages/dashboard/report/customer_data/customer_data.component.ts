import {Component, Input} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ListComponent} from "../../../../base/list.component";
import {AuthService} from "../../../../../services/AuthService";
import {ReportService} from "../../../../../services/report.service";
import {Region} from "../../../../../models/territory/region";
import {Customer} from "../../../../../models/customer/customer";
import {CustomerType} from "../../../../../models/customer/customer_type";
import {BrickCustomerCount} from "../../../../../models/territory/brick_customer_count";
declare let jQuery: any;

@Component({
  selector: '[customer-data-report]',
  templateUrl: 'customer_data.component.html',
  styleUrls: ['customer_data.component.less']
})
export class CustomerDataComponent extends ListComponent {

  public _regions: Region[];
  @Input()
  set regions(regions) {
    this._regions = regions;
    this.fetch();
  }

  show_data: boolean = false;

  public total_hq = 0;
  public total_brick_hq = 0;
  public total_hq_with_norms = 0;

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public reportService: ReportService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * load users for logged in user
   */
  fetch() {
    if (this._regions && this._regions.length > 0) {
      this.loading = true;
      this.reportService.customer_data().subscribe(
        response => {

          // get customer type Data
          let customer_types = response.customer_types.map(customer_type => new CustomerType(customer_type));

          // get hq wise brick counts
          let brick_customer_counts = response.brick_customer_counts.map(bcc => new BrickCustomerCount(bcc));

          // get customer Data
          let customers = response.customers.map(customer => new Customer(customer))
            .filter(cus => {
              if (this.environment.envName == 'geo') {
                return (cus.customer_type_id == 2 && cus.visit_count >= 20 && cus.visit_count <= 30)
                  || (cus.customer_type_id == 3 && cus.visit_count >= 300)
                  || (cus.customer_type_id == 4 && cus.visit_count >= 25)
                  || (cus.customer_type_id == 5 && cus.visit_count >= 70);
              }
              return false;
            });

          // map customer count with regions
          this._regions.map(region => {
            region.bricks_count = 0;
            region.headquarters_count = 0;
            region.areas.map(area => {
              area.headquarters.map(hq => {

                // add customer counts with norms
                hq.customer_types = customer_types.map(customer_type => new CustomerType(customer_type));
                customers.map(cus => {
                  hq.customer_types.map(ct => {
                    if (ct.id == cus.customer_type_id && hq.id == cus.hq_headquarter_id) {
                      ct.visit_count = cus.visit_count;
                    }
                  });
                });

                // add headquarters with 70% norm
                brick_customer_counts.map(bcc => {
                  if (bcc.hq_headquarter_id == hq.id) {
                    if (bcc.isPercent70) {
                      region.bricks_count += 1;
                    }
                    region.headquarters_count += 1;
                  }
                });
              });
            });
            this.total_hq += region.headquarters_count;
            this.total_brick_hq += region.bricks_count;
            this.total_hq_with_norms += region.total_hq_with_norms;
          });

          this.show_data = true;
          this.loading = false;
        }, error => {
          this.loading = false;
        }
      );
    }
  }
}
