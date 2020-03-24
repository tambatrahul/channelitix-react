import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import {CustomerService} from "../../../../services/customer.service";
import {FormBuilder} from "@angular/forms";
import {FormComponent} from "../../../base/form.component";
import {CustomerType} from "../../../../models/customer/customer_type";
import {Grade} from "../../../../models/customer/grade";
import {DoctorType} from '../../../../models/customer/doctor_type';

declare let jQuery: any;
declare let swal: any;

@Component({
  selector: 'create-customer',
  templateUrl: 'create.component.html',
  styleUrls: ['create.component.less']
})
export class CreateCustomerComponent extends FormComponent {

  customer_types: CustomerType[] = [];
  doctor_types: DoctorType[] = [];
  grades: Grade[] = [];

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
  public hq_country_id: number = 0;
  public hq_brick_id: number = 0;
  public classification: string;

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
    grade_id: [""],
    hq_country_id: [""],
    hq_zone_id: [""],
    hq_region_id: [""],
    hq_area_id: [""],
    hq_headquarter_id: [""],
    hq_territory_id: [""],
    hq_brick_id: [""],
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
   * Create customer Constructor
   *
   * @param customerService
   * @param _router
   * @param _fb
   * @param _service
   */
  constructor(public customerService: CustomerService, public _router: Router, public _fb: FormBuilder,
              public _service: AuthService) {
    super(_service);
  }

  /**
   * initialize form
   */
  ngOnInit() {
    super.ngOnInit();
    this.zoneChanged(this._service.user.hq_zone_id);
    this.regionChanged(this._service.user.hq_region_id);
    this.areaChanged(this._service.user.hq_area_id);
    this.headquarterChanged(this._service.user.hq_headquarter_id);
    this.territoryChanged(this._service.user.hq_territory_id);
    this.brickChanged(this._service.user.hq_brick_id);
    this.fetchMasters();
  }

  /**
   * Customer Grade
   */
  fetchMasters() {
    this.customerService.masters().subscribe(
      response => {
        this.customer_types = response.customer_types;
      },
      err => {
      }
    );
  }

  /**
   * create customer
   */
  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      let data = this.form.value;

      this.customerService.create(data).subscribe(
        response => {
          this.loading = false;
          swal({
            title: "Customer Created Successfully",
            text: "I will close in 2 sec.",
            type: "success",
            timer: 1500,
            showConfirmButton: false
          });
          this._router.navigate(['/customers']);
        },
        err => {
          this.loading = false;
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
   * when brick is changed filter list of customer
   * @param hq_brick_id
   */
  brickChanged(hq_brick_id) {
    this.hq_brick_id = hq_brick_id;
    this.form.patchValue({hq_brick_id: hq_brick_id});
  }

  /**
   * Type changed
   */
  classificationChanged(classification) {
    this.classification = classification;
    this.form.patchValue({classification: classification});
  }
}
