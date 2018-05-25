let show_nav = false;

$(document).ready(() => {
    getData(setupPage)
});

let setupPage = (json_data, games) => {
    showGoalsScored(json_data, games.prev);
    getAveragePoints(json_data, games.prev);
    getUpcomingMatches(json_data, games.next);
    getPreviousResults(json_data, games.prev);
}

function showGoalsScored(teams) {
    let team_as_arr = getDisplayData(teams);
    team_as_arr.sort(sortBy('goals_scored', 'desc'));

    let max_goals = Math.max.apply(Math,team_as_arr.map(function(o){return o.goals_scored;}));
    
    addDataToTable('goals-scored', team_as_arr, 'name', 'owner', 'goals_scored', max_goals);
}

function getAveragePoints(teams, data) {
    let owners = {};

    Object.keys(teams).forEach((team_name) => {
        let team = teams[team_name];
        if (!owners.hasOwnProperty(team.owner)) {
            owners[team.owner] = {points_scored: 0, num_teams: 0};
        }
        owners[team.owner].points_scored += team.points_scored;
        owners[team.owner].num_teams++;
    });

    Object.keys(owners).forEach((name) => {
        let owner = owners[name];
        owner.average_points = owner.points_scored/owner.num_teams;
    });

    let data_as_array = getDisplayData(owners);
    data_as_array.sort(sortBy('average_points', 'desc'));

    let max_points = Math.max.apply(Math,data_as_array.map(function(o){return o.average_points;}));

    addDataToTable('average-points', data_as_array, 'name', null, 'average_points', max_points);
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

function addDataToTable(table_ID, data, middle_column_data_field, bracketed_field, end_column_data_field, max) {
    $(`#${table_ID} .stats-table .row`).each(function(index) {
        const row = data[index];
        $(this).children().each(function(span_index) {
            if (span_index === 1) {
                if (bracketed_field) {
                    $(this).html(`${row[middle_column_data_field]} (${row[bracketed_field]})`);
                } else {
                    $(this).html(`${row[middle_column_data_field]}`);
                }
            } else if (span_index === 2) {
                if (max >= 10 && row[end_column_data_field] < 10) {
                    $(this).html(`&nbsp;${row[end_column_data_field]}`);
                } else {
                    $(this).html(row[end_column_data_field]);
                }
            }
        });
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