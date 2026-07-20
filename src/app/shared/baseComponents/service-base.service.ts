import { HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService implements OnInit, OnDestroy {

  baseUrl: string;
  httpOptions: any;

  constructor() {
    this.baseUrl = environment.BASE_URL;

    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Accept": "application/octet-stream"
        // 'Authorization': "my-auth-token"
      })
    };
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

}