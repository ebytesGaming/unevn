import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not configured");

const globalForMongo = globalThis as typeof globalThis & { mongoClient?: MongoClient };
export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo.mongoClient = mongoClient;

export async function ordersCollection() {
  await mongoClient.connect();
  return mongoClient.db(process.env.MONGODB_DATABASE || "unevn").collection("orders");
}

export async function accountsCollection() {
  await mongoClient.connect();
  return mongoClient.db(process.env.MONGODB_DATABASE || "unevn").collection("accounts");
}
