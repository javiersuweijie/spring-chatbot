startup = function(bot, builder, asteroid) {
    bot.dialog('/news', [
            function (session) {
                if (!session.userData.sector)
                    session.userData.sector = "fintech";
                session.send("Here are the latest news for the "+session.userData.sector + " sector");
                news_promise = asteroid.call("getNews",{sector: session.userData.sector});
                news_promise.then(function(data) {
                    for (var i in data) {
                        news = data[i];
                        console.log(news);
                        session.send(news.title+"\n"+news.url);
                        session.endDialog();
                    }
                }).catch(function(data) {
                    session.send("Something is wrong.");
                });
            }
    ]);
};
module.exports = startup;
