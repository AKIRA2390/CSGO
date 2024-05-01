var express = require('express');
var openAI = require('openai')

const openai = new openAI();

var router = express.Router();

/* GET  input. */
router.get('/', function (req, res, next) {
    res.render('11_sentence_input', { title: 'INPUT' });
});

/* GET  analysis. */
router.get('/analysis', function (req, res, next) {
    res.render('12_extracted_words', { title: 'analysis' });
});
router.post('/analysis', async function (req, res, next) {
    const sentence = req.body.sentence;
    console.log(`sentence: ${sentence}\n`)

    const completion = await openai.chat.completions.create({
        messages: [{
            role:
                "system",
            content:
                `中国語の文章を与えるので、文章全体の日本語訳をした後、文章を単語ごとに分割、それぞれの単語における拼音・単語の日本語における意味・品詞・HSKレベルを出力してください。応答はjson形式でそしてjsonのみでお願いします。\n\
            json例: {"translation": "中国語","words": [ {"word": "中文","pinyin": "Zhōng wén","meaning": "中国語","part_of_speech": "名詞","hsk_level": 1 } ]  \n\
            ${sentence}`
        }],
        model: "gpt-3.5-turbo-0125",
    });
    const responceObject = completion.choices[0].message.content;
    console.log(typeof (responceObject));
    // const responce = JSON.parse(responceObject).message.content;
    // console.log(responce);
    res.render('12_extracted_words', {responce: responceObject})
});

/* GET  selection. */
router.get('/analysis/selection', function (req, res, next) {
    res.render('13_dictSelection', { title: 'SELECTION' });
});

/* POST  selection. */
router.post('/analysis/selection', function (req, res, next) {

});

module.exports = router;
