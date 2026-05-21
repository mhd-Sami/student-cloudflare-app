export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // Enable CORS
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers
      });
    }

    // GET all students
    if (url.pathname === "/api/students" && request.method === "GET") {

      const { results } = await env.DB.prepare(
        "SELECT * FROM students"
      ).all();

      return Response.json(results, {
        headers
      });
    }

    // INSERT student
    if (url.pathname === "/api/students" && request.method === "POST") {

      const body = await request.json();

      await env.DB.prepare(
        "INSERT INTO students (name, email, course) VALUES (?, ?, ?)"
      )
      .bind(body.name, body.email, body.course)
      .run();

      return Response.json(
        { message: "Student Added Successfully" },
        { headers }
      );
    }

    return new Response("Not Found", {
      status: 404
    });
  }
}