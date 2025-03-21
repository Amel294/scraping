const express = require("express");
const cors = require("cors");
const scrapeNaukri = require("./scrapers/naukri"); // Import the Naukri scraper
const extractEmailsFromWebsite = require("./scrapers/emailFromWebiste");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is not defined

app.use(cors());
app.use(express.json()); // Middleware to parse JSON body

app.post("/scraper", async (req, res) => {
    const { type, url } = req.body; // Expecting { type: "naukri", url: "job-url-here" }

    if (!type || !url) {
        return res.status(400).json({ error: "Type and URL are required!" });
    }

    try {
        let data;

        if (type === "naukri") {
            data = await scrapeNaukri(url);
        } else {
            return res.status(400).json({ error: "Unsupported job portal type!" });
        }

        res.json(data);
    } catch (error) {
        console.error("Scraper error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.post("/emailFromWebsite", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "Type and URL are required!" });
    }

    try {
        let data;

        data = await extractEmailsFromWebsite(url);

        res.json(data);
    } catch (error) {
        console.error("Scraper error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${ PORT }`));
