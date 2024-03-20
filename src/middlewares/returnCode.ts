export const error400 = (message: String): Response => {
    const response = new Response(JSON.stringify({error: message}), {status: 400});
    response.headers.set("Content-Type", "application/json");
    return response;
}

export const error404 = (message: String): Response => {
    const response = new Response(JSON.stringify({error: message}), {status: 404});
    response.headers.set("Content-Type", "application/json");
    return response;
}

export const error500 = (message: String): Response => {
	const response = new Response(JSON.stringify({error: message}), {status: 500});
	response.headers.set("Content-Type", "application/json");
	return response;
}

export const success200 = (message: any[],): Response => {
	const response = new Response(JSON.stringify({data: message}), {status: 200});
	response.headers.set("Content-Type", "application/json");
	response.headers.set('Access-Control-Allow-Origin', '*');
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
	response.headers.set('Access-Control-Allow-Credentials', 'true');
	return response;
}


