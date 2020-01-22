export default interface IStorageClient {
    save(json: string, fileName: string): boolean;
    fetch(fileName: string): string;
}
