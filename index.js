let show_nav = false;

$(document).ready(() => {
    $.getJSON('teams.json', (json_data) => {
        $.ajax({
            headers: { 'X-Auth-Token': '43e2645aff8f4f838d18ccfbb2c04610' },
            url: 'http://api.football-data.org/v1/soccerseasons/467/fixtures',
            dataType: 'json',
            type: 'GET'
        }).done(function(d) {
            var games = splitPrevAndNext(d);
            getGoalsScored(json_data, games.prev);
            getUpcomingMatches(json_data, games.next);
            getPreviousResults(json_data, games.prev);
        });
    });
})

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

    let team_as_arr = getDisplayData(teams);
    team_as_arr.sort(sortBy('goals_scored', 'desc'));

    let max_goals = Math.max.apply(Math,team_as_arr.map(function(o){return o.goals_scored;}));
    
    $('#goals-scored .stats-table .row').each(function(index) {
        const team = team_as_arr[index];
        $(this).children().each(function(span_index) {
            if (span_index === 1) {
                $(this).html(`${team.name} (${team.owner})`);
            } else if (span_index === 2) {
                if (max_goals >= 10 && team.goals_scored < 10) {
                    $(this).html(`&nbsp;${team.goals_scored}`);
                } else {
                    $(this).html(team.goals_scored);
                }
            }
        });
    });
}

function getUpcomingMatches(teams, data) {
    if (data.length === 0) {
        $('#upcoming-matches .no-display').css('display', 'inline-block');
        return;
    }
    data.sort(sortBy('date', 'asc'));
    $('#upcoming-matches .stats-list .item').each(function(index) {
        const game = data[index];
        if (typeof game !== 'undefined') {
            $(this).html(`${game.homeTeamName} (${teams[game.homeTeamName].owner}) Vs ${game.awayTeamName} (${teams[game.awayTeamName].owner})`);
        }
    });
}

function getPreviousResults(teams, data) {
    if (data.length === 0) {
        $('#previous-results .no-display').css('display', 'inline-block');
        return
    }
    data.sort(sortBy('date', 'desc'));
    $('#previous-results .stats-list .item').each(function(index) {
        const game = data[index];
        if (typeof game !== 'undefined') {
            $(this).html(`${game.homeTeamName} (${teams[game.homeTeamName].owner}) ${game.result.goalsHomeTeam} - ${game.result.goalsAwayTeam} ${game.awayTeamName} (${teams[game.awayTeamName].owner})`);
        }
    });
}

function getDisplayData(data) {
    let arr = Object.keys(data).map((el) => {
        return Object.assign(data[el], {name: el});
    });
    
    return arr;
}

function sortBy(field, direction) {
    let ret_1 = 1;
    let ret_2 = -1;
    if (direction === 'desc') {
        ret_1 = -1;
        ret_2 = 1;
    }
    return function(a, b) {
        if (a[field] > b[field]) {
            return ret_1;
        } else if (a[field] < b[field]) {
            return ret_2;
        }
        return 0;
    };
}