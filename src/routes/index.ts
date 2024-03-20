import { handleBadges } from "./route.badge";
import { error400 } from '../middlewares/returnCode';
import { Env } from '../env.interface'
import RequestHandler from '../request.interface';

export const handleRoutes = async (request: RequestHandler, env:Env, ctx: ExecutionContext): Promise<Response> => {

	switch (request.parseTable()){
		case "badges":
			return handleBadges(request, env, ctx);

		case "users":
			return handleBadges(request, env, ctx);

		case "owners":
			return handleBadges(request, env, ctx);

		case "requests":
			return handleBadges(request, env, ctx);

		default:
			return error400("Not Found")
	}
};
