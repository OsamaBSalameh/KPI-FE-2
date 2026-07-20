export enum HttpErrorTypes {
  Status401_Unauthorized = 401,
  Status403_Forbidden = 403,
  Status500_InternalServerError = 500,
  Status400_BadRequest = 400,
  Status404NotFound = 404,
  Status405_MethodNotAllowed = 405,
  Status406_NotAcceptable = 406,
  Status412PreconditionFailed = 412,
  Status409Conflict = 409,
  Status424FailedDependency = 424
}

export enum UserRoles {
  DATA_CUSTADION = "DATA_CUSTADION",
  DATA_SPONSER = "DATA_SPONSER",
  SUPER_ADMIN="SUPER_ADMIN",
  WORK_SPACE_ADMIN = "WORK_SPACE_ADMIN",
  CEO = "CEO",
  KPI_OWNER = "KPI_OWNER"
}