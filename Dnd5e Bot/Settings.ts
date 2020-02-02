interface _BlobStorage {
    accountName: string;
    accountKey: string;
    containerName: string;
}

interface _FileStorage {
    rootDirectory: string;
}

interface _DiscordAPI {
    clientId: string;
    clientSecret: string;
    baseUri: string;
}

export default interface Settings {
    token: string;
    messagePrefix: string;
    logLevel: string;
    webEnabled: boolean;
    discordApi: _DiscordAPI;
    storageType: string;
    blobStorage?: _BlobStorage;
    fileStorage?: _FileStorage;
    webPort?: string;
}
