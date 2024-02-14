import { initialize } from "./middlewares/connection";
import dotenv from "dotenv";
import { handleRoutes } from './routes';

dotenv.config();

export default {
	async fetch(request: Request, ctx: ExecutionContext): Promise<Response> {
		const env = process.env;
		initialize(env);
		return handleRoutes(request, env, ctx);
	}
};
