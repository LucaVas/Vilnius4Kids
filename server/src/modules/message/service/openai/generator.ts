/* eslint-disable no-console */
/* eslint-disable no-constant-condition */

import {
    ChatCompletionAssistantMessageParam,
    ChatCompletionMessageParam,
} from 'openai/resources/index.mjs';
import OpenAI from 'openai';

export default (ai: OpenAI) => ({
    async generateResponse(
        history: ChatCompletionMessageParam[]
    ): Promise<ChatCompletionAssistantMessageParam | null> {
        let response = null;
        try {
            response = await getAnswer(ai, history);
        } catch (error) {
            console.log(error);
        }
        return response;
    },
});

async function getAnswer(
    ai: OpenAI,
    messages: ChatCompletionMessageParam[]
): Promise<ChatCompletionAssistantMessageParam | null> {
    const completion = await ai.chat.completions.create({
        messages,
        model: 'gpt-3.5-turbo',
    });
    return {
        role: 'assistant',
        content: completion.choices[0].message.content,
    };
}
