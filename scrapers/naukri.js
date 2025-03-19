const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const scrapeNaukri = async (url) => {
    if (!url) throw new Error("Job URL is required!");

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

        // Extract job header and job description
        const extractedData = await page.evaluate(() => {
            const jobHeader = document.querySelector("section.styles_job-header-container___0wLZ");
            const jobHeaderContent = jobHeader ? jobHeader.innerHTML : "Job header not found!";

            const jobDescription = document.querySelector("section.styles_job-desc-container__txpYf");
            
            return { jobHeader: jobHeaderContent, jobDescription };
        });

        return extractedData;
    } catch (error) {
        throw new Error("Scraping failed: " + error.message);
    } finally {
        await browser.close();
    }
};

module.exports = scrapeNaukri;
