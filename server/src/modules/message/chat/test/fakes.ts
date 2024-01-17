import OpenAI from 'openai';

export const fakeAi = (content: string | null) =>
    ({
        chat: {
            completions: {
                create: () => ({
                    choices: [{ message: { content } }],
                }),
            },
        },
    }) as unknown as OpenAI;
