import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModalComponent } from './shared/components/modals/login-modal/login-modal.component';

const routes: Routes = [
  {
    path: 'homeNavbar',
    loadChildren: () => import('../app/shared/shared.module').then(module => module.SharedModule),
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: ['SPMO', 'CEO', 'KPI_OWNER', 'DATA_CUSTADION', 'DATA_SPONSER'],
    //     redirectTo: '/login'
    //   }
    // }
  },
  {
    path: 'login',
    component: LoginModalComponent
  },
  // {
  //   path: 'resetPassword',
  //   component: ForgotPasswordModalComponent
  // },
  // {
  //   path: 'resetPasswordByToken',
  //   component: ResetPasswordByTokenModalComponent
  // }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
