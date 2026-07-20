import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { NotificationMessageTypeEnum, NotificationTypeEnum } from "../enums/notification-type";
import { User } from "./users/user";

export class Notification extends BaseEntity<Notification> {
  name: string | undefined
  message: string | undefined
  subject: string | undefined
  type: NotificationTypeEnum | undefined
  messageType: NotificationMessageTypeEnum | undefined
  subjectId: number | undefined
  seen: boolean | undefined

  senderId: number | undefined
  sender: User | undefined

  receiverId: number | undefined
  receiver: User | undefined

  dateCalculation: string | undefined

  constructor(model?: Partial<Notification>) {
    super(model);
  }
}
