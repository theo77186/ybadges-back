import { handleBadges } from '../controllers/badges';
import { error400 } from '../middlewares/returnCode';

export const handleRequests = async (request: Request, env: any, ctx: ExecutionContext): Promise<Response> => {
	const url: URL = new URL(request.url);
	const route = url.pathname.split('/')[1]

	switch (route){
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
