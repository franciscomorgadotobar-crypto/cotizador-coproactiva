import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore({ name: "propuestas-clientes", consistency: "strong" });
  try {
    if (req.method === "GET") {
      const list = (await store.get("clientes", { type: "json" })) || {};
      return Response.json(list);
    }
    if (req.method === "POST") {
      const body = await req.json();
      if (!body || !body.nombre) {
        return new Response(JSON.stringify({ error: "Falta nombre" }), { status: 400 });
      }
      const list = (await store.get("clientes", { type: "json" })) || {};
      list[body.nombre] = body.data;
      await store.setJSON("clientes", list);
      return Response.json(list);
    }
    if (req.method === "DELETE") {
      const body = await req.json();
      if (!body || !body.nombre) {
        return new Response(JSON.stringify({ error: "Falta nombre" }), { status: 400 });
      }
      const list = (await store.get("clientes", { type: "json" })) || {};
      delete list[body.nombre];
      await store.setJSON("clientes", list);
      return Response.json(list);
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};

export const config = { path: "/api/propuestas" };
