import { ActionType } from "../enums/action-type"

export class BaseModal {
  modalReference: any = {}
  data: any = {}
  actionType: ActionType | undefined
}

export class BaseCustomModal {
  modalReference: any = {}
  data: any = {}
  actionType: ActionType | undefined
  customInfo: any
}