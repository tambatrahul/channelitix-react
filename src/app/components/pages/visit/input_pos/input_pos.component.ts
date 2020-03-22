import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {VisitService} from "../../../../services/visit.service";
import {AuthService} from "../../../../services/AuthService";
import {FormComponent} from "../../../../components/base/form.component";
import {UserInputPos} from '../../../../models/visit/user_input_pos';

declare let jQuery: any;
declare let swal: any;

@Component({
  selector: 'input-pos',
  templateUrl: 'input_pos.component.html'
})
export class InputPosComponent extends FormComponent {

  _input_po: UserInputPos;

  /**
   * loading identifier
   */
  @ViewChild('input_pos_model')
  input_pos_model: ElementRef;

  /**
   * user to deactivate
   *
   * @type {number}
   */
  @Input()
  set input_po(input_po: UserInputPos) {
    this._input_po = input_po;
    if (input_po.id) {
      jQuery(this.input_pos_model.nativeElement).modal();
    }
  }

  /**
   * event on user deactivating
   *
   * @type {EventEmitter}
   */
  @Output()
  inputPosAdd = new EventEmitter();

  /**
   * user form
   *
   * @type {void|FormGroup}
   */
  public form = this._fb.group({
    quantity_received: [""],
    receipt_date: [""],
  });

  /**
   * Add Reset user Constructor
   *
   * @param visitService
   * @param _router
   * @param _fb
   * @param _service
   */
  constructor(public visitService: VisitService, public _router: Router, public _fb: FormBuilder,
              public _service: AuthService) {
    super(_service);
  }

  reset() {
    this.form.patchValue({
      quantity_received: [""],
      receipt_date: [""]
    });
  }

  /**
   * Deactivate user
   */
  save() {
    let self = this;
    this.submitted = true;
    if (this.form.valid) {
      let data = this.form.value;

      // make server call
      swal({
        title: 'Are you sure?',
        text: 'You want to Add Acknowledgment for this date',
        type: 'info',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      }, function () {
        self.visitService.add_acknowledgment(data, self._input_po.id, self._input_po.input_id ).subscribe(
          response => {
            swal({
              title: "Input Acknowledgment Added Successfully",
              text: "I will close in 2 sec.",
              type: "success",
              timer: 1500,
              showConfirmButton: false
            });
            self.reset();
            jQuery(self.input_pos_model.nativeElement).modal('hide');
            self.inputPosAdd.emit(self._input_po);
          }, err => {
            console.log(err.errors);
            self.errors = err.errors;
            swal.close();
          }
        );
      });
    }
  }
}
