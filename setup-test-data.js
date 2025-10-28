// Script to set up test data
const API_URL = "http://localhost:3001/api";

async function setupTestData() {
  console.log("Setting up test data...");
  
  try {
    // Create a teacher
    console.log("\n👨‍🏫 Creating teacher account...");
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
    
    let teacherToken;
    if (teacherResponse.ok) {
      const teacherData = await teacherResponse.json();
      teacherToken = teacherData.token;
      console.log("✅ Teacher created:", teacherData.user.name);
    } else {
      const error = await teacherResponse.json();
      if (error.message.includes("already exists")) {
        // Login instead
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "teacher@test.com",
            password: "password123"
          })
        });
        const loginData = await loginResponse.json();
        teacherToken = loginData.token;
        console.log("✅ Teacher logged in:", loginData.user.name);
      } else {
        throw new Error(error.message);
      }
    }
    
    // Create a class
    console.log("\n🏫 Creating test class...");
    const classResponse = await fetch(`${API_URL}/classes`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${teacherToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Introduction to Programming",
        code: "CS101"
      })
    });
    
    if (classResponse.ok) {
      const classData = await classResponse.json();
      console.log("✅ Class created:", classData.title, "- Code:", classData.code);
      
      // Create an assignment
      console.log("\n📝 Creating test assignment...");
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days
      
      const assignmentResponse = await fetch(`${API_URL}/assignments`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${teacherToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "Hello World Program",
          description: "Write a simple Hello World program in your preferred language",
          dueAt: dueDate.toISOString(),
          classId: classData._id
        })
      });
      
      if (assignmentResponse.ok) {
        const assignmentData = await assignmentResponse.json();
        console.log("✅ Assignment created:", assignmentData.title);
      } else {
        const error = await assignmentResponse.json();
        console.log("❌ Assignment creation failed:", error.message);
      }
      
    } else {
      const error = await classResponse.json();
      console.log("❌ Class creation failed:", error.message);
    }
    
    console.log("\n🎉 Test data setup complete!");
    console.log("\nYou can now:");
    console.log("1. Go to http://localhost:8080/login.html");
    console.log("2. Login as teacher@test.com / password123 (teacher)");
    console.log("3. Or login as student@test.com / password123 (student)");
    console.log("4. Student can join class with code: CS101");
    
  } catch (error) {
    console.log("❌ Setup error:", error.message);
  }
}

setupTestData();