export default interface IStorageClient {
    save(json: string, fileName: string): Promise<boolean>;
    fetch(fileName: string): Promise<string>;
}
