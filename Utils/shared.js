function getData (callback) {    
    $.getJSON('teams.json', (json_data) => {
        let owners = [];
        Object.keys(json_data).forEach((key) => {
            const team = json_data[key];
            if (!owners.includes(team.owner)) {
                owners.push(team.owner);
                $('#nav').append(`<a href="participant.html?person=${team.owner}">${team.owner}</a>`);
            }
        });

        $.ajax({
            headers: { 'X-Auth-Token': '43e2645aff8f4f838d18ccfbb2c04610' },
            url: 'http://api.football-data.org/v1/soccerseasons/467/fixtures',
            dataType: 'json',
            type: 'GET'
        }).done(function(d) {
            var games = splitPrevAndNext(d);
            getGoalsScored(json_data, games.prev);
            getPointsScored(json_data, games.prev);
            callback(json_data, games);
        });
    });
}

function handleNavBar() {
    show_nav = !show_nav;

    if (show_nav) {
        $('#nav').css('display', 'block');
    } else {
        $('#nav').css('display', 'none');
    }
}

function splitPrevAndNext(data) {
    let prev = [];
    let next = [];

    data.fixtures.forEach((fixture) => {
        if (fixture.status === 'FINISHED') {
            prev.push(fixture);
        } else if (fixture.status === 'TIMED' || fixture.status === 'IN_PLAY') {
            next.push(fixture);
        }
    });

    return {prev: prev, next: next};
}

function getGoalsScored(teams, data) {
    data.forEach((game) => {
        teams[game.homeTeamName].goals_scored += game.result.goalsHomeTeam;
        teams[game.awayTeamName].goals_scored += game.result.goalsAwayTeam;
    });
}

function getPointsScored(teams, data) {
    data.forEach((game) => {
        let homeTeamName = game.homeTeamName;
        let awayTeamName = game.awayTeamName;

        if (game.result.goalsHomeTeam > game.result.goalsAwayTeam) {
            teams[homeTeamName].points_scored += 3;
        } else if (game.result.goalsHomeTeam < game.result.goalsAwayTeam) {
            teams[awayTeamName].points_scored += 3;
        } else {
            teams[homeTeamName].points_scored += 1;
            teams[awayTeamName].points_scored += 1;
        }
    });
}