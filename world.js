"use strict";

var fs = require('fs');

var Player = require('./player.js');
var Utils = require('./utils.js');

function World () {
	
	var _this = this;
	_this.state = resetState();

	function resetState () {
		var state = {
			session: "end",
			health: 50,
			players: {},
			ttl: 3000,
			controls: JSON.parse(fs.readFileSync('./controls.json', { encoding: 'utf8' })),
			outstanding: {},

			MINPLAYERS: 1,
			CONTROLS_PER_PLAYER: 6,
			COMMAND_TTL: 5000,

			HEALTH_TIMEOUT_PENALTY: -10,
			HEALTH_BONUS: 5,
		};

		state.controls = state.controls.unified;
		return state;
	}

	_this.setHealthIncr = function (incr) {
		var val = _this.state.health + incr;
		_this.state.health = Utils.clamp(val, 0, 100);
		_this.broadcast('health', _this.state.health);
	};

	_this.addPlayer = function (socket) {
		var player = new Player({
			socket: socket,
			world: _this,
		});

		var ip = socket.handshake.address.address;
		_this.state.players[ip] = player;

		socket.on('disconnect', function () {
			delete _this.state[ip];
			_this.endGame();
		});
	};

	_this.startGame = function () {
		var num_players = _this.numPlayersOnline();
		if (num_players < _this.state.MINPLAYERS) {
			_this.broadcast('alert', { 
				text: Utils.plural(num_players, "You need " + (_this.state.MINPLAYERS - num_players) + " more player[[s]] to start."),
			});
			return;
		}

		_this.state.session = 'start';
		_this.broadcast('lifecycle', 'start');

		assignControls();

		_this.broadcast('health', _this.state.health);

		issueInitialCommands();
	};

	_this.endGame = function () {
		var players = _this.state.players;
		_this.state = resetState();
		_this.state.players = players;

		_this.broadcast('lifecycle', 'stop');
	};

	_this.broadcast = function (evt, payload) {
		Utils.forEach(_this.state.players, function (ip, player) {
			player.send(evt, payload);
		});
	};

	_this.numPlayersOnline = function () {
		return Object.keys(_this.state.players).length;
	};

	function issueInitialCommands () {
		Utils.forEach(_this.state.players, function (ip, player) {
			player.issueRandomCommand();
		});
	};

	function assignControls () {
		var controls = JSON.parse(JSON.stringify(_this.state.controls));
		var keys = Object.keys(controls);

		// Randomly assign controls
		Utils.forEach(_this.state.players, function (ip, player) {

			var player_controls = {};
			for (var ct = 0; ct < _this.state.CONTROLS_PER_PLAYER; ct++) {
				var control_id = Utils.random_choice_no_replacement(keys);
				var control = controls[control_id];
				player_controls[control_id] = control.label;
			}

			player.setControls(player_controls);
		});
	}
}

module.exports = World;