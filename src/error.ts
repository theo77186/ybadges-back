export const error404 = (message: String): Response => {
    const response = new Response(JSON.stringify({error: message}), {status: 404});
    response.headers.set("Content-Type", "application/json");
    return response;
}
