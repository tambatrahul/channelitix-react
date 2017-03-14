import * as moment from "moment";
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../services/AuthService";
import {UserService} from "../../services/user.service";
import {FormBuilder} from "@angular/forms";
import {FormComponent} from "../base/form.component";
import {AppConstants} from "../../app.constants";
declare let jQuery: any;

@Component({
  templateUrl: '../../templates/pages/create_user.component.html',
  styleUrls: ['../../templates/less/user.component.less']
})
export class CreateUserComponent extends FormComponent {

  /**
   * User relations
   */
  public role_id: number = 0;
  public hq_headquarter_id: number = 0;
  public hq_territory_id: number = 0;
  public hq_area_id: number = 0;
  public hq_region_id: number = 0;
  public hq_country_id: number = 0;
  public manager_id: number = 0;
  public manager_role_id: number = 0;
  public joining_date: string;

  /**
   * user form
   *
   * @type {void|FormGroup}
   */
  public form = this._fb.group({
    full_name: [""],
    username: [""],
    mobile: [""],
    password: [""],
    confirm_password: [""],
    joining_date: [""],
    role: [""],
    hq_brick_id: [""],
    hq_headquarter_id: [""],
    hq_territory_id: [""],
    hq_area_id: [""],
    hq_region_id: [""],
    hq_country_id: [""],
    manager_id: [""],
  });

  /**
   * Create user Constructor
   *
   * @param userService
   * @param _router
   * @param _fb
   * @param _service
   */
  constructor(public userService: UserService, public _router: Router, public _fb: FormBuilder,
              public _service: AuthService) {
    super(_service);
  }

  ngOnInit() {
      super.ngOnInit();
      this.dateChanged(moment().format('DD MMMM YYYY'));
  }

  /**
   * create user
   */
  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      let data = Object.assign({}, this.form.value);

      // format joining date
      if (this.joining_date)
        data.joining_date = moment(data.joining_date, "DD MMMM YYYY").format('YYYY-MM-DD');

      this.userService.create(data).subscribe(
        response => {
          localStorage.setItem("user", JSON.stringify(response.user));
          this._router.navigate(['/users']);
          this.loading = false;
        },
        err => {
          this.loading = false;
          console.log(err);
          this.errors = err.errors;
        }
      );
    }
  }

  /**
   * Role changed
   */
  roleChanged(role_id) {
    this.role_id = role_id;
    this.manager_role_id = role_id != 0 ? parseInt(role_id) + 1 : 0;
    this.managerChanged(0);
    this.form.patchValue({role: AppConstants.getRole(role_id).name});
  }

  /**
   * when role is changed filter list of users
   *
   * @param manager_id
   */
  managerChanged(manager_id) {
    this.manager_id = manager_id;
    this.form.patchValue({manager_id: manager_id});
  }

  /**
   * manager selected
   */
  managerSelected(manager) {
    // reset all fields
    this.hq_headquarter_id = 0;
    this.hq_territory_id = 0;
    this.hq_area_id = 0;
    this.hq_region_id = 0;
    this.hq_country_id = 0;

    // depending on manager set the territory
    if (manager)
      if (manager.hq_headquarter_id)
        this.hq_headquarter_id = manager.hq_headquarter_id;
      else if (manager.hq_territory_id)
        this.hq_territory_id = manager.hq_territory_id;
      else if (manager.hq_area_id)
        this.hq_area_id = manager.hq_area_id;
      else if (manager.hq_region_id)
        this.hq_region_id = manager.hq_region_id;
      else if (manager.hq_country_id)
        this.hq_country_id = manager.hq_country_id;
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.hq_region_id = region_id;
    this.form.patchValue({hq_region_id: region_id});
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.hq_area_id = area_id;
    this.form.patchValue({hq_area_id: area_id});
  }

  /**
   * when territory is changed filter list of customer
   * @param territory_id
   */
  territoryChanged(territory_id) {
    this.hq_territory_id = territory_id;
    this.form.patchValue({hq_territory_id: territory_id});
  }

  /**
   * when headquarter is changed filter list of customer
   * @param headquarter_id
   */
  headquarterChanged(headquarter_id) {
    this.hq_headquarter_id = headquarter_id;
    this.form.patchValue({hq_headquarter_id: headquarter_id});
  }

  /**
   * on joning date changed
   */
  dateChanged(date) {
    this.joining_date = date;
    this.form.patchValue({joining_date: date});
  }
}
