var badgeDict = {
    'proficient' : 'badge-warning',
    'personal' : 'badge-danger',
    'school' : 'badge-light',
    'work' : 'badge-dark',
}

function checkNavbar(location) {
    //console.log($(window).scrollTop());
    if ($(window).scrollTop() > location) {
        //$('#nav_bar').show();
        $('#nav_bar').addClass('navbar-fixed');
    }
    if ($(window).scrollTop() < location) {
        //$('#nav_bar').hide();
        $('#nav_bar').removeClass('navbar-fixed');
    }
}

function makeCard(data) {
    var cardDiv = $('<div></div>').addClass('card bg-transparent text-white border-light');
    var cardBody = $('<div></div>').addClass('card-body');

    var link;
    if (data.link) {
        //link = '<a href="' + data.link + '"></a>';
        link = $('<a></a>').attr('href', data.link);
    }

    if (data.img) {
        var img = $('<img>').addClass('card-img-top').attr('src', data.img);
        if (data.img_title) {
            img.attr('title', data.img_title);
        }

        /*
        if (link) {
            console.log(link);
            var imgLink = link.clone()[0];
            console.log(imgLink);
            $(img).wrap('<div></div>');
        }
        */
        cardDiv.append(img);
    }

    if (data.title) {
        var title = $('<h5></h5>').addClass('card-title').text(data.title);
        if (link) {
            title = $.extend(true, {}, link).append(title);
        }
        cardBody.append(title);
    }

    if (data.subtitle) {
        var subtitle = $('<h6></h6>').addClass('card-subtitle mb-2 text-muted').text(data.subtitle);
        cardBody.append(subtitle);
    }

    if (data.text) {
        var text = $('<h6></h6>').addClass('card-text').html(data.text);
        cardBody.append(text);
    }


    if(data.footnote) {
        console.log(data.footnote);
        var footnote = $('<small></small>').addClass('card-text text-muted');
        footnote.append(data.footnote);
        cardBody.append(footnote);
    }

    if (data.tags) {
        var cardTags = $('<div></div>');
        var x;
        for (x in data.tags) {
            var badge = $('<span></span>').addClass('badge').text(data.tags[x]);
            badge.addClass(badgeDict[data.tags[x]]);
            cardTags.append(badge);
            cardTags.append(' ');
        }
        cardBody.append(cardTags);

    }

    cardDiv.append(cardBody);
    return cardDiv;
}

function loadWork() {
    var i;
    for (i in work) {
        var row = $('<tr></tr>');
        var company = $('<td></td>').html(work[i].company);
        var role = $('<td></td>').text(work[i].role);
        var duration = $('<td></td>').html(work[i].duration);
        var notes = $('<td></td>').addClass('text-justify').text(work[i].notes);

        row.append(company);
        row.append(role);
        row.append(duration);
        row.append(notes);

        $('#table-body').append(row);
    }
}

function loadCards(data, location) {
    var i;
    for (i in data) {
        var card = makeCard(data[i]);
        $(location).append(card);
    }
}

$(document).ready(function() {
    var LOCATION = 970;

    loadWork();
    loadCards(skills, '#skills-cards');
    loadCards(projects, '#projects-cards');

    $(window).scroll(function () {
        checkNavbar(LOCATION);
    });
});
