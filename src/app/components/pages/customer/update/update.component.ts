import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import {CustomerService} from "../../../../services/customer.service";
import {FormBuilder} from "@angular/forms";
import {FormComponent} from "../../../base/form.component";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Grade} from "../../../../models/customer/grade";
import {DoctorType} from '../../../../models/customer/doctor_type';
import {CustomerQualification} from '../../../../models/customer/customer_qualification';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect/index';

declare let jQuery: any;
declare let swal: any;

@Component({
  selector: 'update-customer',
  templateUrl: 'update.component.html',
  styleUrls: ['update.component.less']
})
export class UpdateCustomerComponent extends FormComponent {

  /**
   * settings
   */
  settings = {
    buttonClasses: "btn btn-default btn-secondary btn-block"
  };

  customer_types: CustomerType[] = [];
  doctor_types: DoctorType[] = [];
  grades: Grade[] = [];
  customer_qualifications: CustomerQualification[] = [];
  qualification_options: IMultiSelectOption[] = [];
  private id: number;

  /**
   * Customer type and grade
   */
  public customer_type_id: number = 0;
  public doctor_type_id: number = 0;
  public grade_id: number = 0;
  public hq_headquarter_id: number = 0;
  public hq_territory_id: number = 0;
  public hq_area_id: number = 0;
  public hq_region_id: number = 0;
  public hq_zone_id: number = 0;
  public hq_brick_id: number = 0;
  public classification: string;

  public qualification_ids: Array<number> = [];


  classifications = [{'key': 'core', 'value': 'Core'}, {'key': 'super_core', 'value': 'Super Core'}];

  /**
   * customer form
   *
   * @type {void|FormGroup}
   */
  public form = this._fb.group({
    firm_name: [""],
    email: [""],
    mobile: [""],
    classification: [""],
    customer_type_id: [""],
    doctor_type_id: [""],
    qualification_ids: [""],
    grade_id: [""],
    hq_zone_id: [""],
    hq_region_id: [""],
    hq_area_id: [""],
    hq_headquarter_id: [""],
    hq_territory_id: [""],
    hq_brick_id: [""],
    qualification_value: [""],
    address: this._fb.group({
      line: [""],
      landmark: [""],
      area_str: [""],
      pincode: [""],
      taluka_str: [""],
      district_str: [""],
      state_str: [""],
      country_str: [""],
    }),
  });

  /**
   * Update customer Constructor
   *
   * @param customerService
   * @param _router
   * @param route
   * @param _fb
   * @param _service
   */
  constructor(public customerService: CustomerService, public _router: Router, public route: ActivatedRoute,
              public _fb: FormBuilder, public _service: AuthService) {
    super(_service);
  }

  /**
   * on load of component
   */
  ngOnInit() {
    super.ngOnInit();
    let self = this;
    this.zoneChanged(this._service.user.hq_zone_id);
    this.regionChanged(this._service.user.hq_region_id);
    this.areaChanged(this._service.user.hq_area_id);
    this.headquarterChanged(this._service.user.hq_headquarter_id);
    this.territoryChanged(this._service.user.hq_territory_id);
    this.brickChanged(this._service.user.hq_brick_id);
    this.fetchMasters();

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loading = true;
      this.customerService.read(this.id).subscribe(response => {
        this.loading = false;
        this.form.patchValue({
          firm_name: response.customer.firm_name,
          email: response.customer.email,
          mobile: response.customer.mobile,
          address: response.customer.address,
          classification: response.customer.classification
        });
        this.zoneChanged(response.customer.hq_zone_id);
        this.regionChanged(response.customer.hq_region_id);
        this.areaChanged(response.customer.hq_area_id);
        this.headquarterChanged(response.customer.hq_headquarter_id);
        this.territoryChanged(response.customer.hq_territory_id);
        this.brickChanged(response.customer.hq_brick_id);
        this.typeChanged(response.customer.customer_type_id);
        this.doctorTypeChanged(response.customer.doctor_type_id);
        this.gradeChanged(response.customer.grade_id);
        if (response.customer.doctor_qualifications)
        response.customer.doctor_qualifications.map(function (cusQual) {
          self.qualification_ids.push(cusQual.id);
        });
      }, err => {
        this.loading = false;
      });
    });
  }

  /**
   * Customer Grade
   */
  fetchMasters() {
    this.customerService.masters().subscribe(
      response => {
        this.customer_types = response.customer_types;
        this.doctor_types = response.doctor_types;
        this.customer_qualifications = response.customer_qualifications;
        this.qualification_options = this.customer_qualifications.map(function (cusQual) {
          return {
            id: cusQual.id, name: cusQual.name
          };
        });
      },
      err => {
      }
    );
  }

  /**
   * update customer
   */
  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;

      // prepare data
      let data = this.form.value;
      if (data.doctor_type_id === 0)
        data.doctor_type_id = null;

      if (data.qualification_ids === 0)
        data.qualification_ids = null;

      data.qualification_ids = this.qualification_ids;

      // upate customer
      this.customerService.update(data, this.id).subscribe(
        response => {
          this.loading = false;

          // popup message
          swal({
            title: "Customer Updated Successfully",
            text: "I will close in 2 sec.",
            type: "success",
            timer: 1500,
            showConfirmButton: false
          });

          // navigate to customers
          this._router.navigate(['/customers']);
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
   * Type changed
   */
  typeChanged(customer_type_id) {
    this.customer_type_id = customer_type_id;
    this.grades = this.customer_types.find(ct => ct.id == customer_type_id).grades;
    this.form.patchValue({customer_type_id: customer_type_id});
  }

  /**
   * Grade changed
   */
  gradeChanged(grade_id) {
    this.grade_id = grade_id;
    this.form.patchValue({grade_id: grade_id});

  }

  /**
   * Doctor Type changed
   */
  doctorTypeChanged(doctor_type_id) {
    this.doctor_type_id = doctor_type_id;
    this.form.patchValue({doctor_type_id: doctor_type_id});
  }

  /**
   * when region is changed filter list of customer
   * @param zone_id
   */
  zoneChanged(zone_id) {
    this.hq_zone_id = zone_id;
    this.form.patchValue({hq_zone_id: zone_id});
    this.regionChanged(0);
  }

  /**
   * when region is changed filter list of customer
   * @param region_id
   */
  regionChanged(region_id) {
    this.hq_region_id = region_id;
    this.form.patchValue({hq_region_id: region_id});
    this.areaChanged(0);
  }

  /**
   * when area is changed filter list of customer
   * @param area_id
   */
  areaChanged(area_id) {
    this.hq_area_id = area_id;
    this.form.patchValue({hq_area_id: area_id});
    this.headquarterChanged(0);
  }

  /**
   * when territory is changed filter list of customer
   * @param territory_id
   */
  territoryChanged(territory_id) {
    this.hq_territory_id = territory_id;
    this.form.patchValue({hq_territory_id: territory_id});
    this.brickChanged(0);
  }

  /**
   * when headquarter is changed filter list of customer
   * @param headquarter_id
   */
  headquarterChanged(headquarter_id) {
    this.hq_headquarter_id = headquarter_id;
    this.form.patchValue({hq_headquarter_id: headquarter_id});
    this.territoryChanged(0);
  }

  /**
   * when brick is changed filter list of customer
   * @param hq_brick_id
   */
  brickChanged(hq_brick_id) {
    this.hq_brick_id = hq_brick_id;
    this.form.patchValue({hq_brick_id: hq_brick_id});
  }

}
