import axios from "axios";

const testLogin = async () => {
  console.log("\n🔍 Testing Login API...\n");
  
  const testCases = [
    {
      name: "Admin yang sudah direset",
      email: "heraa123@gmail.com",
      password: "password123",
      role: "admin"
    },
    {
      name: "Admin dengan password lama (akan gagal)",
      email: "heraa123@gmail.com", 
      password: "PasswordYangAnda123",
      role: "admin"
    }
  ];

  for (const test of testCases) {
    console.log(`\n📝 Test: ${test.name}`);
    console.log(`   Email: ${test.email}`);
    console.log(`   Password: ${test.password}`);
    console.log(`   Role: ${test.role}`);
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: test.email,
        password: test.password,
        role: test.role
      });
      
      console.log(`   ✅ SUCCESS - Status: ${response.status}`);
      console.log(`   Token diterima: ${response.data.token ? 'Ya' : 'Tidak'}`);
      console.log(`   User: ${response.data.user?.name || 'N/A'}`);
    } catch (error) {
      console.log(`   ❌ FAILED - Status: ${error.response?.status || 'N/A'}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }
  }
  
  console.log("\n✅ Test selesai!\n");
};

testLogin();
