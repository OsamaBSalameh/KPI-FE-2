import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import {
  LastMessagesWithUnSeenCount,
  Message,
} from 'src/app/shared/entities/message';
import { User } from 'src/app/shared/entities/users/user';
import { MessageService } from 'src/app/shared/services/messages.service';
import { isNullOrUndefinedOrWhiteSpace } from 'src/app/shared/tools/base-tools';

@Component({
  selector: 'app-messages-land-page',
  templateUrl: './messages-land-page.component.html',
  styleUrls: ['./messages-land-page.component.css'],
})
export class MessagesLandPageComponent implements OnInit, AfterViewInit {
  //#region Variables
  @ViewChild('chatBox') private chatBox!: ElementRef;

  searchValue: string = '';
  allMessages: LastMessagesWithUnSeenCount[] = [];
  searchedMessages: LastMessagesWithUnSeenCount[] = [];
  selectedMessages: Message[] = [];
  currentUser: User = new User();
  otherUserSelected: {
    fullName: string | undefined;
    userImage: string | undefined;
    userId: number | undefined;
  } = {
    fullName: '',
    userImage: '',
    userId: 0,
  };

  messageText: string | undefined = '';
  //#endregion

  //#region Constructor
  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.initMessages();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToLastMessage(), 0);
  }
  //#endregion

  //#region Events
  userSelected(message: LastMessagesWithUnSeenCount) {
    this.allMessages.map((mes) => (mes.selected = false));
    var selectedUser = this.allMessages.filter(
      (m) => m.otherUserId == message.otherUserId
    )[0];
    selectedUser.selected = true;
    this.otherUserSelected.fullName = selectedUser.otherUserFullName;
    this.otherUserSelected.userImage = selectedUser.userImage;
    this.otherUserSelected.userId = selectedUser.otherUserId;

    this.messageService
      .getMessagesWithExactUser(message.otherUserId as number)
      .subscribe((res: any) => {
        this.selectedMessages = res.map(
          (model: Partial<Message> | undefined) => {
            return new Message({ model: model, image: message.userImage });
          }
        );

        // make msgs is Seen
        this.allMessages
          .filter((m) => m.otherUserId == message.otherUserId)
          .map((msg) => {
            msg.isSeen = false;
            msg.unreadCount = 0;
          });
        this.searchedMessages
          .filter((m) => m.otherUserId == message.otherUserId)
          .map((msg) => {
            msg.isSeen = false;
            msg.unreadCount = 0;
          });

        setTimeout(() => this.scrollToLastMessage(), 0);
      });
  }

  search() {
    this.searchedMessages = isNullOrUndefinedOrWhiteSpace(this.searchValue)
      ? this.allMessages
      : this.allMessages.filter((m) =>
          m.otherUserFullName
            ?.toLowerCase()
            .trim()
            ?.includes(this.searchValue.toLowerCase().trim())
        );
  }

  sendMessage() {
    if (isNullOrUndefinedOrWhiteSpace(this.messageText)) {
      this.messageService.warningToaster('Please write your message first');
      return;
    }

    this.messageService
      .AddMessage(
        this.messageText as string,
        this.otherUserSelected.userId as number
      )
      .subscribe({
        next: () => {
          this.messageService.successToaster('Sent successfully');
          this.messageService
            .getMessagesWithExactUser(this.otherUserSelected.userId as number)
            .subscribe((res: any) => {
              this.selectedMessages = res.map(
                (model: Partial<Message> | undefined) =>
                  new Message({
                    model: model,
                    image: this.otherUserSelected.userImage,
                  })
              );
              setTimeout(() => this.scrollToLastMessage(), 0);

              //#region Update the last message with the user
              this.messageService
                .getLastMessagesWithUnSeenCount()
                .subscribe((res: any) => {
                  this.allMessages = res.map(
                    (
                      message: Partial<LastMessagesWithUnSeenCount> | undefined
                    ) => {
                      return new LastMessagesWithUnSeenCount(message);
                    }
                  );

                  this.allMessages[0].selected = true;
                  this.searchedMessages = this.allMessages;
                  this.userSelected(this.searchedMessages[0]);
                });
              //#endregion

              this.messageText = '';
              this.searchValue = '';
            });
        },
        error: () => {
          this.messageService.errorToaster(
            'Failed to send the message, try again'
          );
        },
      });
  }
  //#endregion

  //#region Private
  private initUser() {
    this.currentUser = this.authService.getUserInfo();
  }

  private initMessages() {
    this.messageService
      .getLastMessagesWithUnSeenCount()
      .subscribe((res: any) => {
        this.allMessages = res.map(
          (message: Partial<LastMessagesWithUnSeenCount> | undefined) => {
            return new LastMessagesWithUnSeenCount(message);
          }
        );
        this.allMessages[0].selected = true;
        this.searchedMessages = this.allMessages;
        this.userSelected(this.searchedMessages[0]);
      });
  }

  private scrollToLastMessage() {
    const element = this.chatBox.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
  //#endregion
}
