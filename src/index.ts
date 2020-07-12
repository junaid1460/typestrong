import { readFileSync } from "fs";
import { tokenize, TokenType } from "./toknizer";

const fileContent = readFileSync(process.argv[2]).toString()

console.time('Compilation');
(async () => {
  await console.log(Array.from(tokenize(fileContent)).map(e => {
    return {
      ...e,
      name: TokenType[e.type]
    }
  }))
  debugger
})().then(
() => console.timeEnd('Compilation')
)


