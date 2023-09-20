import net from 'net';
import prompt from 'prompt';
import ansiColors from 'ansi-colors';

const maxTopicLength = 20;
const maxTitleLength = 20;
const maxMessageLength = 50;

let isTopicTruncated = false;
let isTitleTruncated = false;
let isMessageTruncated = false;

const client = new net.Socket();

client.connect(5050, '127.0.0.1');

client.on('connect', () => {
    console.log('Connected');
    client.write('subscriber');
});

client.on('data', async (data) => {
    if (data.toString().includes('[')) {
        await handleTopics(data);
    } else {
        handleMessages(data);
    }
});

const handleTopics = async (data) => {
    const topics = JSON.parse(data.toString());

    topics.forEach((topic, index) => {
        console.log(`${index + 1}. ${topic}`);
    });
    console.log('0. Exit');
    console.log('Enter topic number to subscribe to: ');
    prompt.start();

    const selectedTopics = [];

    while (true) {
        try {
            const userInput = await getUserInput();
            if (userInput === '0') {
                client.write(JSON.stringify(selectedTopics));
                break;
            }
            selectedTopics.push(topics[userInput - 1]);
        } catch (err) {
            console.log(err);
        }
    }
};

const handleMessages = (data) => {
    const message = JSON.parse(
        data
            .toString()
            .replace(/\\n/g, '\\n')
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, '\\&')
            .replace(/\\r/g, '\\r')
            .replace(/\\t/g, '\\t')
            .replace(/\\b/g, '\\b')
            .replace(/\\f/g, '\\f')
            .replace(/[\u0000-\u0019]+/g, '')
    );

    showMessage(message);
};

const showMessage = async (message) => {
    const { topic, title, message: msg } = message;

    isTopicTruncated = false;
    isTitleTruncated = false;
    isMessageTruncated = false;

    const truncatedTopic = truncateText(topic, 'topic');
    const truncatedTitle = truncateText(title, 'title');
    const truncatedMessage = truncateText(msg, 'message');

    console.table([
        {
            topic: truncatedTopic,
            title: truncatedTitle,
            message: truncatedMessage,
        },
    ]);

    if (isTopicTruncated) {
        await showMenu('topic', topic);
    }

    if (isTitleTruncated) {
        await showMenu('title', title);
    }

    if (isMessageTruncated) {
        await showMenu('message', msg);
    }
};

function truncateText(text, typeOfText) {
    if (typeOfText === 'topic') {
        if (text.length > maxTopicLength) {
            isTopicTruncated = true;
            return text.substring(0, maxTopicLength - 3) + '...';
        }
    } else if (typeOfText === 'title') {
        if (text.length > maxTitleLength) {
            isTitleTruncated = true;
            return text.substring(0, maxTitleLength - 3) + '...';
        }
    } else if (typeOfText === 'message') {
        if (text.length > maxMessageLength) {
            isMessageTruncated = true;
            return text.substring(0, maxMessageLength - 3) + '...';
        }
    }

    return text;
}

async function showMenu(typeOfText, text) {
    console.log(
        `${typeOfText} is too long, do you want to show the full ${typeOfText}?`
    );
    console.log('1. Yes');
    console.log('2. No');
    const userInput = await getUserInput();
    if (userInput === '1') {
        console.log(ansiColors.red.bold('\n' + text + '\n'));
    }
}

async function getUserInput() {
    return new Promise((resolve, reject) => {
        prompt.get(['topic'], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result.topic);
        });
    });
}

client.on('error', (err) => {
    console.log(err);
});

client.on('close', () => {
    console.log('Connection closed');
});
