import { NextRequest } from "next/server";
import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import app from "@/server/app";

export const dynamic = "force-dynamic";

async function handler(req: NextRequest) {
  const url = new URL(req.url);

  return new Promise<Response>((resolve) => {
    const socket = new Socket();
    const incomingMessage = new IncomingMessage(socket);

    incomingMessage.method = req.method;
    incomingMessage.url = url.pathname + url.search;
    incomingMessage.headers = Object.fromEntries(req.headers.entries());

    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      incomingMessage.headers.cookie = cookieHeader;
    }

    const serverResponse = new ServerResponse(incomingMessage);

    const chunks: Buffer[] = [];
    const originalWrite = serverResponse.write.bind(serverResponse);
    const originalEnd = serverResponse.end.bind(serverResponse);

    serverResponse.write = function (chunk: unknown, ...args: unknown[]) {
      if (chunk) chunks.push(Buffer.from(chunk as string));
      return originalWrite(chunk, ...args as [BufferEncoding, () => void]);
    };

    serverResponse.end = function (chunk?: unknown, ...args: unknown[]) {
      if (chunk) chunks.push(Buffer.from(chunk as string));

      const body = Buffer.concat(chunks).toString();
      const headers = new Headers();

      const rawHeaders = serverResponse.getHeaders();
      for (const [key, value] of Object.entries(rawHeaders)) {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v));
          } else {
            headers.set(key, String(value));
          }
        }
      }

      resolve(new Response(body || null, {
        status: serverResponse.statusCode,
        headers,
      }));

      return originalEnd(chunk, ...args as [BufferEncoding, () => void]);
    };

    req.text().then((bodyText) => {
      if (bodyText) {
        incomingMessage.push(bodyText);
      }
      incomingMessage.push(null);
      app(incomingMessage as Parameters<typeof app>[0], serverResponse as Parameters<typeof app>[1]);
    });
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
