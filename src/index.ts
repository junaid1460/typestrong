import { readFileSync } from "fs";
import { parse } from "./ast";

const fileContent = readFileSync(process.argv[2]).toString()

console.time('Compilation');
(async () => {
  await console.log(parse(fileContent))
})().then(
() => console.timeEnd('Compilation')
)


