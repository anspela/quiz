//Get /login --fORMULARIO DE LOGON

//MW de autorización
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	}
	else {
		res.redirect('/login');
	}
}

exports.new = function(req,res) {
	var errors = req.session.errors || {};
	req.session.errors = {};
	
	res.render('sessions/new',{errors:errors});
}

//POST /login --Crear la sesion
exports.create = function(req,res) {
	var login = req.body.login;
	var password = req.body.password;
	
	var userController = require('./user_controller');
	userController.autenticar(login,password,function(error,user) {
		if (error) {
			req.session.errors = [{"message" : 'Se ha producido un error : '+error}];
			res.redirect("/login");
			return;
		}
		
		//Se crea req.session.user y se guardan los cambios id y username
		//La sesión se define por la existencia de req.session.user
		req.session.user = {id:user.id, username:user.username, lastTime:Date.now()};		
		res.redirect(req.session.redir.toString()); //Se redirige a la página anterior de login
	});
};

//DELETE /logout --Se destruye la session
exports.destroy = function (req,res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString()); //Se redirije a la pág anterior
};