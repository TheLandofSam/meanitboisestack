# MEANITBoise Stack

## If Cloning this repo:

* `npm i` to install dependencies, then skip down to database setup

## If Setting up a new repo

## Angular Setup

* Requires Node 8.9.3 or greater
* @angular/cli 6.0.0 or greater

`ng new MeanStack`

## Server Setup

`npm i express body-parser mongodb`

`npm i ts-node typescript nodemon concurrently @types/express @types/mongodb --save-dev`

1. Create a folder named `server`
2. Add a file `/server/bootstrap.ts`
```typescript
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

function startServer() {
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
    
    app.use('/', (req: Request, res: Response) => {
        res.status(200).send('Home sweet home!');
    });

    app.listen(port, () => {
        console.log('MEANITBoise Stack listening on port ' + port);
    });
}

startServer();
```
3. Add a file `/server/tsconfig.json`
```typescript
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "pretty": true,
    "sourceMap": true,
    "target": "es6",
    "outDir": "../dist",
    "baseUrl": "./"
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}
```
4. Add new scripts to package.json
```json
"build": "npm run build:app && npm run build:server",
"build:app": "ng build",
"build:server": "tsc -p \"./server/tsconfig.json\"",
"start": "concurrently \"npm run start:app\" \"npm run start:server\"",
"start:app": "ng serve",
"start:server": "nodemon --config ./nodemon.json",
"start:server:prod": "npm run build:server && node ./dist/bootstrap.js"
```

```javascript
npm run start:server // starts dev server in watch mode
npm run start:server:prod // builds server and starts process
```

## MongoDB setup

### Linux Guide
* `https://docs.mongodb.com/manual/administration/install-on-linux/`

### OSX Guide
* `https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/`

### Windows Guide
* `https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/`

Download and install mongodb server community edition

https://www.mongodb.com/download-center?jmp=nav#community

### Start MongoDB

To start mongo using the default db path of `/data/db` (create the folder path first if it does not exist as mongodb will not make it for you), run:
```bash
"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"
```

Start mongod with a different db path for your mongo instance (create the folder path first if it does not exist as mongodb will not make it for you)

```bash
"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath C:\test\mongodb\data
```

If you see `[initandlisten] waiting for connections on port 27017` in your terminal output, then your server is running! Do not close this window as doing so will also shut down your mongo server.

### Connecting to MongoDB

Open a new command prompt window and run:
```bash
"C:\Program Files\MongoDB\Server\3.6\bin\mongo.exe"
```

To verify connection type `db` to get the name of the currently connected database

### Troubleshooting
`error - Data directory [path] not found, terminating`: The specified database path does not exist. Default path is `/data/db`. Either create this directory, or create your own custom one and tell mongo to use that path with the `--dbpath [path]` flag

`error - only one usage of each socket address`: run the first command to find any processes running on port 27017, then use the second command to kill that process by replacing 10580 with the corresponding process id.
```bash
netstat -a -n -o | find "27017"
taskkill /f /pid 10580
```

`error - Failed to connect, reason: No connection could be made because the target machine actively refused it`: Check that your server is running in a seperate command window and that it hasn't closed down unexpectedly

## Running It All

Open 3 terminals
1. Run mongod in the first
2. `npm start:server` in the second
3. `npm start:app` in the third

Open your browser to port 4200 to see it all running
