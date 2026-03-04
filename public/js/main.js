// Submit report form
document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    customer_name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    category: document.getElementById('category').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value
  };

  try {
    const response = await fetch('/api/reports/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    const messageDiv = document.getElementById('formMessage');
    if (response.ok) {
      messageDiv.textContent = data.message || 'Report submitted successfully!';
      messageDiv.classList.add('success');
      messageDiv.classList.remove('error');
      document.getElementById('reportForm').reset();
    } else {
      messageDiv.textContent = data.error || 'Failed to submit report';
      messageDiv.classList.add('error');
      messageDiv.classList.remove('success');
    }
  } catch (error) {
    console.error('Error:', error);
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = 'Error submitting report';
    messageDiv.classList.add('error');
    messageDiv.classList.remove('success');
  }
});

// Load public reports
async function loadPublicReports() {
  try {
    const response = await fetch('/api/reports/public');
    const reports = await response.json();

    const container = document.getElementById('reportsContainer');
    
    if (reports.length === 0) {
      container.innerHTML = '<p>No reports yet. Be the first to submit!</p>';
      return;
    }

    container.innerHTML = reports.map(report => `
      <div class="report-card">
        <h3>${escapeHtml(report.title)}</h3>
        <p><strong>From:</strong> ${escapeHtml(report.customer_name)}</p>
        <p><strong>Category:</strong> ${escapeHtml(report.category)}</p>
        <span class="status ${report.status}">${report.status}</span>
        <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #666;">
          ${new Date(report.created_at).toLocaleDateString()}
        </p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading reports:', error);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load reports on page load
document.addEventListener('DOMContentLoaded', loadPublicReports);
