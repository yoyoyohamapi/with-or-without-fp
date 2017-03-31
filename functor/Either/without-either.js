const players = require('../players');

function getLastNames(players) {
    try {
        const names = players.map(player => player.name);
        const lastNames = names.map(name => name.split(' ')[1]);
        return lastNames;
    } catch (e) {
        console.error('error:', ' players should be an array')
    }
}

console.log('players:', getLastNames(players)); // =>  ['Curry', 'James', 'Paul', 'Thompson', 'Wade' ]
getLastNames({}); // => error:  players should be an array
