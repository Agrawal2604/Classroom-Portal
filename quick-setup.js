// Quick setup for test accounts
const API_URL = "http://localhost:3001/api";

async function quickSetup() {
  console.log("🚀 Setting up test accounts...");
  
  try {
    // Create teacher account
    const teacherResponse = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "John Teacher",
        email: "teacher@test.com",
        password: "password123",
        role: "teacher"
      })
    });
    
    if (teacherResponse.ok) {
      console.log("✅ Teacher account created");
    } else {
      console.log("ℹ️ Teacher account may already exist");
    }
    
    // Create student account
    const studentResponse = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alice Student",
        email: "student@test.com",
        password: "password123",
        role: "student"
      })
    });
    
    if (studentResponse.ok) {
      console.log("✅ Student account created");
    } else {
      console.log("ℹ️ Student account may already exist");
    }
    
    console.log("\n🎉 Setup complete!");
    console.log("\n📋 Test Accounts:");
    console.log("Teacher: teacher@test.com / password123");
    console.log("Student: student@test.com / password123");
    
  } catch (error) {
    console.log("❌ Setup error:", error.message);
  }
}

quickSetup();