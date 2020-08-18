import { readFileSync } from 'fs';
import { parser } from './nearly.parser';

const fileContent = readFileSync(process.argv[2]).toString();

console.time('Compilation');
(async () => {
    parser.feed(fileContent);
    console.log(parser.results);
})().then(() => console.timeEnd('Compilation'));
