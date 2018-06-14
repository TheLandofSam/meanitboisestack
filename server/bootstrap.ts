import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import { MongoClient, Db, Collection, Cursor } from 'mongodb';

function startServer(db: Db) {
  const port = 3000;

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    (req: Request, res: Response, next: NextFunction): void => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
    }
  );

  const router = express.Router();
  router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Home sweet home!');
  });
  router.post('/users', async (req: Request, res: Response) => {
    const userCollection: Collection = db.collection('users');
    const userToAdd = {
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || ''
    };
    if (!userToAdd.firstName || !userToAdd.lastName) {
      res.status(400).send('First and Last Name are required');
    } else {
      const success = await userCollection.insertOne(userToAdd);
      if (success.insertedCount === 1) {
        res.status(200).send({
          message: 'User added successfully!'
        });
      } else {
        res.status(500).send('Unable to save user');
      }
    }
  });
  router.get('/users', async (req: Request, res: Response) => {
    const userCollection: Collection = db.collection('users');
    const userCursor: Cursor = userCollection.find();
    const users = await userCursor.toArray();
    res.status(200).send(users);
  });

  app.use('/', router);

  app.listen(port, () => {
    console.log('MEANITBoise Stack listening on port ' + port);
  });
}

const url = 'mongodb://localhost:27017';
const dbName = 'test';

MongoClient.connect(
  url,
  function(err, client) {
    if (!!err) {
      console.log('Unable to connect to db', err);
    } else {
      console.log('DB Connected successfully!');
      const db = client.db(dbName);
      startServer(db);
    }
  }
);
