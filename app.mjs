import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Router from './router.mjs'
import moment from 'moment';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

const logsFolder = path.join(process.cwd(), `logs/${moment().format('DD-MM-YYYY')}`);
process.folders = {
  ...process.folders,
  logs: logsFolder
}
if (!fs.existsSync(logsFolder)) 
  fs.mkdirSync(logsFolder);

const accessLogStream = fs.createWriteStream(path.join(`${process.folders.logs}/http.log`), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))
app.use( morgan( 'tiny' ) )
app.use( cors() );
app.use( express.json() );

app.use( Router );

app.listen( port , () => {
  console.log(`App start on port ${port}`);
})
