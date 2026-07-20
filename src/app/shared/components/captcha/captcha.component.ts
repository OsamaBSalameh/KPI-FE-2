import { Component, OnInit, AfterViewInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedService } from '../../services/shared.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[captchaSelector]',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
})
export class CaptchaComponent implements OnInit, AfterViewInit {
  @Input()
  form!: FormGroup;
  @Input()
  controlName!: string;
  @Input() config: any;
  @Input() isPasswordEncrypted = false;
  @Input() isSubmitted = false;

  @Output() serverObj = new EventEmitter();

  cap!: ElementRef;
  allowToGenerate = true;
  // captchaClass = 'input-group-text';
  @ViewChild('cap') set content(content: ElementRef) {
    if (content) {
      // initially setter gets called with undefined
      this.cap = content;
    }
  }

  get captchaControl() {
    return this.form && this.controlName ? this.form.get(this.controlName) : null;
  }

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.config.requestKey = this.config.requestKey;
  }

  ngAfterViewInit(): void {
    // this.refreshCaptcha();
  }

  refreshCaptcha = (fromClick: boolean = false) => {
    if (this.config && this.allowToGenerate) {
      // this.captchaClass = 'input-group-text disable-captcha ';
      //  this.config.imageUrl = undefined;
      // this.cap.nativeElement.disabled = true;
      this.captchaControl?.disable({
        emitEvent: true,
      });
      this.allowToGenerate = false;
      this.sharedService.getCaptcha(this.config.requestKey).subscribe(
        (res: any) => {
          if (res) {
            const captchaImg = res.img || res;
            this.config.imageUrl = 'data:image/png;base64,' + captchaImg;
            this.captchaControl?.setValue(null);
            this.serverObj.emit({ serverNonce: res.nksp, g: res.g });
            this.captchaEnable();
            setTimeout(() => {
              // this.cap.nativeElement.disabled = false;
              if (fromClick) {
                this.cap.nativeElement.focus();
              }
            }, 0);
          } else {
            this.sharedService.errorToaster(res.error);
            // this.cap.nativeElement.disabled = false;
            this.captchaEnable();
          }
        },
        (err: any) => {
          this.sharedService.errorToaster(err.error);
          this.captchaEnable();
        }
      );
    }
  };

  captchaEnable = () => {
    // this.captchaClass = 'input-group-text';
    this.allowToGenerate = true;
    this.captchaControl?.enable({
      emitEvent: true,
    });
  };
}
