var path = require('path');

//Postgre DATABASE_URL = postgre://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//Se carga el ORM
var Sequelize = require('sequelize');

 var sequelize = new Sequelize(DB_name,user,pwd,
		 {dialect:protocol,
	  	  protocol:protocol,
	  	  port:port,
	  	  host:host,
	 	  storage:storage, //Solo SQLite (.env)
	 	  omitNull:true //solo Postgres
 		}
 );
 //Se importa la definición de la tabla quiz de quiz.js
 var quiz_path = path.join(__dirname,'quiz');
 var Quiz = sequelize.import(quiz_path);
 
 exports.Quiz = Quiz;
 
 sequelize.sync().then(function(){	 
	 Quiz.count().success(function(count){
		 if (count===0) {
			 Quiz.create({
				 pregunta : 'Capital de Mongolia',
				 respuesta : 'Ulan Bator'
			 }).success(function(){console.log('Base de datos inicializada')});
		 }
	 });
 });