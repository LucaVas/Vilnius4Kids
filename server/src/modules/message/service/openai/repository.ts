import { Message } from '@server/entities';
import { AuthUser } from '@server/shared/entities';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { DataSource } from 'typeorm';
import { ChatMessage } from '../../../../entities/message/schema';

export default (db: DataSource, authUser: AuthUser) => ({

    repository: db.getRepository(Message),

    async getHistory() {
        return (await this.repository.find({
            where: { user: authUser },
            select: { role: true, content: true },
        })) as ChatCompletionMessageParam[];
    },

    async saveMessages(messages: ChatMessage[]): Promise<void> {
        await this.repository.save(messages);
    },
});
