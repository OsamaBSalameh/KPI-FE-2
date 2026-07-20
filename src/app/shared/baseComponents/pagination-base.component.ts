import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaginationItem } from '../entities/pagination/pagination-item';
import { PaginationResult } from '../entities/pagination/pagination-result';
import { DestroyBaseComponent } from './destroy-base.component';

@Component({
  selector: 'app-pagination-base',
  template: '',
})
export abstract class PaginationBaseComponent
  extends DestroyBaseComponent
  implements OnInit, OnDestroy {
  //#region Variables

  public paginationItem: PaginationItem = {
    searchValue: '',
    strategyId: 0,
    pageNumber: 1,
    pageSize: 10,
  };

  public paginationResult: PaginationResult = {
    hasNextPage: false,
    hasPreviousPage: false,

    totalCount: 0,
    pageIndex: 0,
    totalPages: 0,
  } as any;

  public pageLimitOptions = [10, 20, 30, 40, 50, 'all'];

  public rows: number | undefined;

  //#endregion

  //#region Constructor

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  //#endregion

  //#region Events

  first() {
    this.paginationItem = {
      searchValue: this.paginationItem.searchValue,
      strategyId: this.paginationItem.strategyId,
      pageNumber: 1,
      pageSize: this.paginationItem.pageSize,
    };

    this.getPaginatedValues();
  }

  next() {
    if (this.paginationResult.hasNextPage) {
      this.paginationItem = {
        searchValue: this.paginationItem.searchValue,
        strategyId: this.paginationItem.strategyId,
        pageNumber: this.paginationItem.pageNumber + 1,
        pageSize: this.paginationItem.pageSize,
      };

      this.getPaginatedValues();
    }
  }

  previous() {
    if (this.paginationResult.hasPreviousPage) {
      this.paginationItem = {
        searchValue: this.paginationItem.searchValue,
        strategyId: this.paginationItem.strategyId,
        pageNumber: this.paginationItem.pageNumber - 1,
        pageSize: this.paginationItem.pageSize,
      };

      this.getPaginatedValues();
    }
  }

  last() {
    this.paginationItem = {
      searchValue: this.paginationItem.searchValue,
      strategyId: this.paginationItem.strategyId,
      pageNumber: this.paginationResult.totalPages,
      pageSize: this.paginationItem.pageSize,
    };

    this.getPaginatedValues();
  }

  goToPage(pageNumber: number) {
    if (this.paginationItem.pageNumber != pageNumber) {
      this.paginationItem = {
        searchValue: this.paginationItem.searchValue,
        strategyId: this.paginationItem.strategyId,
        pageNumber: pageNumber,
        pageSize: this.paginationItem.pageSize,
      };

      this.getPaginatedValues();
    }
  }

  public isLastPage(): boolean {
    return !this.paginationResult?.hasNextPage;
  }

  public isFirstPage(): boolean {
    return !this.paginationResult?.hasPreviousPage;
  }

  public fillPaginationData(data: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    pageIndex: number;
    totalPages: number;
  }) {
    this.paginationResult.hasNextPage = data.hasNextPage;
    this.paginationResult.hasPreviousPage = data.hasPreviousPage;

    this.paginationResult.totalCount = data.totalCount;
    this.paginationResult.pageIndex = data.pageIndex;
    this.paginationResult.totalPages = data.totalPages;
  }

  pages() {
    let items: number[] = [];
    if (this.paginationResult.hasPreviousPage)
      items.push(this.paginationItem.pageNumber - 1);

    items.push(this.paginationItem.pageNumber);

    if (this.paginationResult.hasNextPage)
      items.push(this.paginationItem.pageNumber + 1);

    return items;
  }

  abstract getPaginatedValues(): any;

  onLimitChange(event: any) {
    this.paginationItem.pageSize =
      event.value != 'all'
        ? (event.value as number)
        : this.paginationResult.totalCount;
    this.paginationItem.pageNumber = 1; // reset the current page
    this.getPaginatedValues();
  }

  preSearch(){
    this.paginationItem.pageNumber = 1; // reset the current page
  }
  //#endregion
}
