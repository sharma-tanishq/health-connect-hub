import Docter from "../../../models/Doctor";
import connectmongo from "../../../middleware/db";
import { NextApiRequest, NextApiResponse } from "next";
import CryptoJS from "crypto-js";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method == "POST") {
            const { email, password } = req.body;
            let doctor = await Docter.findOne({ email: email });
            if (!doctor) {
                return res.status(400).json({ error: "User doesn't exists" });
            }
            const encpwd = CryptoJS.HmacSHA1(password, process.env.SALT || "salt").toString();
            if (doctor.password !== encpwd) {
                return res.status(400).json({ error: "Invalid credentials" });
            }
            res.status(200).json({ "status": "ok" , "docId": doctor.docId});
        } else {
            res.status(400).json({ error: "This method is not allowed" });
        }
    } catch (error) {
        res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
};

export default connectmongo(handler);