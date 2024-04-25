import { Space, Board, Avatar, EmptyValue } from "./games";


export const boardToString = (board: Board, 
    formatter: (space: Space) => Avatar | EmptyValue): string => {
    let out = '';
    board.spaces.forEach((s, i) => {
        if (i%board.rowLength===0) {
            out += "\n"+board.delimiter;
        }
        out += board.pad + formatter(s) + board.pad + board.delimiter;
    })
    return out;
}
