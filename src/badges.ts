import { Env } from ".";
import { error404 } from "./error";
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


const getBadge = async (id: String): Promise<Response> => {
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

export const handleBadges = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (/^\/badges\/list\/?$/.test(pathname)) {
        return getAllBadges();
    }
    else {
        const id = pathname.slice(8); // "/badges/"
        if (request.method == "GET") {
            return getBadge(id);
        }
    }
    return new Response("placeholder");
}
