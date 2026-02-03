export type IsoTimestamp = string;

export enum ApiStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    
}

export interface ApiResponse<
    TData = never,
    TMeta = never,
    THasMessage extends boolean = boolean,
    THasData extends boolean = boolean,
    THasMeta extends boolean = boolean
> {
    status: ApiStatus;
    timestamp: IsoTimestamp;

    // Conditionally present fields
    message: THasMessage extends true ? string : never;
    data: THasData extends true ? TData : never;
    meta: THasMeta extends true ? TMeta : never;
}
