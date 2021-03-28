import { Inject, Injectable } from '@nestjs/common';

import { BaseAbstractService } from '@api/core/services/base.abstract.service';

import { IOTA_SERVICE, IotaServiceInterface } from '@api/message/interfaces/iota.service.interface';
import { Message } from '@api/message/entities/message.entity';
import { SendMessageDto } from '@api/message/dtos/send-message.dto';
import { MESSAGE_REPOSITORY, MessageRepositoryInterface } from '@api/message/interfaces/message.repository.interface';
import { MessageServiceInterface } from '@api/message/interfaces/message.service.interface';

/**
 * The message service interface implementation for communicating with the IOTA Tangle.
 */
@Injectable()
export class MessageService extends BaseAbstractService<MessageService> implements MessageServiceInterface {
    constructor(
        @Inject(IOTA_SERVICE)
        private readonly iotaService: IotaServiceInterface,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepositoryInterface
    ) {
        super();
    }

    /**
     * Sends message via IOTA protocol with data from request.
     * @param messageDto The message data to use in creating a message.
     * @returns The resulting message with data from transaction.
     */
    public async sendMessage(messageDto: SendMessageDto): Promise<Message | void> {
        const message = await this.iotaService.sendMessage(this.processMessageData(messageDto));

        // NOTE: The result of this is not returned because the client should still receive a
        // message in the case of a failure to write the data.
        await this.messageRepository.create(message);

        return message;
    }

    /**
     * Processes data from request and prepares it for broadcasting.
     * @param messageData The message data to process.
     * @returns A message containing more necessary necessary data.
     * @internal
     */
    private processMessageData(messageData: SendMessageDto): Message {
        const hasInitializedDate: boolean = 'initiated_at' in messageData;
        return this.messageRepository.prepare(
            new Message({
                ...messageData,
                initiated_at: hasInitializedDate ? new Date(messageData.initiated_at as Date) : new Date(Date.now())
            }),
            [messageData.content as string, messageData.recipient_address]
        );
    }
}
