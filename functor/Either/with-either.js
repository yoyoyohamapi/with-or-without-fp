const F = require('../../fp');
const players = require('../players');

const getPlayers = players => !Array.isArray(players) ?
    F.Left.of('players should be an array') :
    F.Right.of(players);

const getLastNames = F.compose(
    F.feither(F.log('error', 'error:'), F.log('debug', 'players:')),
    F.fmap(F.map(F.last)),
    F.fmap(F.map(F.split(' '))),
    F.fmap(F.map(F.property('name'))),
    getPlayers
);

getLastNames(players); // => players: [ 'Curry', 'James', 'Paul', 'Thompson', 'Wade' ]
getLastNames({}); // => error: players should be an array
