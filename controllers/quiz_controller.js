/**
 * Controlador quizes/answers
 */

var models = require('../models/models.js');

//GET /quizes/question
//exports.question = function (req,res) {
//	models.Quiz.findAll().success(function(quiz) {
//		res.render('quizes/question',{pregunta: quiz[0].pregunta});
//	})
//};

//Autoload
exports.load = function(req,res,next,quizId) {
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz = quiz;
				next();
			}
			else {
				next(new Error('No existe quizId='+quizId));
			}
		}
	).catch(function(error){next(error);});
};

//GET /quizes
exports.index = function(req,res) {
	//Si se indica un término de búsqueda, se realiza la búsqueda
	if (typeof req.query.search != 'undefined'){
		//Se incluyen los operadores % para hacer la búsqueda con cualquier aparición de los términos
		var search = req.query.search;
		search = '%'+search.replace(' ','%')+'%';
		models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes){
			res.render('quizes/index', {quizes:quizes});
		});
	}
	else {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index', {quizes:quizes});
		});
	}
};

//GET /quizes/:id
exports.show = function(req, res) {			
	res.render('quizes/show',{quiz:req.quiz});	
};

//GET /quizes/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';	
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
		}	
		res.render('quizes/answer', {quiz:req.quiz, respuesta:resultado});	
}

//exports.answer = function (req,res) {
//	models.Quiz.findAll().success(function(quiz) {
//		if (req.query.respuesta === quiz[0].respuesta) {
//			res.render('quizes/answer',{respuesta : 'Correcto'});
//		}
//		else {
//			res.render('quizes/answer',{respuesta : 'Incorrecto'});
//		}
//	});
//};


