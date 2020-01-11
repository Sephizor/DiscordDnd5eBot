var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

function numberjacks(N) { //takes any number and displays it in emoji form.
    var output = " ";
    for (i = 0; i < N.toString().length; i++) {
        var n = N.toString().substring(i,i+1);
        var r;
        switch (n) {
            case '0': r = ':zero:'; break;
            case '1': r = ':one:'; break;
            case '2': r = ':two:'; break;
            case '3': r = ':three:'; break;
            case '4': r = ':four:'; break;
            case '5': r = ':five:'; break;
            case '6': r = ':six:'; break;
            case '7': r = ':seven:'; break;
            case '8': r = ':eight:'; break;
            case '9': r = ':nine:'; break;
        }
        output = output.toString() + r;
    }
    return output;
}

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        // Sets the command to the second character ex: "!R2d8+5" = "R"
        var cmd = message.substring(1, 2);
        var oparand = ["+", "-"];
        switch (cmd) {
            // !ping
            case 'R':
            case 'r':
                    var Pargs = message.substring(2).split('+');
                    var Margs = message.substring(2).split('-');
                    if (Margs[0].length < Pargs[0].length) {
                        var args = "0" + message.substring(2 + Margs[0].length)
                        var Dice = Margs[0].split("d");
                    }
                    else {
                        var args = "0" + message.substring(2 + Pargs[0].length)
                        var Dice = Pargs[0].split("d");
                    }//mk.2: Args is now the expression
                    var NoD = Dice[0];
                    var Dd = Dice[1];
                    var Dresult = 0;
                    Dresult = 0.00;
                    var i;
                    var D = new Array(NoD);
                    for (i = 0; i < NoD; i++) {
                        D[i] = Math.floor((Math.random() * Dd) + 1);
                        Dresult = Dresult + D[i];
                    }
                try { Dresult = Dresult + eval(args) }
                catch (err) { Dresult = "You did that wrong."}//add the equation to the dice
                    if (Dd == "20" && NoD == 1 && D[0] == "20") {
                        var aM = "\n :two::zero: NAT 20! \n"
                    } else if (Dd == "20" && NoD == 1 && D[0] == "1") {
                        var aM = "\n :one: NAT 1! \n"
                    } else {
                        var aM = ""
                    }
                    var Out = aM + " @" + user + " \n :game_die:Result[" + numberjacks(Dresult) + "]:game_die: \n Input[" + message.substring(2) + "] \n Dice[" + D + "]"
                    for (b = 0; b < D.length; b++) {
                        if (isNaN(D[b])) {
                            Out = " @" + user + "\n :octagonal_sign: You did that wrong silly! :octagonal_sign: \n Example: !R'Number of Die'd'Dice Type'+'any additons(don't divde or multiply dice directly)'";
                        }
                    }
                    bot.sendMessage({
                        to: channelID,
                        embed: {
                            color: 1530000,
                            title: aM + user + "'s Results",
                            fields: [{
                                name: "Total Result:",
                                value: numberjacks(Dresult)
                            },
                            {
                                name: "Dice Rolls:",
                                value: String(D)
                            },
                            {
                                name: "Input:",
                                value: message.substring(2)
                            }
                            ]
                        }
                    });
                    break;

            case "A":
            case "a":
                                   // So this Splits the message by + dropping the first two characters ex:"!R2d8+5" = "2d8" and "5"
                    var Pargs = message.substring(2).split('+');
                    var Margs = message.substring(2).split('-');
                    if (Margs[0].length < Pargs[0].length) {
                        var args = "0" + message.substring(2 + Margs[0].length)
                        var Dice = Margs[0].split("d");
                    }
                    else {
                        var args = "0" + message.substring(2 + Pargs[0].length)
                        var Dice = Pargs[0].split("d");
                    }
                    var NoD = Dice[0];
                    var Dd = Dice[1];
                    var Dresult = 0;
                    Dresult = 0.00;
                    var i;
                    var D = new Array(NoD);
                    var LowerRolls = new Array(D.length)
                    for (i = 0; i < NoD; i++) {
                        var a = Math.floor((Math.random() * Dd) + 1);
                        var b = Math.floor((Math.random() * Dd) + 1);
                        D[i] = Math.max(a, b);
                        LowerRolls[i] = Math.min(a, b);
                        Dresult = Dresult + D[i];
                    }
                try{Dresult = Dresult + eval(args)}
                catch (err) { Dresult = "You did that wrong." }
                    if (Dd == "20" && NoD == 1 && D[0] == "20"){
                        var aM = " :two::zero: NAT 20! \n"
                    } else if (Dd == "20" && NoD == 1 && D[0] == "1") {
                        var aM = " :one: NAT 1! \n"
                    } else {
                        var aM = ""
                    }
                    var Out = aM + " @" + user + "\n :game_die:Result[" + Dresult + "]:game_die: \n Input[" + message.substring(2) + "] \n Dice[" + D + "] \n Lower Rolls[" + LowerRolls + "]"
                    bot.sendMessage({
                        to: channelID,
                        embed: {
                            color: 1530000,
                            title: aM + user + "'s Results",
                            fields: [{
                                name: "Total Result:",
                                value: Dresult
                            },
                            {
                                name: "Dice Rolls:",
                                value: String(D) + ", " + LowerRolls
                            },
                            {
                                name: "Input:",
                                value: message.substring(2) + " with advantage"
                            }
                            ]
                        }
                    });
                    break;
            case "D":
            case "d":

                    // So this Splits the message by + dropping the first two characters ex:"!R2d8+5" = "2d8" and "5"
                    var Pargs = message.substring(2).split('+');
                    var Margs = message.substring(2).split('-');
                    if (Margs[0].length < Pargs[0].length) {
                        var args = "0" + message.substring(2 + Margs[0].length)
                        var Dice = Margs[0].split("d");
                    }
                    else {
                        var args = "0" + message.substring(2 + Pargs[0].length)
                        var Dice = Pargs[0].split("d");
                    }
                    var NoD = Dice[0];
                    var Dd = Dice[1];
                    var Dresult = 0;
                    Dresult = 0.00;
                    var i;
                    var D = new Array(NoD);
                    var HigherRolls = new Array(D.length)
                    for (i = 0; i < NoD; i++) {
                        var a = Math.floor((Math.random() * Dd) + 1);
                        var b = Math.floor((Math.random() * Dd) + 1);
                        D[i] = Math.min(a, b);
                        Dresult = Dresult + D[i];
                        HigherRolls[i] = Math.max(a, b);
                    }
                try { Dresult = Dresult + eval(args) }
                catch (err) { Dresult = "You did that wrong." }
                    if (Dd == "20" && NoD == 1 && D[0] == "20") {
                        var aM = " :two::zero: NAT 20! \n"
                    } else if (Dd == "20" && NoD == 1 && D[0] == "1") {
                        var aM = " :one: NAT 1! \n"
                    } else {
                        var aM = ""
                    }
                    var Out = aM + " @" + user + "\n :game_die:Result[" + Dresult + "]:game_die: \n Input[" + message.substring(2) + "] \n Dice[" + D + "] \n Higher Rolls[" + HigherRolls + "]"
                    bot.sendMessage({
                        to: channelID,
                        embed: {
                            color: 1530000,
                            title: aM + user + "'s Results",
                            fields: [{
                                name: "Total Result:",
                                value: Dresult
                            },
                            {
                                name: "Dice Rolls:",
                                value: String(D) + ", " + HigherRolls
                            },
                            {
                                name: "Input:",
                                value: message.substring(2) + " with disadvantage"
                            }
                            ]
                        }
                    });
                    break;

            case "I":
                bot.sendMessage({
                    to: channelID,
                    message: "\n Welcome to Dice hoe MK.3 now with quick roll just type " + "'!'" + " and Boom d20 roll, also new punchy results, and many fixes"
                });
                break;

            case "0":
                bot.sendMessage({
                    to: channelID,
                    message: "Thank you DM"
                });
                break;
            case "1":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Bardius!"
                });
                break;

            case "2":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Bbukkett!"
                });
                break;

            case "3":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Erador!"
                });
                break;

            case "4":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Riastrad!"
                });
                break;

            case "5":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Val'Ken!"
                });
                break;
                
            case "": //Quick roll
                var D = Math.floor((Math.random() * 20) + 1);
                    bot.sendMessage({
                        to: channelID,
                        embed: {
                            color: 1530000,
                            title: user + "'s D20 Roll Results",
                            fields: [{
                                name: "Total Result:",
                                value: numberjacks(D)
                            }
                            ]
                        }
                    });
                    var D = new Array(NoD);
                    for (i = 0; i < NoD; i++) {
                        D[i] = Math.floor((Math.random() * Dd) + 1);
                        Dresult = Dresult + D[i];
                    }
                try { Dresult = Dresult + eval(args) }
                catch (err) { Dresult = "You did that wrong."}//add the equation to the dice
                    if (Dd == "20" && NoD == 1 && D[0] == "20") {
                        var aM = "\n :two::zero: NAT 20! \n"
                    } else if (Dd == "20" && NoD == 1 && D[0] == "1") {
                        var aM = "\n :one: NAT 1! \n"
                    } else {
                        var aM = ""
                    }
                    var Out = aM + " @" + user + " \n :game_die:Result[" + Dresult + "]:game_die: \n Input[" + message.substring(2) + "] \n Dice[" + D + "]"
                    for (b = 0; b < D.length; b++) {
                        if (isNaN(D[b])) {
                            Out = " @" + user + "\n :octagonal_sign: You did that wrong silly! :octagonal_sign: \n Example: !R'Number of Die'd'Dice Type'+'any additons(don't divde or multiply dice directly)'";
                        }
                    }
                    bot.sendMessage({
                        to: channelID,
                        embed: {
                            color: 1530000,
                            title: aM + user + "'s Results",
                            fields: [{
                                name: "Total Result:",
                                value: Dresult
                            },
                            {
                                name: "Dice Rolls:",
                                value: String(D)
                            },
                            {
                                name: "Input:",
                                value: message.substring(2)
                            }
                            ]
                        }
                    });
                    break;

            case "A":
            case "a":
                                   // So this Splits the message by + dropping the first two characters ex:"!R2d8+5" = "2d8" and "5"
                    var Pargs = message.substring(2).split('+');
                    var Margs = message.substring(2).split('-');
                    if (Margs[0].length < Pargs[0].length) {
                        var args = "0" + message.substring(2 + Margs[0].length)
                        var Dice = Margs[0].split("d");
                    }
                    else {
                        var args = "0" + message.substring(2 + Pargs[0].length)
                        var Dice = Pargs[0].split("d");
                    }
                    var NoD = Dice[0];
                    var Dd = Dice[1];
                    var Dresult = 0;
                    Dresult = 0.00;
                    var i;
                    var D = new Array(NoD);
                    var LowerRolls = new Array(D.length)
                    for (i = 0; i < NoD; i++) {
                        var a = Math.floor((Math.random() * Dd) + 1);
                        var b = Math.floor((Math.random() * Dd) + 1);
                        D[i] = Math.max(a, b);
                        LowerRolls[i] = Math.min(a, b);
                        Dresult = Dresult + D[i];
                    }
                try{Dresult = Dresult + eval(args)}
                catch (err) { Dresult = "You did that wrong." }
                    if (Dd == "20" && NoD == 1 && D[0] == "20"){
                        var aM = " :two::zero: NAT 20! \n"
                    } else if (Dd == "20" && NoD == 1 && D[0] == "1") {
                        var aM = " :one: NAT 1! \n"
                    } else {
                        var aM = ""
                    }
                    var Out = aM + " @" + user + "\n :game_die:Result[" + Dresult + "]:game_die: \n Input[" + message.substring(2) + "] \n Dice[" + D + "] \n Lower Rolls[" + LowerRolls + "]"
                    bot.sendMessage({
                        to: channelID,
                        embed: {
                            color: 1530000,
                            title: aM + user + "'s Results",
                            fields: [{
                                name: "Total Result:",
                                value: Dresult
                            },
                            {
                                name: "Dice Rolls:",
                                value: String(D) + ", " + LowerRolls
                            },
                            {
                                name: "Input:",
                                value: message.substring(2) + " with advantage"
                            }
                            ]
                        }
                    });
                    break;
            case "D":
            case "d":

                    // So this Splits the message by + dropping the first two characters ex:"!R2d8+5" = "2d8" and "5"
                    var Pargs = message.substring(2).split('+');
                    var Margs = message.substring(2).split('-');
                    if (Margs[0].length < Pargs[0].length) {
                        var args = "0" + message.substring(2 + Margs[0].length)
                        var Dice = Margs[0].split("d");
                    }
                    else {
                        var args = "0" + message.substring(2 + Pargs[0].length)
                        var Dice = Pargs[0].split("d");
                    }
                    var NoD = Dice[0];
                    var Dd = Dice[1];
                    var Dresult = 0;
                    Dresult = 0.00;
                    var i;
                    var D = new Array(NoD);
                    var HigherRolls = new Array(D.length)
                    for (i = 0; i < NoD; i++) {
                        var a = Math.floor((Math.random() * Dd) + 1);
                        var b = Math.floor((Math.random() * Dd) + 1);
                        D[i] = Math.min(a, b);
                        Dresult = Dresult + D[i];
                        HigherRolls[i] = Math.max(a, b);
                    }
                try { Dresult = Dresult + eval(args) }
                catch (err) { Dresult = "You did that wrong." }
                    if (Dd == "20" && NoD == 1 && D[0] == "20") {
                        var aM = " :two::zero: NAT 20! \n"
                    } else if (Dd == "20" && NoD == 1 && D[0] == "1") {
                        var aM = " :one: NAT 1! \n"
                    } else {
                        var aM = ""
                    }
                    var Out = aM + " @" + user + "\n :game_die:Result[" + Dresult + "]:game_die: \n Input[" + message.substring(2) + "] \n Dice[" + D + "] \n Higher Rolls[" + HigherRolls + "]"
                    bot.sendMessage({
                        to: channelID,
                        embed: {
                            color: 1530000,
                            title: aM + user + "'s Results",
                            fields: [{
                                name: "Total Result:",
                                value: Dresult
                            },
                            {
                                name: "Dice Rolls:",
                                value: String(D) + ", " + HigherRolls
                            },
                            {
                                name: "Input:",
                                value: message.substring(2) + " with disadvantage"
                            }
                            ]
                        }
                    });
                    break;

            case "I":
                bot.sendMessage({
                    to: channelID,
                    message: "\n Welcome to Dice hoe MK.2 now with native negitve numbers, new display and less Bardius swearing also LIMITED multiplication & divison \n Use '!R' to do a regular roll !R2d8+5 -> Result[7] Dice[1,1] \n Use '!A' to roll with advantage !A2d8+5 -> Result[9] Dice[2,2] Lower Dice[1,1] \n Use '!D' to roll with disadvantage !D2d8+5 -> Result[7] Dice[1,1] Higher Dice[8,8]"
                });
                break;

            case "0":
                bot.sendMessage({
                    to: channelID,
                    message: "Thank you DM"
                });
                break;
            case "1":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Bardius!"
                });
                break;

            case "2":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Bbukkett!"
                });
                break;

            case "3":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Erador!"
                });
                break;

            case "4":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Riastrad!"
                });
                break;

            case "5":
                bot.sendMessage({
                    to: channelID,
                    message: "Fuck you Val'Ken!"
                });
                break;
                
        }
    }
});
