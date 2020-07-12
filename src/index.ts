import { readFileSync } from "fs";
import { tokenize, TokenType } from "./tokenizer";

const fileContent = readFileSync(process.argv[2]).toString()

console.time('Compilation');
(async () => {
  await console.log(Array.from(tokenize(fileContent)).map(e => {
    return {
      ...e,
      name: TokenType[e.type]
    }
  }))
})().then(
() => console.timeEnd('Compilation')
)


