const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const urlLib = require("url");

puppeteer.use(StealthPlugin());

const findAllPages = async (startUrl, maxDepth = 3) => {
    if (!startUrl) throw new Error("Website URL is required!");

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const visitedUrls = new Set();
    const pagesToVisit = [{ url: startUrl, depth: 0 }];
    const siteMap = {};

    try {
        const page = await browser.newPage();

        while (pagesToVisit.length > 0) {
            const { url, depth } = pagesToVisit.shift();
            if (visitedUrls.has(url) || depth > maxDepth) continue;
            visitedUrls.add(url);

            console.log(`Crawling: ${url} (Depth: ${depth})`);

            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

            if (!siteMap[url]) siteMap[url] = [];

            const newLinks = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("a[href]"))
                    .map(a => a.href.trim())
                    .filter(link => 
                        link.startsWith(window.location.origin) && // Internal links only
                        !link.includes("#") &&                    // Exclude anchor links
                        !link.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) // Exclude image file extensions
                    );
            });

            newLinks.forEach(link => {
                if (!visitedUrls.has(link) && !pagesToVisit.some(p => p.url === link)) {
                    pagesToVisit.push({ url: link, depth: depth + 1 });
                    siteMap[url].push(link);
                }
            });
        }

        return { sitemap: siteMap };
    } catch (error) {
        throw new Error("Crawling failed: " + error.message);
    } finally {
        await browser.close();
    }
};

module.exports = findAllPages;