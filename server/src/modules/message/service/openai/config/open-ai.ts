import OpenAI from 'openai';
import config from '../../../../../config';

export default function buildAi() {
    return new OpenAI({
        apiKey: config.ai.apiKey,
    });
}

// If you wish to fine tune, uncomment the following lines
// import fineTune from './tune';
// fineTune();
