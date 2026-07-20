import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { HomeNavigatorComponent } from './components/home-page/home-navigator/home-navigator.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { ProfileManagerComponent } from './components/profile/profile-manager/profile-manager.component';
import { MessagesLandPageComponent } from './components/my-messages/messages-land-page/messages-land-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeNavigatorComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN', 'WORK_SPACE_ADMIN', 'CEO', 'KPI_OWNER', 'DATA_CUSTADION', 'DATA_SPONSER'],
        redirectTo: '/login',
        // default: '/login'
      },
    },
  },
  {
    path: 'notifications',
    component: NotificationListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN', 'WORK_SPACE_ADMIN', 'CEO', 'KPI_OWNER', 'DATA_CUSTADION', 'DATA_SPONSER'],
        redirectTo: '/homeNavbar',
        // default: '/login'
      },
    },
  },
  {
    path: 'profile',
    component: ProfileManagerComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN', 'WORK_SPACE_ADMIN', 'CEO', 'KPI_OWNER', 'DATA_CUSTADION', 'DATA_SPONSER'],
        redirectTo: '/homeNavbar',
        // default: '/login'
      },
    },
  },
  {
    path: 'messages',
    component: MessagesLandPageComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN', 'WORK_SPACE_ADMIN', 'CEO', 'KPI_OWNER', 'DATA_CUSTADION', 'DATA_SPONSER'],
        redirectTo: '/homeNavbar',
        // default: '/login'
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
