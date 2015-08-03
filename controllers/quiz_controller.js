/**
 * Controlador quizes/answers
 */

var models = require('../models/models.js');

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
			res.render('quizes/index', {quizes:quizes, errors:[]});
		});
	}
	else {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index', {quizes:quizes, errors:[]});
		});
	}
};

//GET /quizes/:id
exports.show = function(req, res) {			
	res.render('quizes/show',{quiz:req.quiz, errors:[]});	
};

//GET /quizes/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';	
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
		}	
		res.render('quizes/answer', {quiz:req.quiz,
									respuesta:resultado,
									errors:[]});	
}

exports.new = function(req,res) {
	var quiz = models.Quiz.build(
			{pregunta:"Pregunta", respuesta:"Respuesta"}
	);
	res.render('quizes/new',{quiz:quiz,errors:[]});
};

exports.create = function(req,res) {
	var quiz = models.Quiz.build(req.body.quiz);
	
	quiz
	.validate()
	.then(function(err){
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors:err.errors});
		}
		else {
			//guarda en DB los campos pregunta y respuesta de quiz
			quiz.save({fields:["pregunta","respuesta","tema"]}).then(function(){
				res.redirect('/quizes');
			}); //Redirecci´on http a la lista de prevguntas
		}			
	});	
};

exports.edit = function(req,res) {
	var quiz = req.quiz; //autoload de instancia de quiz
	
	res.render('quizes/edit',{quiz:quiz, errors:[]});
}

exports.update = function(req,res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	
	req.quiz.validate().then(function(err){
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors:err.errors});
		} 
		else {
			req.quiz.save({fields:["pregunta","respuesta","tema"]})
			.then(function(){res.redirect('/quizes');});
		}
	});
}

exports.destroy = function(req,res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
}

