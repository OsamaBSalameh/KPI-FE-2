// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Local
  BASE_URL: 'https://localhost:64158/api/',
  currentRoot_URL: 'http://localhost:4200/'

  // Dev
  // BASE_URL: 'https://kpidapi.simah.com/api/',
  // currentRoot_URL: 'https://kpidev.ksacb.com.sa:443/'

  // UAT
  // BASE_URL: 'https://kpiuapi.simah.com/api/',
  // currentRoot_URL: 'https://kpiuat.simah.com/'

  // Prod
  // BASE_URL: 'https://kpiprod.ksacb.com.sa:443/api/',
  // currentRoot_URL: 'http://kpi.ksacb.com.sa/'
};
// https://kpiprod.ksacb.com.sa/swagger/index.html
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
