import { getEmailFromRequest, resolveRole, roleToAlias } from "../_utils/roles.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const email = await getEmailFromRequest(request);
  // Preferir rol calculado por el middleware si está presente
  const headerRole = (request.headers.get("X-RunArt-Role") || "").trim().toLowerCase();
  let role = headerRole;
  if (!role) {
    role = await resolveRole(email, env);
  }
  const ts = new Date().toISOString();
  const aliasHeader = (request.headers.get("X-RunArt-Role-Alias") || "").trim().toLowerCase();
  const alias = aliasHeader || roleToAlias(role);

  const body = {
    ok: true,
    email: email || null,
    role,
    rol: alias,
    env: env.RUNART_ENV || "unknown",
    ts,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate",
      pragma: "no-cache",
    },
    status: 200,
  });
}
