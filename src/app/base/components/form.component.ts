import {BaseComponent} from "./base.component";


export abstract class FormComponent extends BaseComponent {

  // loading and submitted
  submitted: boolean;

  // errors
  errors: Object;

  /**
   * Action to be taken when request is successful
   */
  abstract save();
}
