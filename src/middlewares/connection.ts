import { Client } from "pg";


let initialized: boolean = false;
let psql_connection: string;

export const initialize = (sql_string: string): void => {
    if (!initialized) {
        initialized = true;
				console.log(sql_string)
        psql_connection = sql_string;
    }
};

export const getConnection = async (): Promise<Client> => {
    if (!initialized)
        throw new Error("not initialized!");
    const connection = new Client(psql_connection);
    await connection.connect();
    return connection;
}
