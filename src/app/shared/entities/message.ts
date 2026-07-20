import { BaseEntity } from 'src/app/core/base-entity/base-entity';
import { User } from './users/user';
import { isNullOrUndefined } from '../tools/base-tools';

export class Message extends BaseEntity<Message> {
  content: string | undefined;
  sendAt: Date | undefined;
  seenAt: Date | undefined;
  isSeen: boolean | undefined;

  senderId: number | undefined;
  receiverId: number | undefined;
  otherUserImage: string | undefined;

  constructor({ model, image }: { model?: Partial<Message>; image: string | undefined; }) {
    super(model);
    if (model) Object.assign(this, model);
    this.otherUserImage = isNullOrUndefined(image)
    ? '../../../../assets/images/userImage2.png'
    : image;
  }
}

export class LastMessagesWithUnSeenCount {
  otherUserId: number | undefined;
  otherUserFullName: string | undefined;
  lastMessage: string | undefined;
  sendAt: Date | undefined;
  unreadCount: number | undefined;
  userImage: string | undefined;
  isSeen: boolean | undefined;
  selected: boolean | undefined;

  constructor(model?: Partial<LastMessagesWithUnSeenCount>) {
    if (model) Object.assign(this, model);
    this.userImage = isNullOrUndefined(this.userImage)
      ? '../../../../assets/images/userImage2.png'
      : 'data:image/png;base64,' + this.userImage;
  }
}
