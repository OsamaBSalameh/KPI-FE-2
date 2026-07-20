import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadModule } from '@iplab/ngx-file-upload';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DeleteModalComponent } from './components/modals/delete-modal/delete-modal.component';
import { HomeNavigatorComponent } from './components/home-page/home-navigator/home-navigator.component';
import { CommentsSectionComponent } from './components/modals/comments-section/comments-section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnitKpiRequestHistoryComponent } from './components/modals/unit-kpi-request-history/unit-kpi-request-history.component';
import { AttachmentManagerComponent } from './components/modals/attachment-manager/attachment-manager.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoginModalComponent } from './components/modals/login-modal/login-modal.component';
import { ForgotPasswordModalComponent } from './components/modals/resetPassword/forgot-password-modal/forgot-password-modal.component';
import { ResetPasswordByTokenModalComponent } from './components/modals/resetPassword/reset-password-by-token-modal/reset-password-by-token-modal.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { DatePickerResolverDirective } from './directives/date-picker-custom-resolver.directive';
import { LabelControlDirective } from './directives/lable-control-name.directive';
import { ProfileManagerComponent } from './components/profile/profile-manager/profile-manager.component';
import { UserSettingsComponent } from './components/profile/user-settings/user-settings.component';
import { BasicInformationComponent } from './components/profile/basic-information/basic-information.component';
import { PasswordManagementComponent } from './components/profile/user-settings/password-management/password-management.component';
import { ProfilePictureManagementComponent } from './components/profile/user-settings/profile-picture-management/profile-picture-management.component';
import { PersonalInformationManagementComponent } from './components/profile/user-settings/personal-information-management/personal-information-management.component';
import { ReLoginModalComponent } from './components/modals/re-login-modal/re-login-modal.component';
import { ReportingCategoryLabelDirective } from './directives/reporting-category-lable.directive';
import { TileNavigatorComponent } from './components/home-page/tile-navigator/tile-navigator.component';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { InputBehaveClassDirective } from './directives/input-behave-class.directive';
import { ConfirmationModalComponent } from './components/modals/confirmation-modal/confirmation-modal.component';
import { MessagesLandPageComponent } from './components/my-messages/messages-land-page/messages-land-page.component';

@NgModule({
  declarations: [
    HeaderComponent,
    NavigationComponent,
    DeleteModalComponent,
    ConfirmationModalComponent,
    HomeNavigatorComponent,
    CommentsSectionComponent,
    UnitKpiRequestHistoryComponent,
    AttachmentManagerComponent,
    LoginModalComponent,
    ForgotPasswordModalComponent,
    ResetPasswordByTokenModalComponent,
    NotificationListComponent,
    DatePickerResolverDirective,
    LabelControlDirective,
    ReportingCategoryLabelDirective,
    CaptchaComponent,
    // Profile Management
    ProfileManagerComponent,
    UserSettingsComponent,
    BasicInformationComponent,
    PasswordManagementComponent,
    ProfilePictureManagementComponent,
    PersonalInformationManagementComponent,
    ReLoginModalComponent,
    TileNavigatorComponent,
    InputBehaveClassDirective,
    MessagesLandPageComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    NgxPermissionsModule.forChild()
  ],
  providers: [],
  exports: [
    HeaderComponent,
    NavigationComponent,
    DeleteModalComponent,
    ConfirmationModalComponent,
    CommentsSectionComponent,
    AttachmentManagerComponent,
    NgxPermissionsModule,
    LoginModalComponent,
    ForgotPasswordModalComponent,
    ResetPasswordByTokenModalComponent,
    NotificationListComponent,
    DatePickerResolverDirective,
    LabelControlDirective,
    ReportingCategoryLabelDirective,
    ReLoginModalComponent,
    ProfilePictureManagementComponent,
    InputBehaveClassDirective
  ]
})
export class SharedModule { }
