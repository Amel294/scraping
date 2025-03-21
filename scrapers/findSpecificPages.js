const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const urlLib = require("url");

puppeteer.use(StealthPlugin());

const findSpecificPages = async (request) => {
    const { url: startUrl, lookingFor = [], maxDepth = 3 } = request;
    if (!startUrl) throw new Error("Website URL is required!");

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-zygote",
        ],
    });

    const visitedUrls = new Set();
    const pagesToVisit = [{ url: startUrl, depth: 0 }];
    const targetKeywords = new Set(lookingFor.map(k => k.toLowerCase()));
    const foundPages = new Set();

    try {
        const page = await browser.newPage();

        while (pagesToVisit.length > 0) {
            const { url, depth } = pagesToVisit.shift();
            if (visitedUrls.has(url) || depth > maxDepth || foundPages.size === targetKeywords.size) {
                continue;
            }

            visitedUrls.add(url);
            console.log(`Crawling: ${url} (Depth: ${depth})`);

            try {
                // Navigate with a longer timeout and minimal resource usage
                await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

                // Check if the current URL matches any target keywords
                const urlLower = url.toLowerCase();
                const matchedKeyword = Array.from(targetKeywords).find(keyword => urlLower.includes(keyword));
                if (matchedKeyword) {
                    foundPages.add(url);
                    console.log(`Found page related to "${matchedKeyword}": ${url}`);
                }

                // Early exit if all keywords are matched
                if (foundPages.size === targetKeywords.size) {
                    console.log("All keywords have matches. Stopping crawl.");
                    break;
                }

                // Extract new links
                const newLinks = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("a[href]"))
                        .map(a => a.href.trim())
                        .filter(link => 
                            link.startsWith(window.location.origin) && 
                            !link.includes("#") && 
                            !link.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
                        );
                });

                // Add new links to the queue
                newLinks.forEach(link => {
                    if (!visitedUrls.has(link) && !pagesToVisit.some(p => p.url === link)) {
                        pagesToVisit.push({ url: link, depth: depth + 1 });
                    }
                });
            } catch (navError) {
                console.error(`Navigation failed for ${url}: ${navError.message}`);
                continue; // Skip this page and move to the next
            }
        }

        await browser.close();
        return Array.from(foundPages);
    } catch (error) {
        await browser.close();
        throw new Error("Crawling failed: " + error.message);
    }
};

module.exports = findSpecificPages;