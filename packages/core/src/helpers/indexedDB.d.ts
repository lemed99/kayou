declare class NativeCache {
    private dbName;
    private storeName;
    private version;
    private db;
    private getDB;
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<void>;
    getAllKeys(): Promise<string[]>;
    delete(): Promise<void>;
}
export declare const cache: NativeCache;
export declare const insertOrUpdateCacheRow: (key: string, value: unknown) => Promise<void>;
export declare const getCacheRow: (key: string) => Promise<unknown>;
export {};
