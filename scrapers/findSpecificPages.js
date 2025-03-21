const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const urlLib = require("url");

puppeteer.use(StealthPlugin());

const findSpecificPages = async (request) => {
    const { url: startUrl, lookingFor = [], maxDepth = 3 } = request;
    if (!startUrl) throw new Error("Website URL is required!");

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const visitedUrls = new Set();
    const pagesToVisit = [{ url: startUrl, depth: 0 }];
    const siteMap = {}; // Used internally, not returned
    const targetKeywords = new Set(lookingFor.map(k => k.toLowerCase())); // Case-insensitive keywords
    const foundPages = new Set(); // Track URLs matching keywords

    try {
        const page = await browser.newPage();

        while (pagesToVisit.length > 0) {
            const { url, depth } = pagesToVisit.shift();
            if (visitedUrls.has(url) || depth > maxDepth) continue;
            visitedUrls.add(url);

            console.log(`Crawling: ${url} (Depth: ${depth})`);

            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

            if (!siteMap[url]) siteMap[url] = [];

            // Check if the current URL contains any of the target keywords
            const urlLower = url.toLowerCase();
            const matchedKeyword = Array.from(targetKeywords).find(keyword => urlLower.includes(keyword));
            if (matchedKeyword) {
                foundPages.add(url);
                console.log(`Found page related to "${matchedKeyword}": ${url}`);
            }

            // Stop crawling if all keywords have at least one match
            const allKeywordsMatched = targetKeywords.size > 0 && 
                Array.from(targetKeywords).every(keyword => 
                    Array.from(foundPages).some(page => page.toLowerCase().includes(keyword))
                );
            if (allKeywordsMatched) {
                console.log("All keywords have matches. Stopping crawl.");
                break;
            }

            const newLinks = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("a[href]"))
                    .map(a => a.href.trim())
                    .filter(link => 
                        link.startsWith(window.location.origin) && 
                        !link.includes("#") && 
                        !link.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
                    );
            });

            newLinks.forEach(link => {
                if (!visitedUrls.has(link) && !pagesToVisit.some(p => p.url === link)) {
                    pagesToVisit.push({ url: link, depth: depth + 1 });
                    siteMap[url].push(link);
                }
            });
        }

        return Array.from(foundPages); // Only return foundPages
    } catch (error) {
        throw new Error("Crawling failed: " + error.message);
    } finally {
        await browser.close();
    }
};

module.exports = findSpecificPages;