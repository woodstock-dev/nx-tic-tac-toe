import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import { HttpStatusCode } from 'axios';
import { Game, TicTacToe } from '@examples/games';

const router = express.Router();

router.use(express.json());

const builder = new Map<string, () => Game>
builder.set("t3", () => new TicTacToe())
const instances = new Map<string, Map<string, Game>>();

router.get("/games", (req, resp) => {
    resp.status(HttpStatusCode.Ok);
    resp.json(builder);
});

/**
 * Creates a new instance of a game in the ID.
 */
router.post('/games/:id', (req, resp) => {
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
  router.post('/games/:id/:instanceId/:action', (req, resp) => {
    const {id, instanceId, action} = req.params;
    const games = instances.get(id);
  
    const {avatar, position} = req.body;
    console.log(`Using avatar: ${avatar} to perform: ${action}`)
    
    if (games) {
      const instance = games.get(instanceId);
      if (instance) {
        switch(action) {
          case'register':
            console.log('registering')
            
            break;
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

export { router as v1Router }