export default class RequestHandler {
	private request: Request;

	constructor(request: Request) {
		this.request = request;
	}

	public parseMethod(): string {
		const url: URL = new URL(this.request.url);
		return url.pathname.split('/')[2];
	}

	public parseTable(): string {
		const url: URL = new URL(this.request.url);
		return url.pathname.split('/')[1];
	}

	public getHeaders(): Headers {
		return this.request.headers;
	}

	public async getBody(): Promise<any> {
		return JSON.parse(await readRequestBody(this.request));
	}
}


async function readRequestBody(request: Request): Promise<string> {
	const contentType = request.headers.get("content-type");
	if (contentType !== null) {
		if (contentType.includes("application/json")) {
			return JSON.stringify(await request.json());
		} else if (contentType.includes("application/text")) {
			return request.text();
		} else if (contentType.includes("text/html")) {
			return request.text();
		} else if (contentType.includes("form")) {
			const formData = await request.formData();
			const body: { [key: string]: string } = {};
			for (const entry of formData.entries()) {
				body[entry[0]] = entry[1] as string;
			}
			return JSON.stringify(body);
		} else {
			return "body error";
		}
	} else {
		return "content-type header is missing";
	}
}
