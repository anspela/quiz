//Se crea la definición de la tabla quiz

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Quiz',{
		pregunta:DataTypes.STRING,
		respuesta:DataTypes.STRING}
	);
}