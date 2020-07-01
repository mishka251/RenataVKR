import { Medicine, Patient, Symptom, AllData, Illness } from './dbTypes';
import { Db, MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url, { useNewUrlParser: true });


export function getAllData(): Promise<AllData> {
    return mongoClient.connect()
        .then<AllData>(async (client: MongoClient) => {
            const db: Db = client.db('db_test');

            const patients: Patient[] = await db.collection('patients').find().toArray();
            const symptoms: Symptom[] = await db.collection('symptoms').find().toArray();
            const medicines: Medicine[] = await db.collection('medicines').find().toArray();
            const illness: Illness[] = await db.collection('illness').find().toArray();

            const result: AllData = {
                patients: patients,
                symptoms: symptoms,
                medicines: medicines,
                illness: illness,
            };
            return result;
        })
}
