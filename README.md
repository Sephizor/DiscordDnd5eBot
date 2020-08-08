# Introduction
This is a discord bot for running D&D 5e campaigns written in typescript.

The token in settings.json is blank and will not work as-is. To run this, you will need to create your own discord application and bot under the [Discord developer portal](https://discordapp.com/developers/applications/) and replace the token with your own. You will then need to invite the bot to your server by visiting the URL generated under the OAuth2 tab in the discord developers UI when you tick the "Bot" checkbox.

<aside class="warning">
    If forking this repository, please ensure that you do not commit your token in settings.json as this may allow anyone to immitate your bot.
</aside>

# Current features
* Ability to roll any of the following dice: d2, d4, d6, d8, d10, d12, d20 and d100
* Roll with advatage/disadvatage using !a and !d.
* Roll a dice with ability or damage modifiers (+/-)
* Indications of natural 20s/1s on a d20
* Configurable message prefix so that the bot only responds to a specific character (! or + or . or whatever you want)
* d20 quick roll feture by simply typing the configured prefix
* Character creation and selection that supports multiple characters per user (example below)
* Two options for storage of character data: Azure Blob Storage or Local File Storage
* Skill check, stat save and initiative rolls if you have created a character
* Initiative tracker

<aside class="information">Note that private messaging the bot is limited to basic roll commands only. No character management can be done via DM as character sheets are tracked per-server.</aside>

# Usage
Roll a single d20: `!` or `!r1d20`

Roll a d10 with advantage: `!a1d10`

Roll a d20 with a modifier at disadvantage: `!r1d20-3` or `!r1d20+5`

Create a new character (<b>with modifiers!</b> Do not use raw skill numbers):
<pre>!newcharacter {"name":"samplecharacter","strength":-1,"dexterity":2,"constitution":1,"intelligence":2,"wisdom":3,"charisma":1,"strsave":-1,"dexsave":2,"consave":1,"intsave":2,"wissave":6,"chasave":4,"acrobatics":2,"animalhandling":3,"arcana":2,"athletics":-1,"deception":1,"history":5,"insight":3,"intimidation":1,"investigation":2,"medicine":6,"nature":2,"perception":6,"performance":1,"persuasion":1,"religion":2,"sleightofhand":2,"stealth":2,"survival":3,"initiative":2,"armorclass":17}
</pre>

Select a character: `!selectcharacter samplecharacter`

Update your selected character's stats: `!updatecharacter { "strength": 3, "wisdom": 1, "dexsave": 2 }`

Retrieve active character data: `!getcharacter`

Roll initiative: `!ini`

Skill checks can be performed by using the first three letters of the skill name, plus either 'c' (for check) or 's' (for save), plus optionally 'a' (for advantage) or 'd' (for disadvantage) with the following exceptions:
<pre>
!intic - Intimidation Check
!percc - Perception Check
!perfc - Performance Check
!persc - Persuasion Check
!intc - Intelligence Check

!ints - Intelligence Save
</pre>

Skill check with advantage: `!anica`

Stat save with disadvantage: `!dexsa`

# Initiative Tracking System
Initiative order can be managed through the bot using the following commands
<pre>
!init start - Starts initiative preparation
!init join - Joins your active character to the initiative order
!init join 10 - Joins your active character to the initiative order with an override value of 10
!init add SomeRandomEntity - Adds an entity called SomeRandomEntity to the initiative order
!init add SomeRandomEntity 10 - Adds an entity called SomeRandomEntity to the initiative order with an override value of 10
!init set SomeRandomEntity 20 - Manually sets an entity already in the initiative list to a specific initiative value
!init list - Prints out the initiative list
!init next - Advances the initiative to the next person. This will also start the first round of combat and increment combat rounds when the order resets.
!init end - Ends combat
</pre>

# Getting Started
To build and test the bot, run the following commands inside the "Dnd5e Bot" directory:

<pre>
npm install
npm run build
npm start
</pre>

To build and run a linux docker container:

<pre>
npm run dockerbuild
npm run startdocker
</pre>
