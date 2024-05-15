export default async function handler(req:any, res:any) {
    if(req.method === "GET"){
        res.status(200).json({status: "ok"});
    }
    else{
        res.status(400).json({error: "This method is not allowed"});
    }
}