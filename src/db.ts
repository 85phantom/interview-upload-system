import { JsonDB, Config } from 'node-json-db';

const db = new JsonDB(new Config('myDataBase', true, false, '/'));

export default db;
