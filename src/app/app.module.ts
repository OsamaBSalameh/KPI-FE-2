import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AdministrationModule } from './modules/administration/administration.module';
import { DesignModule } from './modules/design/design.module';
import { KPIModule } from './modules/kpi/kpi.module';
import { LookupsModule } from './modules/lookups/lookups.module';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './core/auth-service/auth-service';
import { httpInterceptorProviders } from './core/interceptors';
import { NgbDateCustomParserFormatter } from './shared/tools/date-picker-formatter';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'homeNavbar' }
    ]),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    NgxSpinnerModule,

    // our modules
    SharedModule,
    AdministrationModule,
    KPIModule,
    LookupsModule,
    DesignModule
  ],
  providers: [
    AuthService,
    httpInterceptorProviders,
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
