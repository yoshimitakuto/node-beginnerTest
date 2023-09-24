const express = require('express');
const app = express();
const mysql = require('mysql2');
const port = 3000;
const hostName = '127.0.0.1';

app.use(express.static('link'));
app.use(express.urlencoded({extended: false}));




// データベース登録
const connection = mysql.createConnection ({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: '3306',
    database: 'node_beginnertest'
});

connection.query (
    //SQL文でusersテーブルからすべてのデータ（*は全てのデータ）を取得する命令文
    'SELECT * FROM users',
    (error, results) => {
        console.log(error);
        console.table(results);
    }
);




// ルート
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// ユーザー登録画面へ遷移
app.get('/userform', (req, res) => {
    res.render('userform.ejs');
});

// データベースへデータ登録
app.post('/', (req, res) => {
    connection.query (
        'INSERT INTO users(name,email,password) VALUES(?,?,?)',
        [req.body.addName,req.body.addMail,req.body.addPass],
        (error, results) => {
            res.render('index.ejs');
        }
    );
});

// 管理者画面へ遷移（登録データ取得）
app.get('/admin', (req, res) => {
    connection.query (
        'SELECT * FROM users',
        (error, results) => {
            res.render('admin.ejs', { userTable: results });
        }
    );
});

// 編集画面へ遷移（ユーザー情報をparamsのidから受け取り表示させる）
app.get('/edit/:id', (req, res) => {
    connection.query (
        'SELECT * FROM users WHERE id=?',
        [req.params.id],
        (error, results) => {
            res.render('edit.ejs', { userTable: results[0] });
        }
    );
});

// データベースのデータを編集
app.post('/update/:id', (req, res) => {
    connection.query (
        'UPDATE users SET name=?,email=?,password=? WHERE id = ?',
        [req.body.updateName,req.body.updateMail,req.body.updatePass,req.params.id],
        (error, results) => {
            connection.query (
                'SELECT * FROM users',
                (error, results) => {
                    res.render('admin.ejs', { userTable: results });
                }
            );
        }
    );
});

// データベースのデータを削除
app.post('/delete/:id', (req, res) => {
    connection.query (
        'DELETE FROM users WHERE id=?',
        [req.params.id],
        (error, results) => {
            res.redirect('/admin');
        }
    );
});


app.listen(port, hostName, () => {
    console.log(`Server running at http://${hostName}:${port}/ 🚀`);
});