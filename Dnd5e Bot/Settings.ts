interface _BlobStorage {
    connectionString: string;
    containerName: string;
}

interface _FileStorage {
    rootDirectory: string;
}

export default interface Settings {
    token: string;
    messagePrefix: string;
    logLevel: string;
    storageType: string;
    blobStorage?: _BlobStorage;
    fileStorage?: _FileStorage;
}
