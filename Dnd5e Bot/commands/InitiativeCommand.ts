import ICommand from "./ICommand";
import { MessageEmbedField } from "discord.js";
import IStorageClient from "../persistence/IStorageClient";
import StorageClientFactory from "../persistence/StorageClientFactory";
import DiceRoller, { RollType } from "./DiceRoller";
import { ICharacter } from "../Character";

interface CharacterInitiative {
    characterName: string,
    initiative: number;
}

enum InitiativeState {
    PREPARING,
    IN_PROGRESS,
    ENDED
}

interface ServerInitiative {
    serverId: string;
    initiatives: CharacterInitiative[];
    currentIndex: number;
    roundNumber: number;
    state: InitiativeState;
}

export default class InitiativeCommand implements ICommand {
    private _serverId: string;
    private _character?: ICharacter;
    private _monsterName?: string;
    private _storageClient: IStorageClient = new StorageClientFactory().getInstance();

    private _subCommand: string = '';
    private _override: number = 0;

    constructor(message: string, userId: string, serverId: string, character: ICharacter | null) {
        const commandRegex = /^init (start|begin|next|end|list|((join) ?(\d+)?|(add) ([a-zA-Z]+) ?(\d+)?))/g;
        const commandMatches = commandRegex.exec(message);

        this._serverId = serverId;

        if(character !== null) {
            this._character = character;
        }

        if(commandMatches) {
            this._subCommand = commandMatches[1];
            if(commandMatches[5] !== undefined) {
                this._subCommand = commandMatches[5];
                this._monsterName = commandMatches[6];
                if(commandMatches[7] !== undefined) {
                    this._override = parseInt(commandMatches[7], 10);
                }
            }
            else if(commandMatches[4] !== undefined) {
                this._subCommand = commandMatches[3];
                this._override = parseInt(commandMatches[4], 10);
            }
        }
    }

    private async getInitiatives(): Promise<ServerInitiative> {
        let initiative: ServerInitiative;
        if(this._storageClient !== undefined) {
            try {
                initiative = <ServerInitiative>JSON.parse(await this._storageClient.fetch(`server-${this._serverId}/initiative.json`));
            }
            catch(e) {
                initiative = <ServerInitiative> {
                    currentIndex: -1,
                    initiatives: [],
                    roundNumber: 0,
                    serverId: this._serverId,
                    state: InitiativeState.PREPARING
                }
            }
        }
        else {
            throw new Error('Cannot use initiative as this bot has not been configured for it');
        }
        return initiative;
    }

    private async saveInitiatives(serverInitiative: ServerInitiative): Promise<void> {
        try {
            await this._storageClient.save(JSON.stringify(serverInitiative), `server-${this._serverId}/initiative.json`);
        }
        catch(e) {
            throw new Error('An error occurred while saving the initiative list');
        }
    }

    async startInitiative(): Promise<MessageEmbedField[]> {
        const initiative = await this.getInitiatives();
        if(initiative.state === InitiativeState.IN_PROGRESS) {
            throw new Error('Initiative is already active');
        }
        else if(initiative.state === InitiativeState.ENDED) {
            initiative.state = InitiativeState.PREPARING;
        }

        await this.saveInitiatives(initiative);

        return <MessageEmbedField[]>[
            {
                name: 'Initiative started!',
                value: 'Prepare for battle!'
            }
        ];
    }

    async joinInitiative(): Promise<MessageEmbedField[]> {
        if(this._character === undefined) {
            throw new Error('You must have a character selected to join initiative');
        }

        const initiative = await this.getInitiatives();
        const initRoll = this._override > 0 ? this._override : DiceRoller.rollDice(RollType.NORMAL, 1, 20, '+', this._character.initiative).diceResult;

        if(initiative.initiatives.filter(x => x.characterName === this._character?.name).length !== 0) {
            throw new Error('You are already in the initiative order');
        }
        if(initiative.state === InitiativeState.ENDED) {
            throw new Error('There is no initiative active');
        }

        const charInit = <CharacterInitiative> {
            characterName: this._character.name,
            initiative: initRoll
        };

        initiative.initiatives.push(charInit);
        
        await this.saveInitiatives(initiative);

        return <MessageEmbedField[]>[
            {
                name: 'Initiative joined',
                value: `${charInit.characterName} joined the initiative with a roll of ${initRoll}!`
            }
        ];
    }

