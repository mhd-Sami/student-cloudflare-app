export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // -----------------------------
    // SERVE FRONTEND (index page)
    // -----------------------------
    if (url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>Student Form</title>
</head>
<body>
  <h1>Student Form is Running 🚀</h1>
  <p>Now API is working. Connect frontend later if needed.</p>
</body>
</html>
      `, {
        headers: { "Content-Type": "text/html" }
      });
    }

    // -----------------------------
    // GET STUDENTS
    // -----------------------------
    if (url.pathname === "/api/students" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM students"
      ).all();

      return Response.json(results, { headers });
    }

    // -----------------------------
    // POST STUDENTS
    // -----------------------------
    if (url.pathname === "/api/students" && request.method === "POST") {

      const body = await request.json();

      await env.DB.prepare(
        "INSERT INTO students (name, email, course) VALUES (?, ?, ?)"
      ).bind(body.name, body.email, body.course).run();

      return Response.json({ message: "Saved" }, { headers });
    }

    return new Response("Not Found", { status: 404 });
  }
}
