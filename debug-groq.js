
import fs from 'fs';
import Groq from 'groq-sdk';

const envFile = fs.readFileSync('.env', 'utf8');
const match = envFile.match(/VITE_GROQ_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : '';

console.log('Testing API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND');

if (!apiKey) {
    console.error('API Key not found in .env');
    process.exit(1);
}

const groq = new Groq({ apiKey });

async function test() {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say hello' }],
            model: 'llama-3.3-70b-versatile',
        });
        console.log('Success:', chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
