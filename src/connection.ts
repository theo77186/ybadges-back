import { Env } from ".";
import { Client } from "pg";


let initialized: boolean = false;
let psql_connection: string = "";

export const initialize = (env: Env): void => {
    if (!initialized) {
        initialized = true;
        psql_connection = env.PSQL_CONNECTION_STRING;
    }
};

export const getConnection = async (): Promise<Client> => {
    if (!initialized)
        throw new Error("not initialized!");
    const connection = new Client(psql_connection);
    await connection.connect();
    return connection;
}
