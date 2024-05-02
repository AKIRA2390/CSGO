const { Prisma, PrismaClient } = require('@prisma/client');
var express = require('express');
var openAI = require('openai')
var prisma = new PrismaClient();

const openai = new openAI();

var router = express.Router();

/* GET  input. */
router.get('/', function (req, res, next) {
    res.render('11_sentence_input');
});

/* GET  analysis. */
router.get('/analysis', function (req, res, next) {
    res.render('12_extracted_words');
});
router.post('/analysis', async function (req, res, next) {
    const sentence = req.body.sentence;
    console.log(`sentence: ${sentence}\n`)

    const completion = await openai.chat.completions.create({
        messages: [{
            role:
                "system",
            content:
                `中国語の文章を与えるので、文章全体の日本語訳をした後、文章を単語ごとに分割、全ての単語についてそれぞれ拼音・単語の日本語における意味・品詞・HSKレベルを出力してください。応答はjson形式で、そしてjsonのみでお願いします。\n\
            json例: {"translation": "中国語","words": [ {"word": "中文","pinyin": "Zhōng wén","meaning": "中国語","part_of_speech": "名詞","hsk_level": 1 } ]  \n\
            ${sentence}`
        }],
        model: "gpt-3.5-turbo-0125",
    });
    const responceObject = JSON.parse(completion.choices[0].message.content);
    console.log(responceObject);
    // const responce = JSON.parse(responceObject).message.content;
    // console.log(responce);
    res.render('12_extracted_words', { sentence: sentence, responce: responceObject })
});

/* GET  selection. */
router.get('/analysis/selection', function (req, res, next) {
    res.render('13_dictSelection');
});

/* POST  selection. */
router.post('/analysis/selection', async function (req, res, next) {
    console.log(req.body.index)
    // const dictionaries = await prisma.dictionary.findMany();
    res.render('13_dictSelection', {
        sentence: req.body.sentence,
        responce: req.body.responce,
        index: req.body.index,
        dictionaries: dictionaries
    });
});

module.exports = router;
