import prompt from 'prompt';
import ansiColors from 'ansi-colors';

const message = {
    topic: 'there is a topic',
    title: 'there is a long title',
    message:
        'this message is a long message that should be displayed more than one line this message is a long message that should be displayed more than one line this message is a long message that should be displayed more than one line',
};

const { topic, title, message: msg } = message;

const maxTopicLength = 20;
const maxTitleLength = 20;
const maxMessageLength = 50;

let isTopicTruncated = false;
let isTitleTruncated = false;
let isMessageTruncated = false;

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

const truncatedTopic = truncateText(topic, 'topic');
const truncatedTitle = truncateText(title, 'title');
const truncatedMessage = truncateText(msg, 'message');

console.table([
    { topic: truncatedTopic, title: truncatedTitle, message: truncatedMessage },
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
