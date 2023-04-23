import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

type WaitlistProps = {
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body as WaitlistProps;

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);

    const db = client.db(process.env.MONGODB_DB);

    const collection = db.collection("waitlist");
    const result = await collection.insertOne({ email });

    res.status(201).json({ message: "Email added to waitlist", result });
  } else if (req.method === "GET") {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);

    const db = client.db(process.env.MONGODB_DB);

    const collection = db.collection("waitlist");
    const result = await collection.find().sort({ _id: -1 }).toArray();

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
