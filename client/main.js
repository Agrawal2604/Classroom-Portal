const API_URL = "http://localhost:5000/api";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if(res.ok){
    localStorage.setItem("token", data.token);
    alert(`Logged in as ${data.name} (${data.role})`);
  } else {
    alert(data.message);
  }
}
