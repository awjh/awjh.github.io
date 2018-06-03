let person;

$(document).ready(() => {
    person = getUrlParameter('person');

    if (!person || person.trim() === '') {
        window.location.href = 'index.html';
    }

    $('#participant').html(person);

    getData(setupPage)
});

let setupPage = (teams, games) => {
    $(`#${person}`).addClass('selected');

    let found_counter = 0;

    let teams_as_array = Object.keys(teams).map((key) => {
        return Object.assign(teams[key], {name: key});
    });

    const max_prev_games = Math.max.apply(Math,teams_as_array.map(function(o){return o.previous_games.length;}))

    teams_as_array.forEach((team) => {
        if (team.owner === person) {
            found_counter++;

            $('#standings-holder').append(`
            <div class="stats" id="team-${found_counter}" >
                <div class="title" >${team.name}</div>
                <div class="divider"></div>
                <div class="stats-list" >
                    <div class="item" >Goals Scored: ${team.goals_scored}</span></div>
                    <div class="item" >Points Scored: ${team.points_scored}</div>
                </div>
                <br />
                <div class="stats-header" >
                    Previous Results:
                </div>
                <div class="stats-list previous-results" ></div>
                <br />
                <div class="stats-header" >
                    Next Match:
                </div>
                <div class="stats-list next-match" >
                </div>
            </div>`);

            if (team.previous_games.length === 0) {
                $(`#team-${found_counter} .previous-results`).html(`<div class="item" >None</div>`);
            } else {
                team.previous_games.forEach((game) => {
                    if (!game.hasOwnProperty('penaltyShootout')) {
                        $(`#team-${found_counter} .previous-results`).append(`<div class="item" >${game.resultType} ${game.goals.for} - ${game.goals.against} vs ${game.playing} (${teams[game.playing].owner})</div>`);
                    } else {
                        $(`#team-${found_counter} .previous-results`).append(`<div class="item" >${game.resultType} ${game.goals.for} (${game.penaltyShootout.for}) - (${game.penaltyShootout.against}) ${game.goals.against} vs ${game.playing} (${teams[game.playing].owner})</div>`);
                    }
                });
            }

            if (team.next_games.length === 0) {
                $(`#team-${found_counter} .next-match`).html(`<div class="item" >None</div>`);
            } else {
                $(`#team-${found_counter} .next-match`).html(`<div class="item" >${team.next_games[0]} (${teams[team.next_games[0]].owner})</div>`);
            }

            for (i = $(`#team-${found_counter} .previous-results .item`).length; i < max_prev_games; i++) {
                $(`#team-${found_counter} .next-match`).append(`<div class="item" >&nbsp;</div>`);
            }
        }
    });

    let widest = 0;
    $('.stats').each(function () { widest = Math.max(widest, $(this).outerWidth()); }).width(widest);
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};