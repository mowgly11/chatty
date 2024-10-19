"use strict";
import dotenv from 'dotenv';

dotenv.config();

import express from "express";
import path from 'path';
import compression from "compression";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.MY_SUPER_SECRET_OPENAI_KEY });
    
const __dirname = () => dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.disable("etag");
app.set("x-powered-by", false);
app.use(express.static('frontend'));
app.use(compression({ etag:false }))

app.get("/", (req, res) => {
    const homePagePath = path.join(__dirname(), "frontend", "home.html");
    res.sendFile(homePagePath);
});

app.post("/response", async(req, res) => {
    let completion;
    
    try {
        completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "user", "content": `${req.body.message}`}
            ]
        });
    } catch(err) {
        completion = "Unexpected Error.";
    }

    res.json({ response: "Hello!" })
});

app.listen(3000, () => console.log("listening on http://localhost:3000"))