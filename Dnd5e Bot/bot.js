
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
        var n = N.toString().substring(i, i + 1);
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
			case '-': r = ':no_entry:'; break;
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
                catch (err) { Dresult = "You did that wrong." }//add the equation to the dice
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
				if (isNaN(message.substring(2,3)) == false){
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
					try { Dresult = Dresult + eval(args) }
					catch (err) { Dresult = "You did that wrong." }
					if (Dd == "20" && NoD == 1 && D[0] == "20") {
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
								value: numberjacks(Dresult)
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
				}
                break;
				
            case "D":
            case "d":
				if (isNaN(message.substring(2,3)) == false){
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
								value: numberjacks(Dresult)
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
				}
                break;

            case "I":
                bot.sendMessage({
                    to: channelID,
                    message: "\n Welcome to Dice hoe MK.4 now with the ability to save your stats \n Use '!New' to get your application form fillit out and paste it in. \n To role a stat Check simply type the first three letters insuring the first is capitalised and add a C to the end  ex => '!StrC' this will role a Strength Check. \n To make a saving throw do the same but add an S to the end ex => '!DexS'"
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
                    if (D == "20") {
                        var aM = "\n :two::zero: NAT 20! \n"
                    } else if (D == "1") {
                        var aM = "\n :one: NAT 1! \n"
                    } else {
                    var aM = ""
                    }
                bot.sendMessage({
                    to: channelID,
                    embed: {
                        color: 1530000,
                        title: user + "'s D20 Roll Results" + aM,
                        fields: [{
                            name: "Total Result:",
                            value: numberjacks(D)
                        }
                        ]
                    }
                });
                break;
        }
//Stats are here bois
        cmd = message.substring(1, 6);
        switch (cmd) {

            case "New":
                bot.sendMessage({
                    to: channelID,
                    embed: {
                        color: 1530000,
                        title: aM + user + "'s Results",
                        fields: [{
                            name: "Instructions",
                            value: "Copy the following, insuring to fillout the space between the [] with your modifiers, and paste back into chat"
                        },
                        {
                            name: "Copy this \/",
                            value: "!NProf STATS: Str [], Dex[], Con[], Int[], Wis[], Char[]  SAVING THROWS: Str [], Dex[], Con[], Int[], Wis[], Char[]  SKILLS: Acrobatics[], Animal Handling[], Arcana[], Athletics[], Deception[], History[], Insight[], Intimidation[], Investigation[], Medicine[], Nature[], Perception[], Performance[], Persuasion[], Religion[], Slight of Hand[], Stealth[], Survival[], Initiative[]"
                        }
                        ]
                    }
                });
                break;

            case "NProf":
                var Input = message.substring(7);
                const fs = require('fs');
                fs.writeFile('Stats/' + user, Input, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
                bot.sendMessage({
                    to: channelID,
                    embed: {
                        color: 1530000,
                        title: user + ", Your Stats Have Been Saved From The Evil RAM",
                    }
                });
                break;
				
            case "Stats":
				//working
				var data = readTextFile("Stats/" + user)
                bot.sendMessage({//Not working
                    to: channelID,
                    embed: {
                        color: 1530000,
                        title: user + "'s Stats: ",//Working
						fields: [{
                            name: "Stats",
                            value: data
                        }
                        ]
                    }
                });
                break;
				
			case "StrC":
			StatRetrival(0)	
			break;
			case "DexC":
			StatRetrival(1)	
			break;
			case "ConC":
			StatRetrival(2)	
			break;
			case "IntC":
			StatRetrival(3)	
			break;
			case "WisC":
			StatRetrival(4)	
			break;
			case "ChaC":
			StatRetrival(5)	
			break;
			case "StrS":
			StatRetrival(6)	
			break;
			case "DexS":
			StatRetrival(7)	
			break;
			case "ConS":
			StatRetrival(8)	
			break;
			case "IntS":
			StatRetrival(9)	
			break;
			case "WisS":
			StatRetrival(10)	
			break;
			case "ChaS":
			StatRetrival(11)		
			break;
			case "AcrC":
			StatRetrival(12)		
			break;
			case "AniC":
			StatRetrival(13)		
			break;
			case "ArcC":
			StatRetrival(14)		
			break;
			case "AthC":
			StatRetrival(15)		
			break;
			case "DecC":
			StatRetrival(16)		
			break;
			case "HisC":
			StatRetrival(17)		
			break;
			case "InsC":
			StatRetrival(18)		
			break;
			case "IntC":
			StatRetrival(19)		
			break;
			case "InvC":
			StatRetrival(20)		
			break;
			case "MedC":
			StatRetrival(21)		
			break;
			case "NatC":
			StatRetrival(22)		
			break;
			case "PercC":
			StatRetrival(23)		
			break;
			case "PerfC":
			StatRetrival(24)		
			break;
			case "PersC":
			StatRetrival(25)		
			break;
			case "RelC":
			StatRetrival(26)		
			break;
			case "SliC":
			StatRetrival(27)		
			break;
			case "SteC":
			StatRetrival(28)		
			break;
			case "SurC":
			StatRetrival(29)		
			break;
			case "IniC":
			StatRetrival(30)		
			break;
			
			case "help": //WIP
				bot.sendMessage({
                    to: channelID,
                    message: "\n !I <- information on the curent build \n !R/!r <- roles a dice '!r1d8' roles a d8 '!r(number of dice)d(Donomination of die)' \n "});
			break;
        }
        


    }
    //Lets try character classes now

    function readTextFile(file) {
        var fs = require('fs');
		const data = fs.readFileSync('Stats/' + user,'utf8')
		console.log(data);
		return data;
    }
	
	function StatRetrival(SBCount){
		var MsgArray = readTextFile(user).split('');
		var StatArray = [];
		var count = 0;
		for (i = 0; i < MsgArray.length; i++) {
			if (MsgArray[i] == "[" && MsgArray[i+1] == "]"){
				StatArray[count] = 0;
				count++ 
			}else if (MsgArray[i] == "[" && MsgArray[i+2] == "]"){
				StatArray[count] = MsgArray[i+1];
				count++ 
			}else if (MsgArray[i] == "[" && MsgArray[i+3] == "]"){
				StatArray[count] = MsgArray[i+1]+ "" + MsgArray[i+2];
				count++ 
			}else if (MsgArray[i] == "[" && MsgArray[i+4] == "]"){//for negitve -10's
				StatArray[count] = MsgArray[i+1]+ "" + MsgArray[i+2] + "" + MsgArray[i+3];
				count++ 
			}
		}
		console.log(StatArray[SBCount]);
		var D = Math.floor((Math.random() * 20) + 1);
		var Out = D + parseInt(StatArray[SBCount])
		bot.sendMessage({//Not working
                    to: channelID,
                    embed: {
                        color: 1530000,
                        title: user + "'s " + message,//Working
						fields: [{
                            name: "Result",
                            value: numberjacks(Out)
                        },
						{
                            name: "Dice",
                            value: D
                        },
						{
							name: "Stat Modifier",
							value: parseInt(Out) - parseInt(D) 
						}
                        ]
                    }
                });
		return StatArray[SBCount];
	}
	



});