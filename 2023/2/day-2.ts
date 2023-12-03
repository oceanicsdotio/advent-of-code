type Session = {
    [name in "red" | "green" | "blue"]: number;
};
interface Game extends Session {
    id: number
}

// Prepared for object conversion
const item = (item: string) => {
    const [count, color] = item.split(" ");
    return [color, parseInt(count, 10)]
}

// Extract session from text data
const session = (data: string): Session =>
    Object.fromEntries(data.split(", ").map(item));

// Reduce sessions into game
const sessions = (game: Game, session: Session): Game => {
    for (const key of Object.keys(game)) {
        if (key in session) {
            const color = key as "red" | "green" | "blue";
            game[color] = Math.max(game[color], session[color]);
        }   
    }
    return game
}

// Convert line into structure game data
const parse = (line: string): Game => {
    const [id, data] = line.split(": ");
    return data.split("; ").map(session).reduce(sessions, {
        id: parseInt(id.replace("Game ", ""), 10),
        red: 0,
        green: 0,
        blue: 0
    });
}

// Find games matching some threshold values
const possible = (possible: Session) => {
    return (game: Game): boolean => {
        return (
            game.red <= possible.red &&
            game.green <= possible.green &&
            game.blue <= possible.blue
        )
    }
}

// Summary stat
const power = (game: Game): number => game.red * game.green * game.blue;

function main () {
    const {readFileSync} = require("fs");
    const lines: string[] = readFileSync("./day-2.txt", {"encoding": "utf8", flag: "r"}).split("\n");
    const games = lines.filter(line => line.length > 0).map(parse);
    const _filter = possible({
        red: 12,
        green: 13,
        blue: 14
    });
    console.log({
        total: games.filter(_filter).reduce((acc, {id}) => acc + id, 0),
        power: games.map(power).reduce((acc, cur) => acc + cur, 0)
    });
}

main()