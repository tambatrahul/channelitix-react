import {ViewChild, ElementRef} from "@angular/core";
import {BaseComponent} from "./base.component";
declare let jQuery: any;


export abstract class ListComponent extends BaseComponent{

  /**
   * abstract function fetch
   */
  protected abstract fetch();

  /**
   * on load of call fetch
   */
  ngOnInit() {
    super.ngOnInit();
    this.fetch();
  }

}
