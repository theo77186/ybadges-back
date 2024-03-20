import { initialize } from "./middlewares/connection";
import { handleRoutes } from './routes';
import { Env } from './env.interface';
import RequestHandler from './request.interface'

export default {
	async fetch(request: Request, env:Env, ctx: ExecutionContext): Promise<Response> {
		const sql_string = env.PSQL_CONNECTION_STRING;
		const requestHandler = new RequestHandler(request);
		if(sql_string != undefined){
			initialize(sql_string);
		} else {
			console.log("erreur de recuperation du .env")
		}
		return handleRoutes(requestHandler,env, ctx);
	}
};
