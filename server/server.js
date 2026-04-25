//env
require('dotenv').config();

//Imports
const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
//importar multer
const multer = require('multer');

// definición de la carpeta donde se guardarán las imágenes a subir y el nombre que se les asignará
const storage = multer.diskStorage({
    destination: '../client/src/assets/uploads/',
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());

// Env config
const PORT = Number(process.env.PORT);
const FRONTEND_URL = process.env.FRONTEND_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.get('/hello', (req, res) => {
    res.json({ message: 'Hola' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const cn = {
host: process.env.DB_HOST,
port: Number(process.env.DB_PORT),
database: process.env.DB_NAME,
user: process.env.DB_USER,
password: process.env.DB_PASS || process.env.DB_PASSWORD,
allowExitOnIdle: true
}
const db = pgp(cn)

//Cors config
app.use(cors({origin: FRONTEND_URL, credentials: true}));

//SESSION
app.use(session({
    store: new pgSession({
        pgPromise: db, //DB object from pg-promise
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 10*60*1000, secure: false} //10 minutos
}));

//Autenticación
const authenticateSession = (req, res, next) => {
    if (req.session.id_author) {
        next();
    } else {
        res.sendStatus(401);
    }
};

//POST login if credentials are correct
app.post('/login',upload.none(), (req, res) => {
    const { username, password } = req.body;

    db.oneOrNone('SELECT id_author, password FROM author WHERE username=$1', [username])
    .then((data) => {
        if (data != null) {
            if (data.password === password) {
                req.session.id_author = data.id_author;
                req.session.save(function(err) {
                    if (err) {
                        console.log('ERROR:', err);
                        return res.status(500).send('Session save failed');
                    }
                    return res.json({ id_author: data.id_author });
                });
            } else {
                res.status(401).send('Invalid email/password');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    })
    .catch((error) => console.log('ERROR:', error));
});

//GET to logout and end the session
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to destroy session');
        }
        res.send('Session destroyed');
    });
});

//GET session variables
app.get('/session-info', (req, res) => {
    res.json(req.session);
});

//GET one author
app.get('/authors/:id_author', authenticateSession, (req, res) => {
    db.one("SELECT * , TO_CHAR(date_of_birth, 'DD/MM/YYYY') as date_of_birth FROM author WHERE id_author=$1", [req.params.id_author])
    .then((data) => res.json(data))
    .catch((error) => console.log('ERROR:', error));
});

app.get('/authors/:id_author/posts', authenticateSession, (req, res) => {
    db.any('SELECT * FROM post WHERE id_author=$1 ORDER BY date DESC', [req.params.id_author])
    .then((data) => res.json(data))
    .catch((error) => console.log('ERROR:', error));
});


/* GET all the posts */
app.get('/posts', (req, res) => {
db.any('SELECT * FROM post')
.then((data) => res.json(data))
.catch((error) => console.log('ERROR:', error));
});

/* GET a specific post */
app.get('/posts/:id_post', (req, res) => {
db.one('SELECT * FROM post WHERE id_post=$1',[req.params.id_post])
.then((data) => res.json(data))
.catch((error) => console.log('ERROR:', error));
})

// POST a new post (entry)
app.post('/posts/new', upload.single('img'), function(req, res){
    const { title, text, id_author } = req.body;

    if (!title || !req.file) {
        return res.status(400).json({ message: 'Faltan datos obligatorios: titulo e imagen' });
    }

    const imagePath = `/src/assets/uploads/${req.file.originalname}`;

    db.one(
        `WITH next_id AS (
            SELECT COALESCE(MAX(id_post), 0) + 1 AS id
            FROM post
        )
        INSERT INTO post (id_post, title, date, image, text, id_author)
        SELECT next_id.id, $1, NOW(), $2, $3, $4
        FROM next_id
        RETURNING *`,
        [title, imagePath, text || null, id_author ? Number(id_author) : null]
    )
    .then((post) => {
        res.status(201).json({
            message: 'Post agregado correctamente',
            post,
        });
    })
    .catch((error) => {
        console.log('ERROR: ', error);
        res.status(500).json({ message: 'No se pudo agregar el post' });
    });
});