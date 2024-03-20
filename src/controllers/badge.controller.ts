import { error404, error500, success200 } from '../middlewares/returnCode';
import { getConnection } from '../middlewares/connection';
import { Badge } from '../models/model.badge';

async function generateUniqueId(): Promise<number> {
	try {
		const connection = await getConnection();
		let id: number | undefined = undefined;
		do {
			id = Math.floor(Math.random() * 1000000);
			const queryResult = await connection.query("SELECT id FROM badge WHERE id = $1", [id]);
			const existingId = queryResult.rows.length;
			if(existingId > 0){
				id = undefined;
			}
		} while (id == undefined);
		return id;
	} catch (error) {
		console.error("Error generating unique ID:", error);
		throw new Error("Unable to generate unique ID");
	}
}

export default class controller {
	static createBadge(badgeData: Badge): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				badgeData.id = await generateUniqueId();
				const queryResult = await connection.query("INSERT INTO badge (id, fill, nom, categorie, description, owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [badgeData.id, badgeData.fill, badgeData.nom, badgeData.categorie, badgeData.description, badgeData.owner_id]);
				const createdBadge = queryResult.rows[0];
				resolve(success200(createdBadge));
			} catch (error) {
				console.error("Error creating badge:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}

	static updateBadge(badgeId: number, newData: Partial<Badge>): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				const params: any[] = [];
				let query = "UPDATE badge SET ";
				let index = 1;

				if (newData.nom !== undefined) {
					query += `nom = $${index}, `;
					params.push(newData.nom);
					index++;
				}
				if (newData.fill !== undefined) {
					query += `fill = $${index}, `;
					params.push(newData.fill);
					index++;
				}
				if (newData.categorie !== undefined) {
					query += `categorie = $${index}, `;
					params.push(newData.categorie);
					index++;
				}
				if (newData.description !== undefined) {
					query += `description = $${index}, `;
					params.push(newData.description);
					index++;
				}
				if (newData.owner_id !== undefined) {
					query += `owner_id = $${index}, `;
					params.push(newData.owner_id);
					index++;
				}

				query = query.slice(0, -2);

				query += ` WHERE id = $${index} RETURNING *`;
				params.push(badgeId);

				const queryResult = await connection.query(query, params);
				const updatedBadge = queryResult.rows[0];
				if (updatedBadge) {
					resolve(success200(updatedBadge));
				} else {
					resolve(error404("Badge not found"));
				}
			} catch (error) {
				console.error("Error updating badge:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}

	static deleteBadge(badgeId: number): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				const queryRelation = await connection.query("DELETE FROM ownerrelation WHERE badge_id = $1", [badgeId]);
				if(queryRelation.rows.length>=0){
					const queryResult = await connection.query("DELETE FROM badge WHERE id = $1", [badgeId]);
					const deletedBadge = queryResult.rows[0];
					if(queryResult.rows.length > 0){
						resolve(success200(deletedBadge));
					} else {
						resolve(error404("Badge not found or not deleted"));
					}
				} else {
					resolve(error404("Erreur lors de la suppression de la relation"));
				}
			} catch (error) {
				console.error("Error deleting badge:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}
	static getBadgeById(badgeId: number): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				const queryResult = await connection.query("SELECT * FROM badge WHERE id = $1", [badgeId]);
				const badge = queryResult.rows[0];
				if (badge) {
					resolve(success200(badge));
				} else {
					resolve(error404("Badge not found"));
				}
			} catch (error) {
				console.error("Error retrieving badge by id:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}

	static getBadgesByCategory(category: string): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				const queryResult = await connection.query("SELECT * FROM badge WHERE categorie = $1", [category]);
				const badges = queryResult.rows;
				resolve(success200(badges));
			} catch (error) {
				console.error("Error retrieving badges by category:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}
	static getBadgesByOwnerId(ownerId: number): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				const queryResult = await connection.query("SELECT * FROM badge WHERE owner_id = $1", [ownerId]);
				const badges = queryResult.rows;
				resolve(success200(badges));
			} catch (error) {
				console.error("Error retrieving badges by owner id:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}

	static getBadgesByName(badgeName: string): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				const queryResult = await connection.query("SELECT * FROM badge WHERE nom = $1", [badgeName]);
				const badge = queryResult.rows[0];
				if (badge) {
					resolve(success200(badge));
				} else {
					resolve(error404("Badge not found"));
				}
			} catch (error) {
				console.error("Error retrieving badge by name:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}
	static getAllBadges(): Promise<Response> {
		console.log("before connect");
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				console.log('connect');
				const badgesResult = await connection.query("SELECT * FROM badge");
				const rows = badgesResult.rows;
				if (rows.length > 0) {
					resolve(success200(rows));
				} else {
					resolve(error404("Badge Not Found"));
				}
			} catch (error) {
				console.error("Error creating badge:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}

	static searchBadgeByDescription(description: string): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				const queryResult = await connection.query("SELECT * FROM badge WHERE description ILIKE $1", [`%${description}%`]);
				const badges = queryResult.rows;
				resolve(success200(badges));
			} catch (error) {
				console.error("Error searching badge by description:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}

	static searchBadgeByName(description: string): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				const queryResult = await connection.query("SELECT * FROM badge WHERE nom ILIKE $1", [`%${description}%`]);
				const badges = queryResult.rows;
				resolve(success200(badges));
			} catch (error) {
				console.error("Error searching badge by description:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}

	static searchBadge(query: string): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const connection = await getConnection();
				const queryResult = await connection.query("SELECT * FROM badge WHERE nom ILIKE $1 OR description ILIKE $1", [`%${query}%`]);
				const badges = queryResult.rows;
				resolve(success200(badges));
			} catch (error) {
				console.error("Error searching badge:", error);
				reject(error500("Internal Server Error"));
			}
		});
	}

}
