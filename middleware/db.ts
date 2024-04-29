import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const connectmongo = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  mongoose.set("strictQuery", false);

  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  await mongoose.connect(process.env.MONGODB_URI as string);
  return handler(req, res);
};

export default connectmongo;