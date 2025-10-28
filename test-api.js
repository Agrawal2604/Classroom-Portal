// Simple test script to verify API connection
const API_URL = "http://localhost:3001/api";

async function testAPI() {
  console.log("Testing API connection...");
  
  try {
    // Test 1: Server health check
    const healthResponse = await fetch("http://localhost:3001/");
    const healthText = await healthResponse.text();
    console.log("✅ Server health:", healthText);
    
    // Test 2: Register a test user
    console.log("\n📝 Testing user registration...");
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Student",
        email: "student@test.com",
        password: "password123",
        role: "student"
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log("✅ Registration successful:", registerData.user.name);
      
      // Test 3: Login with the test user
      console.log("\n🔐 Testing login...");
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "student@test.com",
          password: "password123"
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log("✅ Login successful:", loginData.user.name);
        
        // Test 4: Get classes (should be empty for new user)
        console.log("\n📚 Testing classes endpoint...");
        const classesResponse = await fetch(`${API_URL}/classes`, {
          headers: { 
            "Authorization": `Bearer ${loginData.token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (classesResponse.ok) {
          const classes = await classesResponse.json();
          console.log("✅ Classes loaded:", classes.length, "classes found");
        } else {
          const error = await classesResponse.json();
          console.log("❌ Classes error:", error.message);
        }
        
      } else {
        const loginError = await loginResponse.json();
        console.log("❌ Login failed:", loginError.message);
      }
      
    } else {
      const registerError = await registerResponse.json();
      console.log("❌ Registration failed:", registerError.message);
    }
    
  } catch (error) {
    console.log("❌ Connection error:", error.message);
  }
}

// Run the test
testAPI();