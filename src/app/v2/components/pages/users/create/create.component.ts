import * as moment from "moment";
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {FormComponent} from "../../../../../components/base/form.component";
import {V2UserService} from "../../../../../services/v2/user.service";
import {AuthService} from "../../../../../services/AuthService";
import {AppConstants} from "../../../../../app.constants";

declare let jQuery: any;
declare let swal: any;

@Component({
  templateUrl: 'create.component.html',
  styleUrls: ['../index/index.component.less']
})
export class CreateUserComponent extends FormComponent {

  /**
   * User relations
   */
  public role_id: number = 0;
  public role_str: string;

  /**
   * location identifiers
   * @type {number}
   */
  public hq_headquarter_id: number = 0;
  public hq_area_id: number = 0;
  public hq_region_id: number = 0;
  public hq_country_id: number = 0;

  /**
   * manager identifier and manager role identifier
   *
   * @type {number}
   */
  public manager_id: number = 0;
  public manager_role_id: number = 0;

  /**
   * user joining date
   */
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
  constructor(public userService: V2UserService, public _router: Router, public _fb: FormBuilder,
              public _service: AuthService) {
    super(_service);
  }

  /**
   * initialize details
   */
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
          swal({
            title: "User Created Successfully",
            text: "I will close in 2 sec.",
            type: "success",
            timer: 1500,
            showConfirmButton: false
          });
          this._router.navigate(['/v2/users']);
          this.loading = false;
        },
        err => {
          this.loading = false;
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
    this.role_str = AppConstants.getRole(role_id).name;
    this.manager_role_id = role_id != 0 ? parseInt(role_id) + 1 : 0;
    this.form.patchValue({role: AppConstants.getRole(role_id).name});

    if (this.manager_role_id == this._service.user.role_id) {
      this.managerChanged(this._service.user.id);
      this.countryChanged(this._service.user.hq_country_id);

      // set region
      if (this._service.user.hq_region_id)
        this.regionChanged(this._service.user.hq_region_id);

      // set area
      if (this._service.user.hq_area_id)
        this.areaChanged(this._service.user.hq_area_id);

      // set headquarter
      if (this._service.user.hq_headquarter_id)
        this.headquarterChanged(this._service.user.hq_headquarter_id);
    } else
      this.managerChanged(0);
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
   * manager selected set all territory fields
   */
  managerSelected(manager) {
    if (manager)
      if (manager.hq_headquarter_id)
        this.headquarterChanged(manager.hq_headquarter_id);
      else if (manager.hq_area_id)
        this.areaChanged(manager.hq_area_id);
      else if (manager.hq_region_id)
        this.regionChanged(manager.hq_region_id);
      else if (manager.hq_country_id) {
        this.form.patchValue({hq_country_id: manager.hq_country_id});
        this.hq_country_id = manager.hq_country_id;
      }
  }

  /**
   * when country is changed filter list of customer
   * @param country_id
   */
  countryChanged(country_id) {
    this.hq_country_id = country_id;
    this.form.patchValue({hq_country_id: country_id});
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
