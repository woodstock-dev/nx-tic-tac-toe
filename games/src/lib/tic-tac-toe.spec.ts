
import { Game } from './games'
import { boardToString } from './utils'
import {X, O, TicTacToe, winners,} from './tic-tac-toe'
import { describe, it, expect, beforeAll } from '@jest/globals'

/**
 * This is a simple test case that evaluates the underlying
 * logic of the tic-tac-toe game. 
 */

function printGame(game: Game): string {
    return boardToString(game.state(), (s) => s.avatar);
}

describe('Testing the board and display', () => {
    // Declare the board for all tests
    let game: Game

    // Setup the board
    beforeAll(() => {
        game = new TicTacToe();
    })

    it('Should be an empty board', () => {
        const painted = printGame(game)
        expect(painted).not.toMatch(/X/);
        expect(painted).not.toMatch(/O/);
        console.log(painted);
    });

    it('Should have an X in 0, 0', () => {
        game.move(X, 0);
        const painted = printGame(game)
        expect(painted).toMatch(/| X ||\s[3]|\s[3]|\n/)
        console.log(painted)
        const state = game.isWon();
        expect(state[0]).toBeFalsy();
    });
});

describe('Test winning combinations', () => {

    it('Should be X that wins', () => {
        const game = new TicTacToe();
        game.move(X, 0);
        game.move(X, 1);
        game.move(X, 2);
        const painted = printGame(game)
        expect(painted).toMatch(/| X || X | X |\n/);
        console.log(painted);
        const state = game.state();
        expect(state).toBeTruthy();
        expect(state.spaces[0]).toEqual(X);
    });
    it('Tests all winning combinations', () => {
        winners.forEach(combo => {
            const game = new TicTacToe();
            combo.forEach(v => game.move(X, v))
            expect(game.isWon()[0]).toBeTruthy();
        })
    })

})

describe('Test a tie game', () => {
    it('Be an invalid game', () => {
        const game = new TicTacToe();
        game.move(X, 0);
        game.move(O, 1);
        game.move(X, 2);
        expect(game.isWon()[0]).toBeFalsy();

        game.move(O, 3);
        game.move(X, 4);
        game.move(O, 5);
        expect(game.isWon()[0]).toBeFalsy();

        game.move(O, 6);
        game.move(X, 7);
        game.move(O, 8);
        expect(game.isWon()[0]).toBeFalsy();

        expect(game.isPlayable()).toBeFalsy();
        console.log(printGame(game));
        if (!game.isPlayable()) {
            console.log("tie");
        }
    });
});