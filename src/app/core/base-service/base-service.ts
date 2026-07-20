import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { map, Observable } from "rxjs";
import { PaginationItem } from "src/app/shared/entities/pagination/pagination-item";
import { environment } from "src/environments/environment";
import { BaseEntity } from "../base-entity/base-entity";

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService<T extends BaseEntity<T>> {
  httpOptions: any;
  protected apiUrl = environment.BASE_URL;

  //#region Constructor

  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/octet-stream',
        // 'Authorization': "my-auth-token"
      }),
    };
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  //#endregion

  //#region Basic Crud

  public add(resource: Partial<T> & { toJson: () => T }): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}`, resource.toJson());
  }

  public getValuesPaginated(data: PaginationItem): Observable<T[]> {
    let params = new HttpParams()
      .set('SearchValue', data.searchValue.toString())
      .set('PageNumber', data.pageNumber.toString())
      .set('PageSize', data.pageSize.toString());

    return this.httpClient
      .get<T[]>(`${this.apiUrl}/GetAllPaginated`, {
        headers: this.httpOptions,
        params,
      })
      .pipe(map((result) => result));
  }

  public getById(id: number): Observable<T> {
    return this.httpClient
      .get<T>(`${this.apiUrl}/${id}`)
      .pipe(map((result) => result));
  }

  public get(): Observable<T[]> {
    return this.httpClient
      .get<T[]>(`${this.apiUrl}`)
      .pipe(map((result) => result));
  }

  public update(resource: Partial<T> & { toJson: () => T }): Observable<T> {
    return this.httpClient
      .put<T>(`${this.apiUrl}`, resource.toJson())
      .pipe(map((result) => result));
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  public successToaster(data: string): void {
    this.toastrService.success(data);
  }

  public errorToaster(data: string): void {
    this.toastrService.error(data);
  }

  public warningToaster(data: string): void {
    this.toastrService.warning(data);
  }

  //#endregion
}
