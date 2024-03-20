import { error400, error404 } from '../middlewares/returnCode';
import controller from '../controllers/badge.controller';
import {Env} from '../env.interface'
import { Badge } from '../models/model.badge';
import RequestHandler from '../request.interface';

export const handleBadges = async (request: RequestHandler, env:Env, ctx: ExecutionContext): Promise<Response> => {
	let body;

	switch (request.parseMethod()){
		case "all":
			return controller.getAllBadges();

		case "byId":
			let id;
			if (request.getHeaders().get("idBadge") != null) {
				id = parseInt(request.getHeaders().get("idBadge") as string);
				return controller.getBadgeById(id);
			} else {
				return error404("idBadge header is missing");
			}

		case "byCategory":
			let category;
			if (request.getHeaders().get("category") != null) {
				category = request.getHeaders().get("category") as string;
				return controller.getBadgesByCategory(category);
			} else {
				return error404("category header is missing");
			}
		case "byOwner":
			let ownerId;
			if (request.getHeaders().get("ownerId") != null) {
				ownerId = parseInt(request.getHeaders().get("ownerId") as string);
				return controller.getBadgesByOwnerId(ownerId);
			} else {
				return error404("ownerId header is missing");
			}

		case "byName":
			let name;
			if (request.getHeaders().get("name") != null) {
				name = request.getHeaders().get("name") as string;
				return controller.getBadgesByName(name);
			} else {
				return error404("name header is missing");
			}

		case "srDesc":
			body = await request.getBody();
			if ( body.desc != null) {
				return controller.searchBadgeByDescription(body.desc);
			} else {
				return error404("desc body is missing");
			}
		case "srName":
			body = await request.getBody();
			if ( body.name != null) {
				return controller.searchBadgeByName(body.name);
			} else {
				return error404("name body is missing");
			}

		case "srDescName":
			body = await request.getBody();
			if ( body.search != null) {
				return controller.searchBadge(body.search);
			} else {
				return error404("search body is missing");
			}

		case "create":
			body = await request.getBody();
			if ( body !== null && isValidBadge(body)) {
				return controller.createBadge(body);
			} else {
				return error404("Body missing or invalid");
			}

		case "update":
			let idBadge;
			body = await request.getBody();
			if (request.getHeaders().get("idBadge") != null || body != null) {
				idBadge = parseInt(request.getHeaders().get("idBadge") as string);
				return controller.updateBadge(idBadge,body);
			} else {
				return error404("idBadge header is missing");
			}

		case "delete":
			let idDelete;
			if (request.getHeaders().get("idBadge") != null) {
				idDelete = parseInt(request.getHeaders().get("idBadge") as string);
				return controller.deleteBadge(idDelete);
			} else {
				return error404("idBadge header is missing");
			}
		default:
			return error400("not found")
	}
};

function isValidBadge(badgeData: any): badgeData is Badge {
	return typeof badgeData === 'object' &&
		(badgeData.fill !== undefined || typeof badgeData.fill === 'string') &&
		(badgeData.nom !== undefined || typeof badgeData.nom === 'string') &&
		(badgeData.categorie !== undefined || typeof badgeData.categorie === 'string') &&
		(badgeData.description === undefined || typeof badgeData.description === 'string') &&
		(badgeData.owner_id === undefined || typeof badgeData.owner_id === 'number');
}
