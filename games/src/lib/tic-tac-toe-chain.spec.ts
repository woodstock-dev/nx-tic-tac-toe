import { Context, CommandBuilder, ChainBuilder, ContextBuilder } from "@examples/chain";
import { Avatar, Board, Game, Space } from "./games";
import PublishSubscribe from './pub_sub'
import { O, TicTacToe, X } from "./tic-tac-toe";
import { boardToString } from "./utils";

type PlayerMove = {
    avatar: Avatar
    space: number
}

class Move {
    static build = (avatar: Avatar, space: number) => {
        return {avatar: avatar, space: space} as PlayerMove;
    }
}

function printGame(game: Game): string {
    return boardToString(game.state(), (s) => s.avatar);
}

const validateMove = CommandBuilder.build((context: Context) => {
    const action = context.get('action') as string;
    const move = context.get("move") as PlayerMove
    const game = context.get("game") as Game
    if (move && game && game.isPlayable() && action && action === 'move' && game.isEmpty(move.space)) {
        return true;
    } else {
        context.put('next_action', 'retry');
        return false;
    }
});

const move = CommandBuilder.build((context: Context) => {
    const move = context.get("move") as PlayerMove;
    const game = context.get("game") as Game;
    console.log(`moving ${move.avatar} to ${move.space}`);
    game.move(move.avatar, move.space);
    context.put('next_action', 'next_move');
    return true;
});

const evaluate = CommandBuilder.build((context: Context) => {
    const game = context.get("game") as Game;
    if (game.isWon()) {
        context.put('next_action', 'game_won');
    }
    return true;
});

const actionPublisher = CommandBuilder.build((context: Context) => {
    let nextAction = context.get('next_action') as string;
    let ps = context.get('pubsub') as PublishSubscribe;
    if (!nextAction) {
        nextAction = 'waiting';
    }
    if (ps) {
        ps.publish(nextAction, context);
    }
    return true;
})

const moveChain = ChainBuilder.build(false, [validateMove, move]);
const playChain = ChainBuilder.build(true, [moveChain, evaluate, actionPublisher]);

describe('A game played with a chain and scubscribers', () => {
    let pubsub: PublishSubscribe
    let av1: Avatar 
    let av2: Avatar
    let game: Game

    const getContext = () => {
        const ctx = ContextBuilder.build();
        ctx.put('pubsub', pubsub);
        ctx.put('game', game);
        return ctx;
    }

    beforeAll(() => {
        pubsub = new PublishSubscribe();
        av1 = X;
        av2 = O;
        game = new TicTacToe();

        pubsub.subscribe("move", (data: unknown) => {
            console.log('Moving')
        })
    })

    it('av1 moves to center square', () => {
        const ctx = getContext();
        ctx.put('move', Move.build(av1, 4));
        expect(playChain.execute(ctx)).toBeTruthy();
        console.log(printGame(game))
    })

    it('av2 moves to square 0', () => {
        const ctx = getContext();
        ctx.put('move', Move.build(av2, 0));
        expect(playChain.execute(ctx)).toBeTruthy();
        console.log(printGame(game))
    })

    it('fails because the space is taken', () => {
        const ctx = getContext();
        ctx.put('move', Move.build(av1, 0));
        expect(playChain.execute(ctx)).toBeTruthy();
        console.log(printGame(game));
    })
})