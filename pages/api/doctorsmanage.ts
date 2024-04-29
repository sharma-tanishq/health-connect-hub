import Doctor from "../../models/Doctor";
import connectmongo from "../../middleware/db";
import { NextApiRequest, NextApiResponse } from "next";
import CryptoJS from "crypto-js";

const adminKey = process.env.ADMIN_KEY;
// const adminKey = "adminkey";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === "GET") {
            const doctors = await Doctor.find();
            res.status(200).json(doctors);
        } else {
            const providedAdminKey = req.headers.adminkey as string;

            if (!providedAdminKey || providedAdminKey !== adminKey) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            if (req.method === "POST") {
                const user = await Doctor.find({ docId: req.body.docId });
                if (!user) {
                    return res.status(400).json({ error: "Doctor with same ID already exists" });
                }
                // console.log(req.body);
                const encpwd = CryptoJS.HmacSHA1(req.body.password, process.env.SALT || "salt").toString();
                const d = new Doctor({
                    ...req.body,
                    password: encpwd,
                });
                await d.save();
                res.status(200).json("success");
            } else if (req.method === "DELETE") {
                const docId = req.query.docId as string;
                const deletedDoc = await Doctor.findOneAndDelete({ docId });
                if (!deletedDoc) {
                    return res.status(404).json({ error: "Doctor not found" });
                }
                res.status(200).json({ message: "Doctor deleted successfully" });
            }
            else {
                res.status(400).json({ error: "This method is not allowed" });
            }
        }
    } catch (error) {
        console.log("=======================================")
        console.log(error)
        res.status(500).json({ error });
    }
};

export default connectmongo(handler);