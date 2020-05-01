const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');
const methodOverride = require('method-override');


//Configuration de la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'kda_test',
  password: '2020',
});

//Connexion à la base de données
connection.connect((erreur) => {
  if (erreur) {
    throw erreur;
  }
  console.log('La connexion à la base de données est établie');
});

//Initialisation du serveur express
const server = express();

//Dire à express de mettre les données venants du formulaire dans BODY
server.use(express.urlencoded({ extended: false }));
server.use(express.static('public'));

//Dire à express où aller trouver les vues(Nos pages web que le user sait voir)
server.set('views');

//Dire à express d'utiliser EJS comme moteur de template
server.set('view engine', 'ejs');

//Permet d'utiliser la methode PUT ET DELETE
server.use(methodOverride('_method',{methods:['GET','POST']}));

server.get('/apprenants', (req, res) => {
  connection.query('select * from students', (erreur, resultat) => {
    if (erreur) throw erreur;
    return res.render('apprenants/index', { apprenants: resultat });
  });
});

// Ajouter un nouveau apprenant
server.post('/apprenants', (req, res) => {
  console.log('BB');
  connection.query(
    `insert into students(nom,prenom) values('${req.body.nom}','${req.body.prenom}')`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.redirect('/apprenants');
    }
  );
});

// Supprimer un étudiant
server.delete('/apprenants/DELETE/:id',(req,res)=>{
  connection.query(`delete from students where id=?`,[req.params.id],(err,resultat)=>{
      if(err)throw erreur;
      return res.redirect('/apprenants');
  });
});



// Mettre à jour un étudiant
server.post('/update',(req,res)=>{
  console.log(req.body)
  connection.query(
    `update students set nom='${req.body.nom}',prenom='${req.body.prenom}' where id='${req.body.id}'`,(err,resultat)=>{
    if(err)throw erreur;
    return res.redirect('/apprenants');
  });
})

// Permettre la modification à partir de l'Id
server.get('/apprenants/update/:id', (req, res) => {
  connection.query(
    `select * from students where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.render('apprenants/edit_news', {
        title: "Modifier un apprennant",
        apprenant: resultat[0] 
      });
    }
  );
});

// Donne la possibilité d'ajouter un nouvel apprennant
server.get('/apprenants/new', (req, res) => {
  return res.render('apprenants/edit_news',{
    title: "Ajouter un apprennant",
    apprenant:{
      id:"",
      nom:"",
      prenom:""
    }
  });
});

// Donne la possibilité les details d'un apprennant
server.get('/apprenants/:id', (req, res) => {
  connection.query(
    `select * from students where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.render('apprenants/show', { apprenant: resultat[0] });
    }
  );
});

//Définition du port
const PORT = 8500;
server.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});
