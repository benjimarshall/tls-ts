import * as fs from "fs";

const sampleTextPath = "data/SampleText.txt";

function readSampleText(): string {
    return fs.readFileSync(sampleTextPath, "utf8");
}

function naiveTls(input: string): number {
    const inputArray = [...input];

    let counter = 0;
    for (let i = 0; i < inputArray.length - 2; i++) {
        if (inputArray[i].toLowerCase() === "t"
            && inputArray[i + 1].toLowerCase() === "r"
            && inputArray[i + 2].toLowerCase() === "a") {

            counter++;
        }
    }

    return counter;
}

console.log(naiveTls(readSampleText()));
