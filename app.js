const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs')
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { seNewUrlParser: true });


const articleSchema = {
    title: String,
    content: String,
}

const Article = mongoose.model("Article", articleSchema)

app.route("/articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    }
    )
    .post((req, res) => {
        const jake = new Article({
            title: req.body.title,
            content: req.body.content,
        })
        jake.save((err) => {
            if (!err) {
                res.send("Added a new article")
            } else {
                res.send(err);
            }
        });
    }
    )
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("the deed is done")
            } else {
                res.send(err);
            }
        })
    }

    );

//////// req targeting specific item/////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);

            } else {
                res.send('no article was found')
            }
        })
    })
    .put((req, res) => {
        Article.update({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content, }, { overwrite: true },
            (err) => {
                if (!err) {
                    res.send("done right")
                }
            })
    }
    )
    .patch(
        (req, res) => {
            Article.update({ title: req.params.articleTitle }, { $set: req.body },
                (err, foundArticle) => {
                    if (!err) {
                        res.send('success')
                    } else {
                        res.send('error')
                    }
                })
        }
    )
    .post(
        (req, res) => {
            Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {

            })
        })
    .delete(
        (req, res) => {
            Article.deleteOne({ title: req.params.articleTitle }, (err) => {
                if (!err) {
                    res.send("the deed is done")
                } else {
                    res.send(err);
                }
            })
        }
    );


// app.get('/articles')

// app.post('/articles');

// app.delete('/articles')








app.listen(3000, function () {
    console.log("server listening on 3000");
})