import contactModel from "../model/contactModel.js";
import { validationResult } from "express-validator";
import messageSender from "../config/messageSender.js";
export const createContact = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, email, message } = req.body;
    const contact = new contactModel({
        name,
        email,
        message,
    });
    try {
        await contact.save();
        const sendMessage = await messageSender(email);
        console.log(sendMessage);
        return res.status(201).json({ message: "Contact created and email send successfully " });
        
        
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    
    }

}
    
