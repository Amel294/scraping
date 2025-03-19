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

        const extractedData = await page.evaluate(() => {
            const jobTitle = document.querySelector(".styles_jd-header-title__rZwM1")?.innerHTML.trim() || "No Job Title";
            const companyName = document.querySelector(".styles_jd-header-comp-name__MvqAI a")?.textContent.trim() || "No Company Name";
            const experience = document.querySelector(".styles_jhc__exp__k_giM span")?.textContent.trim() || "No Experience Provided";
            const salary = document.querySelector(".styles_jhc__salary__jdfEC span")?.textContent.trim() || "No Salary Provided";

            let isRemote = document.querySelector(".styles_jhc__wfhmode-link__aHmrK")?.textContent.trim().toLowerCase() === "remote";

            const locations = [];
            document.querySelectorAll(".styles_jhc__location__W_pVs a").forEach((element) => {
                const locationText = element.textContent.trim();
                if (locationText) {
                    locations.push(locationText);
                }
            });

            // Check if any location contains 'Remote'
            const LocationContainRemote = locations.some(location => location.toLowerCase() === "remote");
            if (LocationContainRemote) isRemote = true;

            const postedDateText = document.querySelector(".styles_jhc__jd-stats__KrId0 .styles_jhc__stat__PgY67 span:nth-child(2)")?.textContent.trim() || "No Posted Date";
            const numberOfOpenings = document.querySelector(".styles_jhc__jd-stats__KrId0 .styles_jhc__stat__PgY67:nth-child(2) span:nth-child(2)")?.textContent.trim() || "No Openings";
            const jobDescription = document.querySelector(".styles_JDC__dang-inner-html__h0K4t")?.textContent.trim() || "No Job Description";

            const role = document.querySelector(".styles_other-details__oEN4O .styles_details__Y424J:nth-child(1) span a")?.textContent.trim() || document.querySelector(".styles_other-details__oEN4O .styles_details__Y424J:nth-child(1) span")?.textContent.trim() || "No Role";
            const industryType = document.querySelector(".styles_other-details__oEN4O .styles_details__Y424J:nth-child(2) span a")?.textContent.trim() || document.querySelector(".styles_other-details__oEN4O .styles_details__Y424J:nth-child(2) span")?.textContent.trim() || "No Industry Type";
            const department = document.querySelector(".styles_other-details__oEN4O .styles_details__Y424J:nth-child(3) span a")?.textContent.trim() || document.querySelector(".styles_other-details__oEN4O .styles_details__Y424J:nth-child(3) span")?.textContent.trim() || "No Department";
            const employmentType = document.querySelector(".styles_other-details__oEN4O .styles_details__Y424J:nth-child(4) span")?.textContent.trim() || "No Employment Type";
            const ugEducation = document.querySelector(".styles_education__KXFkO .styles_details__Y424J:nth-child(2) span")?.textContent.trim() || "No UG Education";
            const pgEducation = document.querySelector(".styles_education__KXFkO .styles_details__Y424J:nth-child(3) span")?.textContent.trim() || "No PG Education";
            const keySkills = Array.from(document.querySelectorAll(".styles_key-skill__GIPn_ .styles_chip__7YCfG span"))
                .map(skill => skill.textContent.trim());
            return { jobTitle, companyName, experience, salary, isRemote, locations, postedDateText, numberOfOpenings, jobDescription, role, industryType, department, employmentType, ugEducation, pgEducation, keySkills };
        });

        return extractedData;
    } catch (error) {
        throw new Error("Scraping failed: " + error.message);
    } finally {
        await browser.close();
    }
};

module.exports = scrapeNaukri;
