const express = require('express')
const app = express()
const port = 3001;
const puppeteer = require('puppeteer');
const now = require("performance-now")

app.get('/hash', function (req, res) {
    res.send('hello!')
});
(async () => {
    const browser = await puppeteer.launch({
        headless: true
    }).then(function(browser) {
        app.get('/hash/:hashtag', async function (req, res) {
            let start = now();
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Android 7.0; Mobile; rv:54.0) Gecko/54.0 Firefox/54.0');
            await console.log('Requesting hashtag #' + req.params.hashtag + ' in a new page.');
            
            await page.goto('https://www.instagram.com/explore/tags/' + req.params.hashtag, {
                waitUntil: 'networkidle2'
            });
    
            await page.waitFor('.g47SY');
            const hashtagPosts = await page.$eval('.g47SY', el => el.textContent);
            const hashtagThumbnail = await page.$eval('._7A2D8', el => el.src);
    
            const relatedHashtags = await page.$$eval('.LFGs8', function (els) {
                let relatedHashtagsText = [];
    
                for (let i = 0; i < els.length; i++) {
                    relatedHashtagsText.push(els[i].textContent);
                }
                return relatedHashtagsText;
            });
    
            res.json({
                hashtagPosts,
                hashtagThumbnail,
                relatedHashtags
            });
            let end = now();
            page.close();
            
            await console.log('Closed hashtag #' + req.params.hashtag + ' page');
            await console.log('Process took ' + (end-start).toFixed(3));

        });
    });
    
})();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));