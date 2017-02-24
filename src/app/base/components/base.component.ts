import {ViewChild, ElementRef} from "@angular/core";
declare let jQuery: any;


export abstract class BaseComponent {

  /**
   * loading identifier
   */
  @ViewChild('loading_box')
  loading_table: ElementRef;

  /**
   * loading variable
   */
  protected _loading: boolean;

  /**
   * loading setter
   */
  set loading(loading) {
    this._loading = loading;
    if (loading)
      jQuery(this.loading_table.nativeElement).mask('loading');
    else
      jQuery(this.loading_table.nativeElement).unmask();
  }

  /**
   * loading getter
   * @returns {boolean}
   */
  get loading() {
    return this._loading;
  }

  /**
   * abstract function fetch
   */
  protected abstract fetch();

  /**
   * on load of call fetch
   */
  ngOnInit() {
    this.fetch();
  }

}
