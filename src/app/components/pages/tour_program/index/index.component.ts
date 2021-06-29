import {Component, ViewChild, ElementRef} from "@angular/core";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
import {AuthService} from "../../../../services/AuthService";
import {Holiday} from "../../../../models/holiday";
import {TourService} from "../../../../services/tour.service";
import {Tour} from "../../../../models/tour_program/tour";
import {BaseMonthlyComponent} from "../../../base/base_monthly.component";
import * as moment from "moment";
import { ComponentStillLoadingError } from "@angular/compiler/src/private_import_core";
declare let jQuery: any;
declare let d3: any;

@Component({
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.less']
})
export class TourComponent extends BaseMonthlyComponent {

  excel_loaded: boolean = false;

  /**
   * loading identifier
   */
  @ViewChild('tour_program_modal')
  tour_program_modal: ElementRef;

  /**
   * user tour program modal loading identifier
   */
  @ViewChild('user_tour_program_modal')
  user_tour_program_modal: ElementRef;

  /**
   * users
   *
   * @type {{}}
   */
  public users: User[] = [];

  /**
   * Tours
   */
  tour: Tour;
  tours: Tour[] = [];

  /**
   * user id
   *
   * @type {number}
   */
  public user: User;

  /**
   * Compact view flag
   * @type {boolean}
   */
  public compact_view: boolean = true;

  /**
   * users
   *
   * @type {{}}
   */
  public managers: User[] = [];

  /**
   * abbott check
   *
   * @type {boolean}
   */
  public abbott: boolean = false;

  /**
   * show all for selected user
   * @type {boolean}
   */
  public show_all: boolean = false;

  /**
   * User Component Constructor
   *
   * @param tourService
   * @param _service
   */
  constructor(private tourService: TourService, public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
    super.ngOnInit();
    if(this._service.user.username == 'abbottadmin') {
      this.abbott = true;
    }
  }

  /**
   * Adding tours to skeleton
   *
   * @param children
   * @param tours
   * @param holidays
   */
  addTourToSkeleton(children: User[], tours: Tour[], holidays: Holiday[]) {
    let data_skeleton = {};
    let users: User[] = [];
    let managers: User[] = [];
    let zone_managers: User[] = [];

    // tour skeleton
    let skeleton: Array<Tour> = AppConstants.prepareMonthTourSkeleton(this.month, this.year, holidays);

    // add active children
    for (let user of children) {
      users.push(user);
      data_skeleton[user.id] = skeleton.map(tour => Object.assign(new Tour({}), tour));
    }

    // prepare tour skeleton
    for (let tour of tours) {

      // add user if not present
      if (!data_skeleton.hasOwnProperty(tour.user_id)) {
        data_skeleton[tour.user_id] = skeleton.map(tour => Object.assign(new Tour({}), tour));
        users.push(tour.user);
      }

      // set tour details
      data_skeleton[tour.user_id][tour.tour_day - 1].tour_count = tour.tour_count;
    }

    // add skeleton to user
    for (let user of users) {
      user.tours = data_skeleton[user.id];

      // separate csm and zsm
      if (user.role_str == this.ROLE_CSM) {
        managers.push(user);
      } else if (user.role_str == this.ROLE_RSM) {
        zone_managers.push(user);
      }
    }

    // if user is zone manager add it to list
    if (this._service.user.role_str == this.ROLE_RSM) {
      this._service.user.tours = AppConstants.prepareMonthTourSkeleton(this.month, this.year, holidays);
      this._service.user.children = [];
      this._service.user.cse_count = 0;
      this._service.user.abm_count = 0;
      zone_managers.push(this._service.user);
    }

    // if user is zone manager add it to list
    if (this._service.user.role_str == this.ROLE_CSM) {
      this._service.user.tours = AppConstants.prepareMonthTourSkeleton(this.month, this.year, holidays);
      this._service.user.children = [];
      managers.push(this._service.user)
    }

    // add children to managers
    for (let m of managers) {
      m.children = [];
      for (let u of users) {
        if (u.manager_id == m.id) {
          m.children.push(u);
          u.tours.forEach(function (tour, index) {
            if (tour.tour_count > 0) {
              m.tours[index].t_count += 1;
            }
          });
        }
      }
    }


    for (let z of zone_managers) {
      z.children = [];
      for (let m of managers) {
        if (m.manager_id == z.id) {
          m.tours.forEach(function (tour, index) {
            if (tour.tour_count > 0) {
              z.tours[index].t_count += 1;
            }
          });
        }
      }

    }

    // add to zone manager
    for (let z of zone_managers) {
      for (let m of managers) {
        if (m.manager_id == z.id) {
          z.children.push(m);
          z.abm_count += z.children.length
          m.tours.forEach(function (tour, index) {
            z.tours[index].t_count += tour.t_count;
          });
          z.cse_count += m.children.length

        }
      }
    }

    // depending on list show view
    if (zone_managers.length > 0)
      this.managers = zone_managers;
    else
      this.managers = managers;

    this.users = users;

    setTimeout(() => {
      if (!this.excel_loaded) {
        this.excel_loaded = true;
        jQuery('table').tableExport({
          formats: ['xlsx'],
          bootstrap: true,
          position: 'top'
        });
      }
    }, 3000);
  }

  /**
   * load tour for children of logged in user
   */
  fetch() {
    this.loading = true;
    this.tourService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id).subscribe(
      response => {
        this.loading = false;
        // convert to tours
        let tours: Tour[] = response.tours.map(function (tour, index) {
          return new Tour(tour);
        });

        // convert to holidays
        let holidays: Holiday[] = response.holidays.map(function (holiday, index) {
          return new Holiday(holiday);
        });

        // convert to users
        let children = response.children.map(function (user, index) {
          return new User(user);
        });

        this.addTourToSkeleton(children, tours, holidays);
      },
      err => {
        this.loading = false;
      }
    );
  }

  /**
   * fetch tours for month year and date
   *
   * @param user
   * @param date
   */
  fetchTours(user: User, date: number) {
    let tour_date = moment();
    tour_date.month(this.month);
    tour_date.year(this.year);
    tour_date.date(date);
    this.tourService.forChildren(this.month + 1, this.year, user.id, date).subscribe(
      response => {
        this.tour = new Tour({
          user: user,
          date: tour_date.format('YYYY-MM-DD'),
          tours: response.tours
        });
      },
      err => {

      }
    )
  }

  /**
   * show tour popup
   *
   * @param tour
   * @param user
   */
  showTours(tour, user) {
    this.user = user;
    let date = moment(tour.date, "YYYY-MM-DD").date();
    this.fetchTours(user, date);
    jQuery(this.tour_program_modal.nativeElement).modal();
  }

  /**
   * tour created refresh tour list
   */
  tourCreated() {
    let date = moment(this.tour.date, "YYYY-MM-DD").date();
    this.fetchTours(this.tour.user, date);
    this.fetch();
  }

  /**
   * tour deleted refresh tour list
   */
  tourDeleted() {
    let date = moment(this.tour.date, "YYYY-MM-DD").date();
    this.fetchTours(this.tour.user, date);
    this.fetch();
  }

  /**
   * Toggle compact view
   */
  toggleCompactView() {
    this.compact_view = !this.compact_view;
  }

  /**
   * show all tour for user
   * @param user
   */
  showAllTourForUser(user: User) {
    this.user = user;
    jQuery(this.user_tour_program_modal.nativeElement).modal();
  }
}
