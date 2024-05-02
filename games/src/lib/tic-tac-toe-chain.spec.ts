import { Context, CommandBuilder, ChainBuilder, ContextBuilder } from "@examples/chain";
import { Avatar, Board, Game, Space } from "./games";
import PublishSubscribe from './pub_sub'
import { O, TicTacToe, X } from "./tic-tac-toe";

type PlayerMove = {
    avatar: Avatar
    space: number
}

export const whoGoesFirst = CommandBuilder.build((context: Context) => {
    return true;
});

const validateMove = CommandBuilder.build((context: Context) => {
    const move = context.get("move") as PlayerMove
    const game = context.get("game") as Game
    return move && game && game.isPlayable() && game.isEmpty(move.space)
});

const move = CommandBuilder.build((context: Context) => {
    return true;
});

const moveChain = ChainBuilder.build(false, [validateMove, move]);

const playChain = ChainBuilder.build(true, [moveChain]);

describe('A game played with a chain and scubscribers', () => {
    let pubsub: PublishSubscribe
    let av1: Avatar 
    let av2: Avatar
    let game: Game

    beforeAll(() => {
        pubsub = new PublishSubscribe();
        av1 = X;
        av2 = O;
        game = new TicTacToe();
    })

    it('av1 moves to center square', () => {
        const ctx = ContextBuilder.build();
        ctx.put('move', {avatar: av1, space: 4} as PlayerMove);
        ctx.put('game', game);
        
        playChain.execute(ctx);
    })
})