import { Board, X, boardToString } from '@examples/games';
import axios, { HttpStatusCode } from 'axios';
 

describe('Play a game of tic-tac-toe', () => {
  const gameID = 't3'

  let gameBoard: Board
  let instanceId: string;

  function printGameBoard() {
    console.log(boardToString(gameBoard, (s) => s.avatar));
  }

  beforeAll(async () => {
    const res = await axios.post(`/games/${gameID}`);
    expect(res.status).toBe(HttpStatusCode.Created);
    const {gameId, board} = res.data;
    expect(gameId).toBeTruthy();
    expect(board).toBeTruthy();
    
    instanceId = gameId;
    gameBoard = board;
    printGameBoard();
  })

  it('Should have a game id and board', () => {
    expect(gameBoard).toBeTruthy();
    expect(instanceId).toBeTruthy();
  });

  it('Should have X in the center square', async () => {
    const baseIntanceId = `/games/${gameID}/${instanceId}`;
    // Move X to the center of the board
    gameBoard = await axios.post(`${baseIntanceId}/move`, { avatar: 'X', position: 4 })
      .then(resp => resp.data)
      .then(data => {
        const {gameId, board} = data;
        expect(gameId).toBeTruthy();
        expect(board).toBeTruthy();
        return board;
      });
    printGameBoard();
  });

  it('Should have O in the second row, first square', async () => {
    const baseIntanceId = `/games/${gameID}/${instanceId}`;
    // Move O
    gameBoard = await axios.post(`${baseIntanceId}/move`, { avatar: 'O', position: 3})
      .then(resp => resp.data)
      .then(data => {
        const {gameId, board} = data;
        expect(gameId).toBeTruthy();
        expect(board).toBeTruthy();
        return board;
      });
    printGameBoard();
  });

});
