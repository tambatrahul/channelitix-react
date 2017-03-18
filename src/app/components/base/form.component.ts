import {BaseAuthComponent} from "./base.component";


export abstract class FormComponent extends BaseAuthComponent {

  // loading and submitted
  submitted: boolean;

  // errors
  errors: Object = {};

  /**
   * Action to be taken when request is successful
   */
  abstract save();
}
