import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MessageRoutingModule } from '@web/message/message-routing.module';
import { CreateMessagePage } from '@web/message/pages/create-message-page/create-message.page';

/**
 * The message module containing necessary configuration.
 */
@NgModule({
    declarations: [
        CreateMessagePage
    ],
    imports: [
        CommonModule,
        MessageRoutingModule,
        ReactiveFormsModule
    ],
    exports: [],
    providers: []
})
export class MessageModule { }
