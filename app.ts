import * as cspellConfig from './cspell.json';
import * as fs from "fs";
interface Range {
    line: number | null;
    startIdx: number;
    endIdx: number;
}
interface SpellingMistake {
    range: Range;
    original: string;
    advices: string[];
}
const checkSpelling = (md: string): SpellingMistake[] => {
    const words = md.split(" ");                          // - разделяем строку по пробелам и создаем массив
    const spellingmistakes: SpellingMistake[] = [];
    for (let i = 0; i < words.length; i++) {              // - в цикле перебираем все слова в строке
        const smallwords = words[i].trim();
        const word = NoPunctuation(smallwords);           // - вызываем метод для избавления от знаков препинания
        if (cspellConfig.words.includes(word) === false) { // - если 'cspell.json' не содержит проверяемое слов, то
            const range: Range = {                        // - создаем переменную, которая является объектом и сохраянем туда
                line: FindIndexInLine(md, word),          // - номер строки, в которой содержится слов(начинается их подчсет с 1)
                startIdx: md.indexOf(word),               // - индекс начала слова
                endIdx: md.lastIndexOf(word) + word.length - 1 // - индекс конца слова
            };
            const advices = FindStroks(word, cspellConfig.words); // - поиск схожих строк
            const mistake: SpellingMistake = {            // - записываем в объект данные 
                range,
                original: word,
                advices
            };
            spellingmistakes.push(mistake);               // - закидываем сам объект в массив
        }
    }
    return spellingmistakes;
}
function FindIndexInLine(stroka: string, find: string): number | null { // - ищет номер строки
    const lines = stroka.split(" \n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(find)) {
            return i + 1;
        }
    }
    return null;
}
function FindStroks(word: string, words: string[]): string[] { // - возвращает массив строк, которые похожи на входящую строку
    const findstroks: string[] = [];
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
function NoPunctuation(word: string): string { // - избавляет строку от знаков препинания
    let newword: string = "";
    let punctuation: string[] = ["!", ",", ".", "?", "/", ";", ":", "-"];
    for (const letters of word) {
        let find: Boolean = true;
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
function NewWordForcspell(word: string): void { // - добавление новых слов в "cspell"
    let punctuation: string[] = ["!", ",", ".", "?", "/", ";", ":", "-"];
    let find: Boolean = true;
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
const spellingMistakes: SpellingMistake[] = checkSpelling(md);
console.log(spellingMistakes);
//console.log(NewWordForcspell("bebra"));