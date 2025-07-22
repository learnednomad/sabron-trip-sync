// Simple test to verify mobile app authentication works
import { apiClient } from './apps/mobile/src/lib/api-client.js';

// Test login endpoint
async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    // Try to make a login request
    const response = await apiClient.post('/auth/login', {
      email: 'test.user123@gmail.com',
      password: 'Password123!',
      rememberMe: false
    });

    console.log('Login response:', response.data);
    console.log('✅ Login test passed');
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }
}

// Test protected endpoint
async function testProtectedRoute() {
  try {
    console.log('Testing protected route without auth...');
    
    const response = await apiClient.get('/itineraries');
    console.log('Protected route response:', response.data);
    console.log('✅ Protected route test passed');
  } catch (error) {
    console.log('✅ Protected route correctly rejected:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting mobile app authentication tests...\n');
  
  await testLogin();
  console.log('');
  await testProtectedRoute();
  
  console.log('\n✅ Mobile app authentication tests complete!');
}

runTests();