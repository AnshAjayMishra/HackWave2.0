// Test certificate APIs from frontend perspective
console.log('Testing Certificate APIs...')

// Test 1: Certificate Types (Public endpoint)
fetch('/api/certificates/types')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Certificate Types API:', data)
    console.log(`Found ${data.certificate_types?.length || 0} certificate types`)
  })
  .catch(error => console.error('❌ Certificate Types API Error:', error))

// Test 2: My Applications (Requires auth token)
const token = localStorage.getItem('authToken')
if (token) {
  fetch('/api/certificates/my-applications', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('✅ Certificate Applications API:', data)
      console.log(`Found ${data.total_count || 0} applications`)
    })
    .catch(error => console.error('❌ Certificate Applications API Error:', error))
} else {
  console.log('ℹ️ No auth token found - skipping my-applications test')
}

console.log('Certificate API tests initiated...')
