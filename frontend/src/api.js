const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8004";

async function handleResponse(res) {
  if (!res.ok) {
    let detail = "Something went wrong.";
    try {
      const body = await res.json();
      detail = Array.isArray(body.detail)
        ? body.detail.map((d) => d.msg).join(", ")
        : body.detail || detail;
    } catch {
      // response had no JSON body
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  list: () => fetch(`${BASE_URL}/summaries/`).then(handleResponse),

  get: (id) => fetch(`${BASE_URL}/summaries/${id}/`).then(handleResponse),

  create: (url) =>
    fetch(`${BASE_URL}/summaries/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).then(handleResponse),

  update: (id, url, summary) =>
    fetch(`${BASE_URL}/summaries/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, summary }),
    }).then(handleResponse),

  remove: (id) =>
    fetch(`${BASE_URL}/summaries/${id}/`, { method: "DELETE" }).then(
      handleResponse
    ),
};
