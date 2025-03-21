const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const extractEmailsFromWebsite = async (url) => {
    if (!url) throw new Error("URL is required!");

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
        ],
    });

    try {
        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        await page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.google.com/",
        });

        await page.goto(url, { waitUntil: "networkidle2" });

        const extractedEmails = await page.evaluate(() => {
            const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const bodyText = document.body.innerText;
            return bodyText.match(emailPattern) || [];
        });

        return { extractedEmails };
    } catch (error) {
        throw new Error("Email extraction failed: " + error.message);
    } finally {
        await browser.close();
    }
};

module.exports = extractEmailsFromWebsite;
