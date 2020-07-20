// содежимое index.js
import path from 'path';
import express, { Response, Request } from 'express';
import { getAllData } from './db';
import { AllData } from './dbTypes';

const app = express();
const DIST_DIR: string = __dirname;
const HTML_FILE: string = path.join(DIST_DIR, '../templates/меню.html');
const bundleDir: string = path.join(DIST_DIR, '../dist');
const staticDir: string = path.join(DIST_DIR, '../static');

app.use(express.static(bundleDir));
app.use(express.static(staticDir));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(HTML_FILE);
});

app.get('/calc/', (req: Request, res: Response) => {
    res.sendFile(HTML_FILE);
});

app.get('/graf/', (req: Request, res: Response) => {
    res.sendFile(HTML_FILE);
});

app.get('/classes/', (req: Request, res: Response) => {
    res.sendFile(HTML_FILE);
});

app.get('/getDbData/', (req: Request, res: Response) => {
    getAllData()
        .then((result: AllData) => {
            res.send(result);
        });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
});
