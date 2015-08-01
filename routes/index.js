var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});
/* Se definen las rutas y su manejo */
router.get('/quizes',quizController.index);
//router.get('/quizes/question',quizController.question);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);
router.get('/author',function(req, res) {
	res.render('author');
});


module.exports = router;
