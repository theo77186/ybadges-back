import { Env } from ".";
import { error400, error404 } from "./error";
import { Badge } from "./types";
import { getConnection } from "./connection";

const badgesList: Badge[] = [
    {
        id: 1,
        fill: "Dev",
        nom: "",
        categorie: "General"
    },
    {
        id: 2,
        fill: "Crea",
        nom: "",
        categorie: "General"
    },
    {
        id: 3,
        fill: "3D",
        nom: "",
        categorie: "General"
    }
];

// FIXME: use the real Badge type
interface LocalBadge {
    id: number;
    fill: string;
    nom: string;
    categorie: string;
    description: string;
}

const parseBadge = (input: string): Partial<LocalBadge> => {
    try {
        const result = JSON.parse(input);
        if (typeof result != "object") {
            throw new Error("not an object");
        }
        return result;
    }
    catch (e) {
        console.error(e);
        return {};
    }
}

const getBadge = async (id: string): Promise<Response> => {
    // const badgeById = badgesList.filter((b: Badge) => b.id == id);
    const connection = await getConnection();
    const badgesResult = await connection.query("SELECT id, fill, nom, categorie, description FROM badge WHERE id = $1", [id]);
    const rows = badgesResult.rows;
    if (rows.length > 0) {
        const response = new Response(JSON.stringify(rows[0]));
        response.headers.set("Content-Type", "application/json");
        return response;
    }
    else {
        return error404("badge not found");
    }
}

const getAllBadges = async (): Promise<Response> => {
    // const badges: Badge[] = [...badgesList];
    // const response = new Response(JSON.stringify(badges));
    // response.headers.set("Content-Type", "application/json");
    // return response;
    const connection = await getConnection();
    const result = await connection.query("SELECT id, fill, nom, categorie, description FROM badge");
    console.log(result.rows);
    const response = new Response(JSON.stringify(result.rows));
    response.headers.set("Content-Type", "application/json");
    return response;
}

const createBadge = async (input: LocalBadge, userId: number = 1): Promise<Response> => {
    // fixme: clean this
    const newBadge = input;
    if (newBadge.categorie == undefined ||
        newBadge.description == undefined ||
        newBadge.fill == undefined ||
        newBadge.nom == undefined ||
        newBadge.id == undefined) {
        return error400("missing field");
    }

    const connection = await getConnection();
    const result = await connection.query("INSERT INTO badge (fill, nom, categorie, description, owner_id, id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
    [newBadge.fill, newBadge.nom, newBadge.categorie, newBadge.description, userId, newBadge.id]);

    const responseObj = { id: result.rows[0].id };
    const response = new Response(JSON.stringify(responseObj));
    response.headers.set("Content-Type", "application/json");
    return response;
}

const updateBadge = async (id: string, input: string): Promise<Response> => {
    const updatedBadge = parseBadge(input);
    const {fill, nom, categorie, description} = updatedBadge;
    const connection = await getConnection();
    if (fill != undefined) {
        await connection.query("UPDATE badge SET fill = $1 WHERE id = $2", [fill, id]);
    }
    if (nom != undefined) {
        await connection.query("UPDATE badge SET nom = $1 WHERE id = $2", [nom, id])
    }
    if (categorie != undefined) {
        await connection.query("UPDATE badge SET categorie = $1 WHERE id = $2", [categorie, id]);
    }
    if (description != undefined) {
        await connection.query("UPDATE badge SET description = $1 WHERE id = $2", [description, id]);
    }
    return new Response(null, { status: 204 });
}

const deleteBadge = async (id: string): Promise<Response> => {
    const connection = await getConnection();

    const result = await connection.query("DELETE FROM badge WHERE id = $1 RETURNING id");

    if (result.rows.length > 0) {
        return new Response(null, { status: 204 });
    }
    else {
        return error404("badge not found");
    }
}

export const handleBadges = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (/^\/badges\/?$/.test(pathname) && request.method == "GET") {
        return getAllBadges();
    }
    else if (/^\/badges\/?$/.test(pathname) && request.method == "POST") {
        return createBadge(await request.json());
    }
    else {
        const id = pathname.slice(8); // "/badges/"
        if (!/[0-9]+/.test(id)) {
            return error400("invalid badge id");
        }
        if (request.method == "GET") {
            return getBadge(id);
        }
        else if (request.method == "PUT") {
            return updateBadge(id, await request.json());
        }
        else if (request.method == "DELETE") {
            return deleteBadge(id);
        }
    }
    return new Response("placeholder");
}
