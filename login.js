startup = function(bot, builder, asteroid) {
    bot.dialog('/login', [
            function (session) {
                builder.Prompts.text(session, "Please enter your email.");
            },
            function (session, results) {
                session.userData.email = results.response;
                builder.Prompts.text(session, "Please verify your password.");
            },
            function (session, results) {
                asteroid.loginWithPassword({
                    email: session.userData.email,
                    password: results.response
                }).then(function(result){
                    session.send("Success!");
                    session.userData.userId = result
                    session.endDialog();
                    session.beginDialog('/profile');
                }).catch(function(result){
                    console.log(result);
                    session.send("Wrong login. Try again?");
                    session.endDialog(); 
                    session.beginDialog('/login');
                });
            }
    ]);
};
module.exports = startup;
