import {Component, ElementRef, ViewChild} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {ListComponent} from "../../../base/list.component";
import {ReportService} from "../../../../services/report.service";
import {Region} from "../../../../models/territory/region";
import * as moment from "moment";
import {TerritoryService} from "../../../../services/territory.service";
import {Headquarter} from "../../../../models/territory/headquarter";
import {Area} from "../../../../models/territory/area";
import {Brick} from "../../../../models/territory/brick";

declare let jQuery: any;

@Component({
  templateUrl: 'field_efforts_audit_scorecard.component.html',
  styleUrls: ['field_efforts_audit_scorecard.component.less']
})
export class FieldEffortAuditScoreCardComponent extends ListComponent {

  /**
   * year and month for calendar
   * @type {number}
   */
  public month: number;
  public year: number;

  /**
   * loading identifier
   */
  @ViewChild('user_list')
  user_list: ElementRef;

  /**
   * get regions
   *
   * @type {Array}
   */
  public regions: Region[] = [];
  public headquarters: Headquarter[] = [];
  public bricks: Brick[] = [];
  public areas: Area[] = [];

  public headquarter_ids = [];
  public brick_ids = [];
  public area_ids = [];
  public region_ids = [];
  public title;

  /**
   * User Component Constructor
   */
  constructor(public _service: AuthService, public reportService: ReportService,
              public territoryService: TerritoryService) {
    super(_service);
  }

  /**
   * on load of call fetch
   */
  ngOnInit() {
    this.month = moment().month() - 1;
    this.year = moment().year();
    super.ngOnInit();
  }

  /**
   * load users for logged in user
   */
  fetch() {

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

  /**
   * Open Modal
   */
  openUserListModal(value) {
    this.title = value.title;
    this.headquarter_ids = [];
    this.brick_ids = [];
    this.area_ids = [];
    this.region_ids = [];

    // set headquarter id if present
    if (value.headquarter_ids && value.headquarter_ids.length > 0)
      this.headquarter_ids = value.headquarter_ids;

    // set headquarter id if present
    if (value.brick_ids && value.brick_ids.length > 0)
      this.brick_ids = value.brick_ids;

    // set area id if present
    if (value.area_ids && value.area_ids.length > 0)
      this.area_ids = value.area_ids;

    // set region id if present
    if (value.region_ids && value.region_ids.length > 0)
      this.region_ids = value.region_ids;

    jQuery(this.user_list.nativeElement).modal()
  }
}