    async addInitiative(): Promise<MessageEmbedField[]> {
        if(this._monsterName === undefined) {
            throw new Error('You must enter a monster name to join initiative');
        }

        const initiative = await this.getInitiatives();
        const initRoll = this._override > 0 ? this._override : DiceRoller.rollDice(RollType.NORMAL, 1, 20, '', 0).diceResult;

        if(initiative.initiatives.filter(x => x.characterName === this._monsterName).length !== 0) {
            throw new Error(`${this._monsterName} is already in the initiative order`);
        }
        if(initiative.state === InitiativeState.ENDED) {
            throw new Error('There is no initiative active');
        }

        const monsterInit = <CharacterInitiative> {
            characterName: this._monsterName,
            initiative: initRoll
        };

        initiative.initiatives.push(monsterInit);
        
        await this.saveInitiatives(initiative);

        return <MessageEmbedField[]>[
            {
                name: 'Initiative joined',
                value: `${monsterInit.characterName} joined the initiative with a roll of ${initRoll}!`
            }
        ];
    }

    async nextInitiative(): Promise<MessageEmbedField[]> {
        const initiative = await this.getInitiatives();

        if(initiative.state === InitiativeState.ENDED) {
            throw new Error('There is no initiative active');
        }

        const fields: MessageEmbedField[] = [];

        if(initiative.roundNumber === 0) {
            initiative.initiatives = initiative.initiatives.sort((a, b) => (a.initiative > b.initiative) ? -1 : 1);
        }

        initiative.currentIndex++;
        if(initiative.currentIndex === initiative.initiatives.length || initiative.roundNumber === 0) {
            initiative.currentIndex = 0;
            initiative.roundNumber++;
            fields.push(<MessageEmbedField>{
                name: 'New round!',
                value: `Advancing to round ${initiative.roundNumber}`
            });
        }

        await this.saveInitiatives(initiative);

        fields.push(<MessageEmbedField>
            {
                name: 'Initiative passed',
                value: `It's now ${initiative.initiatives[initiative.currentIndex].characterName}'s turn!`
            });

        return fields;
    }

    async listInitiative(): Promise<MessageEmbedField[]> {
        const initiative = await this.getInitiatives();

        if(initiative.state === InitiativeState.ENDED) {
            throw new Error('There is no initiative active');
        }

        initiative.initiatives = initiative.initiatives.sort((a, b) => (a.initiative > b.initiative) ? -1 : 1);

        let output = '';
        let i = 0;
        for(const init of initiative.initiatives) {
            if(i === initiative.currentIndex) {
                output += `*${init.characterName} - ${init.initiative}\n`;
            }
            else {
                output += `${init.characterName} - ${init.initiative}\n`
            }
            i++;
        }

        output.trim();

        return <MessageEmbedField[]>[
            {
                name: 'Initiative List',
                value: output
            }
        ];
    }

    async endInitiative(): Promise<MessageEmbedField[]> {
        const initiative = await this.getInitiatives();
        if(initiative.state === InitiativeState.ENDED) {
            throw new Error('Initiative is not active');
        }
        else {
            initiative.state = InitiativeState.ENDED;
        }

        initiative.currentIndex = -1;
        initiative.initiatives = [];
        initiative.roundNumber = 0;

        await this.saveInitiatives(initiative);

        return <MessageEmbedField[]>[
            {
                name: 'Initiative Ended!',
                value: 'Battle complete!'
            }
        ];
    }

    async execute(): Promise<MessageEmbedField[]> {
        switch(this._subCommand) {
            case 'begin':
            case 'start':
                return await this.startInitiative();
            case 'join':
                return await this.joinInitiative()
            case 'add':
                return await this.addInitiative();
            case 'next':
                return await this.nextInitiative();
            case 'list':
                return await this.listInitiative();
            case 'end':
                return await this.endInitiative();
            default:
                throw new Error('Invalid initiative command');
        }
    }
}
