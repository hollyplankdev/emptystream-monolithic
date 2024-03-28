import { ITimestamps } from "./ITimestamps";

/** A utility type that composes MongoDB fields onto a database model. */
export type DbObject<T> = { _id: string } & ITimestamps & T;
