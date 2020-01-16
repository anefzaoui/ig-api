const express = require('express')
const app = express()
const port = 3001;
const puppeteer = require('puppeteer');
app.get('/hash', function (req, res) {
    res.send('hello!')
});

app.get('/hash/:hashtag', function (req, res) {
    (async () => {
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1');
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

        browser.close();

    })();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));