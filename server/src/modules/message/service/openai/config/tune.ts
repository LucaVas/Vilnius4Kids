/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import config from '../../../../../config';
import openai from './open-ai';

const ai = openai()

async function uploadFile() {
    await ai.files.create({
        file: fs.createReadStream(path.join(__dirname, './tuning.jsonl')),
        purpose: 'fine-tune',
    });
}

async function listFiles() {
    return ai.files.list();
}

const requestData = (training_file: string) => ({
    training_file,
    model: 'gpt-3.5-turbo-0613',
});
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.ai.apiKey}`,
};

async function tune(fileId: string) {
    try {
        const response = await fetch(
            'https://api.openai.com/v1/fine_tuning/jobs',
            {
                method: 'POST',
                headers,
                body: JSON.stringify(requestData(fileId)),
            }
        );
        console.log(await response.json());
    } catch (error) {
        console.error(error);
    }
}

async function fineTune() {
    await uploadFile();
    const files = await listFiles();
    await tune(files.data[0].id);
}

export default fineTune;
