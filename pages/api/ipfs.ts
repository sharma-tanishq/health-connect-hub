// @ts-nocheck
import formidable from "formidable";
import fs from "fs";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req:any, res:any) {
  if (req.method === "POST") {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        if (err) {
          console.log({ err });
          return res.status(500).send("Upload Error");
        }
        const stream = fs.createReadStream(files.file.filepath);
        const options = {
          pinataMetadata: {
            name: "asas",
          },
        };
        const response = await pinata.pinFileToIPFS(stream, options);

        const { IpfsHash } = response;

        return res.status(200).json({ IpfsHash });
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const response = await pinata.pinList(
        { pinataJWTKey: process.env.PINATA_JWT },
        {
          pageLimit: 1,
        }
      );
      res.json(response.rows[0]);
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  }
}