let show_nav = false;

function getData (callback) {    
    $.getJSON('teams.json', (json_data) => {
        let owners = [];
        Object.keys(json_data).forEach((key) => {
            const team = json_data[key];
            if (!owners.includes(team.owner)) {
                owners.push(team.owner);
                $('#nav').append(`<a id="${team.owner}" href="participant.html?person=${team.owner}">${team.owner}</a>`);
            }
        });

        $.ajax({
            headers: { 'X-Auth-Token': '43e2645aff8f4f838d18ccfbb2c04610' },
            url: 'http://api.football-data.org/v1/soccerseasons/467/fixtures',
            dataType: 'json',
            type: 'GET'
        }).done(function(d) {
            var games = handlePrevAndNext(json_data, d);
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

function handlePrevAndNext(teams, data) {
    let prev = [];
    let next = [];

    data.fixtures.forEach((fixture) => {
        if (fixture.status === 'FINISHED') {
            let result_objects = getWinnerFromResult(fixture);
            teams[fixture.homeTeamName].previous_games.push(result_objects.home);
            teams[fixture.awayTeamName].previous_games.push(result_objects.away);
            prev.push(fixture);
        } else if (fixture.status === 'TIMED' || fixture.status === 'IN_PLAY') {
            teams[fixture.homeTeamName].next_games.push(fixture.awayTeamName);
            teams[fixture.awayTeamName].next_games.push(fixture.homeTeamName);
            next.push(fixture);
        }
    });

    return {prev: prev, next: next};
}

function getGoalsScored(teams, data) {
    data.forEach((game) => {
        teams[game.homeTeamName].goals_scored += game.result.goalsHomeTeam;
        teams[game.awayTeamName].goals_scored += game.result.goalsAwayTeam;

        if (game.result.extraTime) {
            teams[game.homeTeamName].goals_scored += game.result.extraTime.goalsHomeTeam;
            teams[game.awayTeamName].goals_scored += game.result.extraTime.goalsAwayTeam;
        }
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

function getWinnerFromResult(game) {
    let return_object = {home: {}, away: {}};
    return_object.home.playing = game.awayTeamName;
    return_object.home.goals = {for: game.result.goalsHomeTeam, against: game.result.goalsAwayTeam};
    return_object.away.playing = game.homeTeamName;
    return_object.away.goals = {for: game.result.goalsAwayTeam, against: game.result.goalsHomeTeam};

    if (game.result.goalsHomeTeam > game.result.goalsAwayTeam) {
        return_object.home.resultType = 'W';
        return_object.away.resultType = 'L';
    } else if (game.result.goalsHomeTeam < game.result.goalsAwayTeam) {
        return_object.home.resultType = 'L';
        return_object.away.resultType = 'W';
    } else {
        if (game.result.extraTime) {
            return_object.home.goals = {for: game.result.goalsHomeTeam + game.result.extraTime.goalsHomeTeam, against: game.result.goalsAwayTeam + game.result.extraTime.goalsAwayTeam};
            return_object.away.goals = {for: game.result.goalsAwayTeam + game.result.extraTime.goalsAwayTeam, against: game.result.goalsHomeTeam + game.result.extraTime.goalsHomeTeam};

            if (game.result.extraTime.goalsHomeTeam > game.result.extraTime.goalsAwayTeam) {
                return_object.home.resultType = 'W';
                return_object.away.resultType = 'L';
            } else if (game.result.extraTime.goalsHomeTeam < game.result.extraTime.goalsAwayTeam) {
                return_object.home.resultType = 'L';
                return_object.away.resultType = 'W';
            } else {
                return_object.home.penaltyShootout = {for: game.result.penaltyShootout.goalsHomeTeam, against: game.result.penaltyShootout.goalsAwayTeam};
                return_object.away.penaltyShootout = {for: game.result.penaltyShootout.goalsAwayTeam, against: game.result.penaltyShootout.goalsHomeTeam};

                if (game.result.penaltyShootout.goalsHomeTeam > game.result.penaltyShootout.goalsAwayTeam) {
                    return_object.home.resultType = 'W';
                    return_object.away.resultType = 'L';
                } else {
                    return_object.home.resultType = 'L';
                    return_object.away.resultType = 'W';
                }
            }
        } else {
            return_object.home.resultType = 'D';
            return_object.away.resultType = 'D';
        }
    }
    return return_object;
}