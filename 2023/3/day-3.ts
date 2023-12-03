type Interval = [number, number];
type Partition = [Interval[], Interval[]];
interface Scan {
    line: string
    numbers: Interval[]
    symbols: number[]
}

const numbers = (line: string): Interval[] => {
    const numberRegex = new RegExp("([0-9]+)", "gi");
    return [...line.matchAll(numberRegex)].map(
        (item) => {
            let index = item.index as number;
            return [index, index + item[0].length - 1]
        }
    );
}

const symbols = (line: string): number[] => {
    const symbolRegex = new RegExp("[^A-Za-z0-9\.]", "gi")
    return [...line.matchAll(symbolRegex)].flatMap(
        (item) => item.index as number
    );
}

// Separate some intervals by whether they intersect with a symbol
const partition = (numbers: Interval[], by_symbols: number[]) => {
    const intersects = ([start, end]: Interval) => 
        by_symbols.map((index: number) => index >= start - 1 && index <= end + 1);
    const reducer = ([pass, fail]: Partition, interval: Interval): Partition =>{
        const hits = intersects(interval);
        return hits.some(x => x) ? [[...pass, interval], fail] : [pass, [...fail, interval]];
    }
    return numbers.reduce(reducer, [[], []]);
}

// Convenience for parsing into final part numbers
const convert = (line: string) => 
    ([start, end]: Interval): number => {
        const substring = line.slice(start, end + 1);
        const numeric = parseInt(substring, 10);
        if (isNaN(numeric)) {
            console.log("invalid conversion", substring, "of", line);
        }
        return parseInt(line.slice(start, end + 1), 10);
    }

function main() {
    const lines: string = require("fs").readFileSync(
        "./day-3-sample.txt", 
        {encoding: "utf8", flag: "r"}
    ).split("\n");

    let previous: Scan|undefined;
    let parts: number[] = [];

    for (let ii=0; ii<lines.length; ii++) {
        const current = {
            line: lines[ii],
            numbers: numbers(lines[ii]),
            symbols: symbols(lines[ii])
        };

        // find current indices intersecting current symbols
        const [accept, retry] = partition(current.numbers, current.symbols);
        parts.push(...accept.map(convert(current.line)));

        if (typeof previous === "undefined") {
            current.numbers = retry;
        } else {
            // find current indices intersecting previous symbols
            const [lookback, store] = partition(retry, previous.symbols);
            parts.push(...lookback.map(convert(current.line)));
            current.numbers = store;

            // find previous indices intersecting current symbols, with discard
            const [result, _] = partition(previous.numbers, current.symbols);
            parts.push(...result.map(convert(previous.line)));

            // Last item check
            if (ii === lines.length - 1) {
                parts.push(...store.map(convert(current.line)));
            }
        }
        previous = current;
    }
    console.log({
        parts,
        total: parts.reduce((acc, cur) => acc + cur)
    })
}

main()