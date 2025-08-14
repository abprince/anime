const API_BASE = '/api/v2/hianime';

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Some endpoints return 'success', others return 'status'
    if (data.success === false || (data.status && data.status !== 200)) {
      throw new Error(data.message || 'API request unsuccessful');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    showErrorToast(error.message);
    throw error;
  }
}

function showErrorToast(message) {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = `Error: ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

// Add this to your styles.css
.error-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4444;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
