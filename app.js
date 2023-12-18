"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cspellConfig = require("./cspell.json");
const fs = require("fs");
const checkSpelling = (md) => {
    const words = md.split(" "); // - ��������� ������ �� �������� � ������� ������
    const spellingmistakes = [];
    for (let i = 0; i < words.length; i++) { // - � ����� ���������� ��� ����� � ������
        const smallwords = words[i].trim();
        const word = NoPunctuation(smallwords); // - �������� ����� ��� ���������� �� ������ ����������
        if (cspellConfig.words.includes(word) === false) { // - ���� 'cspell.json' �� �������� ����������� ����, ��
            const range = {
                line: FindIndexInLine(md, word),
                startIdx: md.indexOf(word),
                endIdx: md.lastIndexOf(word) + word.length - 1 // - ������ ����� �����
            };
            const advices = FindStroks(word, cspellConfig.words); // - ����� ������ �����
            const mistake = {
                range,
                original: word,
                advices
            };
            spellingmistakes.push(mistake); // - ���������� ��� ������ � ������
        }
    }
    return spellingmistakes;
};
function FindIndexInLine(stroka, find) {
    const lines = stroka.split(" \n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(find)) {
            return i + 1;
        }
    }
    return null;
}
function FindStroks(word, words) {
    const findstroks = [];
    for (const cspell of words) {
        let index = 0;
        let count = 0;
        for (let i = 0; i < word.length; i++) {
            if (word[i] == cspell[index]) {
                count++;
            }
            index++;
            if (index == cspell.length) {
                break;
            }
        }
        if (count >= word.length / 2) {
            findstroks.push(cspell);
        }
    }
    if (findstroks.length == 0) {
        findstroks.push("no similar words found");
    }
    return findstroks;
}
function NoPunctuation(word) {
    let newword = "";
    let punctuation = ["!", ",", ".", "?", "/", ";", ":", "-"];
    for (const letters of word) {
        let find = true;
        for (const dot of punctuation) {
            if (letters === dot) {
                find = false;
                break;
            }
        }
        if (find === true) {
            newword += letters;
        }
    }
    return newword;
}
function NewWordForcspell(word) {
    let punctuation = ["!", ",", ".", "?", "/", ";", ":", "-"];
    let find = true;
    for (const letters of word) {
        for (const dot of punctuation) {
            if (letters === dot) {
                find = false;
                break;
            }
        }
    }
    if (find === true) {
        cspellConfig.words.push(word);
        console.log("word added");
        const newword = JSON.stringify(cspellConfig);
        fs.writeFileSync("cspell.json", newword);
    }
}
const md = `hallo, byr, rust, 
\nbebr, hyvy, 
\ncspall`;
const spellingMistakes = checkSpelling(md);
console.log(spellingMistakes);
//console.log(NewWordForcspell("bebra"));
//# sourceMappingURL=app.js.map