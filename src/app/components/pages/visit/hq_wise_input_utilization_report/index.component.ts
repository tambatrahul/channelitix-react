import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {ListComponent} from "../../../base/list.component";
import {Headquarter} from "../../../../models/territory/headquarter";
import {environment} from "../../../../../environments/environment";
import {Input} from "../../../../models/visit/input";
import {Visit} from "../../../../models/visit/visit";
import {Region} from "../../../../models/territory/region";
import {VisitService} from "../../../../services/visit.service";
import {AuthService} from "../../../../services/AuthService";
import {InputAnswer} from "../../../../models/visit/input_answer";
declare let jQuery: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class HqWiseInputUtilizationReportComponent extends ListComponent {

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * region, territory, area, headquarter & brick id
   */
  public region_id: number = 0;
  public area_id: number = 0;
  public headquarter_id: number = 0;
  public _headquarters: Headquarter[] = [];
  public inputs: Input[] = [];

  /**
   * get regions
   *
   * @type {Array}
   */
  regions: Region[] = [];

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public route: ActivatedRoute, public visitService: VisitService) {
    super(_service);
  }

  /**
   * on load of component load customer types
   */
  ngOnInit() {
    this.month = moment().month();
    this.year = moment().year();
    super.ngOnInit();
  }

  /**
   * load users for logged in user
   */
  fetch() {
    console.log('here');
    if (this.month && this.year) {
      this.loading = true;
      this.visitService.hq_wise_input_utilization(this.month + 1, this.year).subscribe(
        response => {
          // get inputs
          this.inputs = response.inputs.map(input => new Input(input));

          // get visit
          let visits = response.visits.map(visit => new Visit(visit));

          // convert to models
          this.regions = response.regions.map(function (region, index) {
            return new Region(region);
          });

          // prepare data for display
          this.prepareData(this.inputs, visits);

          this.loading = false;
        }, err => {
          this.loading = false;
        }
      );
    }
  }

  // Prepare Data For Display
  prepareData(inputs: Input[], visits: Visit[]) {
    this.mapInputs(inputs);
    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          visits.map(visit => {
            headquarter.inputs.map(input => {
              if (headquarter.id == visit.hq_headquarter_id && input.id == visit.input_id) {
                input.value = visit.visit_input_count;
                headquarter.total_input_value += +visit.visit_input_count;
              }
            });
          });

          area.inputs.map(area_input => {
            headquarter.inputs.map(hq_input => {
              if (area.id == headquarter.hq_area_id && area_input.id == hq_input.id) {
                area_input.value += +hq_input.value;
                area.total_input_value += +hq_input.value;
              }
            });
          });
        });
        region.inputs.map(region_input => {
          area.inputs.map(area_input => {
            if (region.id == area.hq_region_id && region_input.id == area_input.id) {
              region_input.value += +area_input.value;
              region.total_input_value += +area_input.value;
            }
          });
        });
      });
    });
  }

  /**
   * Map Inputs In Region Area And Headquarter
   * @param inputs
   */
  mapInputs(inputs: Input[]) {
    this.regions.map(region => {
      region.areas.map(area => {
        area.headquarters.map(headquarter => {
          // add inputs
          headquarter.inputs = inputs.map(input => new InputAnswer(input));
        });
        // add inputs
        area.inputs = inputs.map(input => new InputAnswer(input));
      });
      // add inputs
      region.inputs = inputs.map(input => new InputAnswer(input));
    });
  }

  /**
   * get headquarters
   */
  headquarters(data) {
    this._headquarters = data.headquarters;
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.region_id = region_id;
    this.areaChanged(0);
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.area_id = area_id;
    this.headquarterChanged(0);
  }


  /**
   * when headquarter is changed filter list of customer
   * @param headquarter_id
   */
  headquarterChanged(headquarter_id) {
    this.headquarter_id = headquarter_id;
  }

  /**
   * month and year changed
   *
   * @param date
   */
  monthYearChanged(date) {
    this.month = date.month;
    this.year = date.year;
    this.fetch();
  }
}
