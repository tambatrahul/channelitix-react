import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
declare let jQuery: any;

@Component({
  selector: 'pagination',
  templateUrl: '../../templates/common/pagination.component.html'
})
export class PaginationComponent {

  @Input()
  page: number = 0;

  @Input()
  length: number = 50;

  @Input()
  total: number = 0;

  @Output()
  onPageChanged = new EventEmitter();

  /**
   * get pages
   *
   * @returns {Array}
   */
  get pages(): Array<number> {
    let pages = [];

    if (this.total != 0 ) {
      let total_pages = Math.ceil(this.total / this.length);

      let start = this.page - ((this.page -1) % 10);

      for (let i = start; i <= Math.min(start + 9, total_pages); i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  /**
   * get total pages
   *
   * @returns {number}
   */
  get total_pages(): number {
    return Math.ceil(this.total / this.length)
  }

  /**
   * hide next when pages number is save as first pages
   *
   * @returns {boolean}
   */
  get hidePrev(): boolean {
    return this.page <= 1;
  }

  /**
   * hide next when pages number is save as last pages
   *
   * @returns {boolean}
   */
  get hideNext(): boolean {
    return this.page == Math.ceil(this.total / this.length);
  }

  /**
   * pages changed trigger
   *
   * @param page
   */
  pageChanged(page) {
    this.page = page;
    this.onPageChanged.emit(page);
  }
}
