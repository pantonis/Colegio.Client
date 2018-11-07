﻿import { Component, Injector, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { LoginService } from './login.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { MessageService } from 'abp-ng2-module/dist/src/message/message.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.less',
        './login.component.css'
    ],

    animations: [accountModuleAnimation()]
})
export class LoginComponent extends AppComponentBase {

    @ViewChild('cardBody') cardBody: ElementRef;

    submitting: boolean = false;
    confirmado: boolean  = false;
    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _messageService: MessageService,
        private _router: Router,
        private _sessionService: AbpSessionService,
        
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        // $(this.cardBody.nativeElement).find('input:first').focus();
    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }

        return true;
    } 

    login(): void {
        {
            alert(this._messageService.confirm(
                'Se iniciara session',
                'Estas seguro?',
                function () {
                    this.submitting = true;
                    this.loginService.authenticate(
                        () => this.submitting = false
                    );
                }
            ));


            
        }
    }
}
