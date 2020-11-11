import {Component} from '@angular/core';
import {VisitService} from "../../../../services/visit.service";
import {AuthService} from "../../../../services/AuthService";
import {VisitInput} from "../../../../models/visit/visit_input";
import {Router} from "@angular/router";
import {UserInputAck} from "../../../../models/visit/user_input_ack";
import {BaseAuthComponent} from "../../../base/base_auth.component";

declare let swal: any;

@Component({
  selector: 'user-input-select',
  templateUrl: 'user_input.component.html',
  styleUrls: ['user_input.component.less']
})
export class UserInputComponent extends BaseAuthComponent {

  user_input_acks: UserInputAck [] = [];
  inputs: VisitInput[] = [];
  input_id: number = 0;

  /**
   * Create customer Constructor
   *
   * @param visitService
   * @param _router
   * @param _service
   */
  constructor(private visitService: VisitService, public _router: Router, public  _service: AuthService) {
    super(_service);
  }

  /**
   * Add Default One Empty Input
   */
  ngOnInit() {
    this.user_input_acks.push(new UserInputAck({}));
  }

  /**
   * Add Input
   */
  addInput() {
    this.user_input_acks.push(new UserInputAck({}));
  }

  /**
   * Input Changed
   * @param input_id
   * @param addInput
   */
  onUserInputChanged(input_id, addInput) {
    addInput.input_id = input_id;
  }

  // save user input
  submitInput() {
    if (this.user_input_acks.length > 0 && this.user_input_acks[0].qty > 0) {
      this.user_input_acks = this.user_input_acks.filter(user_ack => user_ack.qty > 0);
      this.visitService.create_input(this.user_input_acks).subscribe(
        response => {
          this.loading = false;
          swal({
            title: "User Input Added Successfully",
            text: "I will close in 2 sec.",
            type: "success",
            timer: 3000,

          });
          this.user_input_acks = [];
          location.reload(true);
        },
      );
    } else {
      swal({
        title: "Please Add One Input & Qty Is Greater Than 0",
        text: "I will close in 2 sec.",
        type: "success",
        timer: 2000,
      });
    }
  }
}
