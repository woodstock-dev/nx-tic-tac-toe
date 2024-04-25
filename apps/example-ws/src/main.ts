/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Game, TicTacToe } from '@examples/games';

import * as path from 'path';
import { HttpStatusCode } from 'axios';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

const builder = new Map<string, () => Game>
builder.set("t3", () => new TicTacToe())

const instances = new Map<string, Map<string, Game>>();

/**
 * Creates a new instance of a game in the ID.
 */
app.post('/api/v1/games/:id', (req, resp) => {
  const {id} = req.params;

  if (builder.has(id)) {
    console.log("Getting Game")
    
    if (!(id in instances)) {
      instances.set(id, new Map<string, Game>());
    }
    const games = instances.get(id);
    const gameInstance = builder.get(id)();
    
    const instanceId = uuidv4();
    games.set(instanceId, gameInstance);
    console.log(`Game instance: ${JSON.stringify(gameInstance)}`)

    resp.status(HttpStatusCode.Created);
    resp.json({gameId: instanceId, board: gameInstance.state()});
  } else {
    resp.status(HttpStatusCode.BadRequest);
  }
});

/**
 * Performs an action on an instance of a game.
 */
app.post('/api/v1/games/:id/:instanceId/:action', (req, resp) => {
  const {id, instanceId, action} = req.params;
  const games = instances.get(id);

  const {avatar, position} = req.body;
  console.log(`Using avatar: ${avatar} to perform: ${action}`)
  
  if (games) {
    const instance = games.get(instanceId);
    if (instance) {
      switch(action) {
        case 'move':
          console.log('moving')
          instance.move(avatar, position);
          break;
        default:
          console.log('invalid action')
      }
      resp.status(HttpStatusCode.Ok);
      resp.json({ gameId: instanceId, board: instance.state() });
    } else {
      resp.status(HttpStatusCode.NotFound);
    }
  } else {
    resp.status(HttpStatusCode.BadRequest);
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
