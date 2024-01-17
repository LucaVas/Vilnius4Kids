import { ChatMessage } from '@server/entities/message/schema';
import { TRPCError } from '@trpc/server';
import {
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
} from 'openai/resources/index.mjs';
import { AuthUser } from '@server/shared/entities';
import { DataSource } from 'typeorm';
import OpenAI from 'openai';
import buildRepository from './repository';
import buildGenerator from './generator';

const FIRST_MESSAGE: ChatCompletionSystemMessageParam = {
    role: 'system',
    content:
        'You are a chatbot which is created with the sole purpose to help users with room interior design. Any question related to room interior design, you should answer. If the question is not related to room interior design, you should inform the user that you are not able to answer the question.',
};

export default (db: DataSource, authUser: AuthUser, ai: OpenAI) => ({
    repository: buildRepository(db, authUser),
    generator: buildGenerator(ai),

    async run(content: string) {
        const newMessage = {
            role: 'user',
            content,
        } as ChatCompletionUserMessageParam;

        const history = await this.repository.getHistory();

        const isFirstMessage = history.length === 0;

        if (isFirstMessage) {
            history.push(FIRST_MESSAGE);
        }

        history.push(newMessage);

        const chatResponse = await this.generator.generateResponse(history);
        if (!chatResponse || !chatResponse?.content)
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Something went wrong: assistant's response is empty.",
            });

        const messagesToSave = [
            {
                user: authUser,
                ...newMessage,
            },
            {
                user: authUser,
                ...chatResponse,
            },
        ] as ChatMessage[];

        await this.repository.saveMessages(
            isFirstMessage
                ? [{ ...FIRST_MESSAGE, user: authUser }, ...messagesToSave]
                : messagesToSave
        );

        return chatResponse.content;
    },
});
