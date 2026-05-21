export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // ---------------------------
    // FRONTEND PAGE
    // ---------------------------
    if (url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>Student Form</title>
  <style>
    body {
      font-family: Arial;
      background: #f4f6f8;
      padding: 30px;
    }

    .container {
      max-width: 700px;
      margin: auto;
      background: white;
      padding: 20px;
      border-radius: 10px;
    }

    input, button {
      width: 100%;
      padding: 10px;
      margin: 5px 0;
    }

    button {
      background: #2563eb;
      color: white;
      border: none;
      cursor: pointer;
    }

    table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }

    th {
      background: #2563eb;
      color: white;
    }
  </style>
</head>

<body>

<div class="container">

  <h2>Student Registration Form</h2>

  <input id="name" placeholder="Name">
  <input id="email" placeholder="Email">
  <input id="course" placeholder="Course">

  <button onclick="saveStudent()">Save</button>

  <h3>All Records</h3>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Course</th>
      </tr>
    </thead>
    <tbody id="data"></tbody>
  </table>

</div>

<script>
const API = "/api/students";

async function saveStudent() {
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      course: document.getElementById("course").value
    })
  });

  loadStudents();
}

async function loadStudents() {
  const res = await fetch(API);
  const data = await res.json();

  let html = "";

  for (let d of data) {
    html += `
      <tr>
        <td>${d.id}</td>
        <td>${d.name}</td>
        <td>${d.email}</td>
        <td>${d.course}</td>
      </tr>
    `;
  }

  document.getElementById("data").innerHTML = html;
}

loadStudents();
</script>

</body>
</html>
      `, {
        headers: { "Content-Type": "text/html" }
      });
    }

    // ---------------------------
    // GET ALL STUDENTS
    // ---------------------------
    if (url.pathname === "/api/students" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM students ORDER BY id DESC"
      ).all();

      return Response.json(results, { headers });
    }

    // ---------------------------
    // ADD STUDENT
    // ---------------------------
    if (url.pathname === "/api/students" && request.method === "POST") {

      const body = await request.json();

      await env.DB.prepare(
        "INSERT INTO students (name, email, course) VALUES (?, ?, ?)"
      ).bind(body.name, body.email, body.course).run();

      return Response.json({ success: true }, { headers });
    }

    return new Response("Not Found", { status: 404 });
  }
};
