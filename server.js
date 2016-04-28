var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function(req, res) {
	res.json(todos);
});

app.get('/todos/:id', function(req, res) {
	
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo) {
		res.status(404).send();
	} else {
		res.json(matchedTodo);
	}

});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	// trim description
	body.description = body.description.trim();

	// assign then increment id count
	body.id = todoNextId++;

	// push into collection
	todos.push(body);

	res.json(body);
});

app.put('/todos/:id', function(req, res) {
	
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	// No todo with this id
	if(!matchedTodo) {
		return res.status(404).send();
	}

	// Validate completed
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	// Validate description
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	// Update matchedTodo
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo) {
		res.status(404).json({"error": "No todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}

});

app.listen(PORT, function() {
	console.log('Express server started on port:' + PORT + '.');
});