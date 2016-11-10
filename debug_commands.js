startup = function(bot, builder, asteroid, dialog) {
    // dialogs to check backend
    dialog.matches(/\/login_info/, function(session) {
        console.log(session.userData);
        if (session.userData.meteorId) {
            session.send("You user id is " + session.userData.meteorId);
        }
        else {
            session.send("You are not logged in.")
        }
    });

    dialog.matches(/\/login_set/, function(session) {
        match = session.message.text.match("\/login_set (.+)");
        session.userData.meteorId = match[1];
        console.log(session.userData);
        session.send("Updated login information");
    });

    dialog.matches(/\/login_reset/, function(session) {
        session.userData = {};
        session.send("Cleared login information");
    });

    dialog.matches(/\/filter_sector/, function(session) {
        match = session.message.text.match("\/filter_sector (.+)");
        asteroid.call('setFilter', {meteorId:session.userData.meteorId, filter:{sector: match[1]}});
        session.send("filtered sector to %s", match[1]);
    });

    dialog.matches(/\/show_news .+/, function(session) {
        match = session.message.text.match("\/show_news (.+)");
        asteroid.call("getNews",{sector: match[1]})
            .then(function(data) {
                for (var i in data) {
                    news = data[i];
                    session.send(news.title+"\n"+news.url);
                    session.endDialog();
                }
            })
            .catch(function(data) {
                session.send("Opps. Something is not right");
            });
    });
    
};

module.exports = startup;
