import { fakeMessage } from '@server/entities/tests/fakes';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import buildGenerator from '../generator';
import { fakeAi } from '../../../chat/test/fakes';

const generator = buildGenerator(fakeAi('test'));

describe('Chat generator', async () => {
    it('Generator returns an answer', async () => {
        const messages = [fakeMessage()] as ChatCompletionMessageParam[];
        const response = await generator.generateResponse(messages);

        expect(response).not.toBeNull();
        expect(response?.content).toEqual('test');
        expect(response?.role).toEqual('assistant');
    });
});
