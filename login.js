startup = function(bot, builder, asteroid) {
    bot.dialog('/login', [
            function (session) {
                builder.Prompts.text(session, "Please give me your email");
            },
            function (session, results) {
                session.userData.email = results.response;
                builder.Prompts.text(session, "I sent a verification code to your email. What is it?");
            },
            function (session, results) {
                asteroid.loginWithPassword({
                    email: session.userData.email,
                    password: results.response
                }).then(function(result){
                    session.send("You are now logged in!");
                    session.userData.userId = result
                    session.endDialog(); 
                }).catch(function(result){
                    console.log(result);
                    session.send("Something went wrong... Please try again");
                    session.endDialog(); 
                    session.beginDialog('/login');
                });
            }
    ]);
};
module.exports = startup;
