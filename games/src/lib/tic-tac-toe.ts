import { Avatar, 
    Board, 
    Game, 
    Space, 
    EmptyValue } from "./games";

const SPACE = ' '
export const X = 'X' as Avatar;
export const O = 'O' as Avatar;

/**
 * All winning combinations
 */
export const winners = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

export class TicTacToe implements Game {
    currentPlayer: string
    registeredPlayers: Avatar[];
    board: Board

    constructor() {
        this.registeredPlayers = new Array<Avatar>();
        this.currentPlayer = X
        this.board = {
            maxLength: 9,
            rowLength: 3,
            delimiter: '|',
            pad: ' ',
            spaces: new Array<Space>()
        }
        this.reset();
    }

    maxPlayers(): number {
        return 2;
    }

    isWon(): [boolean, EmptyValue | Avatar] {
        for (let i = 0; i < winners.length; i++) {
            const [a, b, c] = winners[i]
            if (this.board.spaces[a].avatar !== SPACE && 
                this.board.spaces[a].avatar === this.board.spaces[b].avatar && 
                this.board.spaces[a].avatar === this.board.spaces[c].avatar) {
                return [true, this.board.spaces[a].avatar]; // Return the symbol of the winner ('X' or 'O')
            }
        }
        return [false, undefined]
    }

    isPlayable(): boolean {
        return this.board.spaces.some(cell => !cell || cell.avatar === SPACE)
    }

    isEmpty(x: number): boolean {
        return !this.board.spaces[x].avatar || this.board.spaces[x].avatar === ' '
    }

    state(): Board {
        return this.board;
    }

    move(avatar: Avatar, x: number) {
        if (x < this.board.maxLength && 
            this.board.spaces[x].avatar === SPACE) {
            this.board.spaces[x].avatar = avatar;
            return true
        }
        return false
    }

    isRegistrationComplete(): boolean {
        return this.maxPlayers() === this.registeredPlayers.length;
    }

    register(avatar: Avatar) {
        this.registeredPlayers.push(avatar);
    }

    reset() {
        for (let i = 0; i<this.board.maxLength; i++) {
            this.board.spaces[i] = {avatar: SPACE} as Space;
        }
    }
}
