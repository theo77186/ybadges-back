import { getConnection } from './connection';
import { error404 } from './error';
import { Login } from './types';


const getAllLogin = async (): Promise<Response> => {
	try {
		const connection = await getConnection();
		const loginResult = await connection.query("SELECT id, classe, fill, filliere, mail, nom, prenom FROM login");
		const rows = loginResult.rows;
		if (rows.length > 0) {
			const response = new Response(JSON.stringify(rows));
			response.headers.set("Content-Type", "application/json");
			return response;
		} else {
			return error404("No logins found");
		}
	} catch (error) {
		console.error("Error retrieving logins:", error);
		return error404("Internal Server Error");
	}
};

const createLogin = async (newLogin: Login): Promise<Response> => {
	try {
		const connection = await getConnection();
		// Your INSERT query here using newLogin fields
		// Example:
		// const insertQuery = `INSERT INTO login (id, classe, fill, filliere, mail, mdp, nom, prenom) VALUES (${newLogin.id}, '${newLogin.classe}', '${newLogin.fill}', '${newLogin.filliere}', '${newLogin.mail}', '${newLogin.mdp}', '${newLogin.nom}', '${newLogin.prenom}')`;
		// await connection.query(insertQuery);
		// Adjust your query according to your database schema
		return new Response("Login created successfully");
	} catch (error) {
		console.error("Error creating login:", error);
		return error404("Internal Server Error");
	}
};

const updateLogin = async (id: number, updatedLogin: Login): Promise<Response> => {
	try {
		const connection = await getConnection();
		// Your UPDATE query here using id and updatedLogin fields
		// Example:
		// const updateQuery = `UPDATE login SET classe='${updatedLogin.classe}', fill='${updatedLogin.fill}', filliere='${updatedLogin.filliere}', mail='${updatedLogin.mail}', mdp='${updatedLogin.mdp}', nom='${updatedLogin.nom}', prenom='${updatedLogin.prenom}' WHERE id=${id}`;
		// await connection.query(updateQuery);
		// Adjust your query according to your database schema
		return new Response("Login updated successfully");
	} catch (error) {
		console.error("Error updating login:", error);
		return error404("Internal Server Error");
	}
};

const deleteLogin = async (id: number): Promise<Response> => {
	try {
		const connection = await getConnection();
		// Your DELETE query here using id
		// Example:
		// const deleteQuery = `DELETE FROM login WHERE id=${id}`;
		// await connection.query(deleteQuery);
		// Adjust your query according to your database schema
		return new Response("Login deleted successfully");
	} catch (error) {
		console.error("Error deleting login:", error);
		return error404("Internal Server Error");
	}
};

const getLoginById = async (id: String): Promise<Response> => {
	const connection = await getConnection();
	const loginResult = await connection.query("SELECT id, classe, fill, filliere, mail, nom, prenom FROM login WHERE id = $1", [id]);
	const rows = loginResult.rows;
	if (rows.length > 0) {
		const response = new Response(JSON.stringify(rows[0]));
		response.headers.set("Content-Type", "application/json");
		return response;
	}
	else {
		return error404("badge not found");
	}
}

const getLoginByName = async (name: String): Promise<Response> => {
	const connection = await getConnection();
	const loginResult = await connection.query("SELECT id, classe, fill, filliere, mail, nom, prenom FROM login WHERE name = $1", [name]);
	const rows = loginResult.rows;
	if (rows.length > 0) {
		const response = new Response(JSON.stringify(rows[0]));
		response.headers.set("Content-Type", "application/json");
		return response;
	}
	else {
		return error404("badge not found");
	}
}

const getLoginByClasse = async (classe: String): Promise<Response> => {
	const connection = await getConnection();
	const loginResult = await connection.query("SELECT id, classe, fill, filliere, mail, nom, prenom FROM login WHERE classe = $1", [classe]);
	const rows = loginResult.rows;
	if (rows.length > 0) {
		const response = new Response(JSON.stringify(rows[0]));
		response.headers.set("Content-Type", "application/json");
		return response;
	}
	else {
		return error404("badge not found");
	}
}
