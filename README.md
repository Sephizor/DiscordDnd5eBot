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
* d20 quick roll feture by simply typing !
* Indications of natural 20s/1s on a d20

# Usage
Roll a single d20: `!` or `!r1d20`

Roll a d10 with advantage: `!a1d10`

Roll a d20 with a modifier at disadvantage: `!r1d20-3` or `!r1d20+5`

# Getting Started
To build and test the bot, run the following commands inside the "Dnd5e Bot" directory:

<pre>
npm install
npm run test
npm run build
node ./dist/Main.js
</pre>

To build and run a linux docker container:

<pre>
npm run dockerbuild
npm run startdocker
</pre>
