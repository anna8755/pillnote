const Router = require('express').Router;
const path = require('path');
const fs = require('fs');
const router = new Router();

router
    .get('/', (req, res) => {
        res.render('index')
    })
    .get('/about', (req, res) => {
        res.render('about')
    })
    .get('/download', (req, res) => {
        const file = path.join(path.resolve(process.cwd()), 'public', 'files', 'Client.rar');

        fs.exists(file, function (exists) {
            if (exists) {
                const filestream = fs.createReadStream(file);
                filestream.on('open', function () {
                    res.setHeader('Content-disposition', 'attachment; filename=' + 'Client.rar');
                    res.setHeader('Content-Type', 'application/rar');
                    res.writeHead(200);

                    filestream.pipe(res, () => {
                        res.redirect('/');
                    });
                });
            } else {
                res.send("Файл не найден на сервере");
            }
        });
    })
    .get('/forgot/:forgotlink', (req, res) => {
        res.render('forgot-pass', { link: req.params.forgotlink })
    })
    .post('/reset', (req, res) => {
        console.log(req.body.link)
        res.send('all is good!')
    });

module.exports = router;
