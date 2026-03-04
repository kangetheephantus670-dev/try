let allReports = [];

// Check if user is logged in
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/admin/check-session');
    const data = await response.json();

    if (!data.loggedIn) {
      window.location.href = '/admin';
      return;
    }

    document.getElementById('adminEmail').textContent = data.email;
    loadDashboard();
  } catch (error) {
    console.error('Error checking session:', error);
    window.location.href = '/admin';
  }
});

// Load dashboard data
async function loadDashboard() {
  try {
    const statsResponse = await fetch('/api/admin/stats');
    const stats = await statsResponse.json();

    document.getElementById('totalReports').textContent = stats.total_reports || 0;
    document.getElementById('pendingReports').textContent = stats.pending || 0;
    document.getElementById('reviewingReports').textContent = stats.reviewing || 0;
    document.getElementById('resolvedReports').textContent = stats.resolved || 0;

    loadReports();
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load all reports
async function loadReports() {
  try {
    const response = await fetch('/api/admin/reports');
    allReports = await response.json();
    displayReports(allReports);
    displayRecentActivity(allReports.slice(0, 5));
  } catch (error) {
    console.error('Error loading reports:', error);
  }
}

// Display reports in table
function displayReports(reports) {
  const container = document.getElementById('reportsList');

  if (reports.length === 0) {
    container.innerHTML = '<p>No reports found.</p>';
    return;
  }

  const html = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Title</th>
          <th>Category</th>
          <th>Status</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${reports.map(report => `
          <tr>
            <td>#${report.id}</td>
            <td>${escapeHtml(report.customer_name)}</td>
            <td>${escapeHtml(report.title)}</td>
            <td>${escapeHtml(report.category)}</td>
            <td><span class="status ${report.status}">${report.status}</span></td>
            <td>${new Date(report.created_at).toLocaleDateString()}</td>
            <td>
              <button class="btn-small btn-secondary" onclick="viewReportDetails(${report.id})">View</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

// Display recent activity
function displayRecentActivity(reports) {
  const container = document.getElementById('recentActivityContainer');

  if (reports.length === 0) {
    container.innerHTML = '<p>No activity yet.</p>';
    return;
  }

  const html = reports.map(report => `
    <div class="activity-item" style="padding: 1rem; border-bottom: 1px solid #eee;">
      <strong>${escapeHtml(report.customer_name)}</strong> submitted a report
      <p style="margin: 0.5rem 0; color: #666;">"${escapeHtml(report.title)}"</p>
      <small>${new Date(report.created_at).toLocaleString()}</small>
    </div>
  `).join('');

  container.innerHTML = html;
}

// View report details in modal
async function viewReportDetails(reportId) {
  try {
    const response = await fetch(`/api/admin/reports/${reportId}`);
    const report = await response.json();

    const modal = document.getElementById('reportModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <h3>${escapeHtml(report.title)}</h3>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
          <div>
            <strong>Customer:</strong>
            <p>${escapeHtml(report.customer_name)}</p>
          </div>
          <div>
            <strong>Email:</strong>
            <p>${escapeHtml(report.email)}</p>
          </div>
          <div>
            <strong>Phone:</strong>
            <p>${report.phone ? escapeHtml(report.phone) : 'N/A'}</p>
          </div>
          <div>
            <strong>Category:</strong>
            <p>${escapeHtml(report.category)}</p>
          </div>
        </div>

        <div style="margin: 1.5rem 0;">
          <strong>Description:</strong>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 1rem; border-radius: 4px;">
            ${escapeHtml(report.description)}
          </p>
        </div>

        <div style="margin: 1.5rem 0;">
          <strong>Status:</strong>
          <select id="statusSelect" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0;">
            <option value="pending" ${report.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="reviewing" ${report.status === 'reviewing' ? 'selected' : ''}>Reviewing</option>
            <option value="resolved" ${report.status === 'resolved' ? 'selected' : ''}>Resolved</option>
            <option value="closed" ${report.status === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
          <button class="btn-small btn-secondary" onclick="updateStatus(${report.id})">Update Status</button>
        </div>

        <div style="margin: 1.5rem 0;">
          <strong>Your Response:</strong>
          <textarea id="responseText" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; margin: 0.5rem 0;" rows="4" placeholder="Type your response here...">${report.admin_response || ''}</textarea>
          <button class="btn-small btn-secondary" onclick="submitResponse(${report.id})">Save Response</button>
        </div>

        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #ddd; font-size: 0.875rem; color: #666;">
          <p><strong>Created:</strong> ${new Date(report.created_at).toLocaleString()}</p>
          ${report.updated_at ? `<p><strong>Updated:</strong> ${new Date(report.updated_at).toLocaleString()}</p>` : ''}
        </div>
      </div>
    `;

    modal.classList.add('show');
  } catch (error) {
    console.error('Error fetching report:', error);
    alert('Error loading report details');
  }
}

// Update report status
async function updateStatus(reportId) {
  const status = document.getElementById('statusSelect').value;

  try {
    const response = await fetch(`/api/admin/reports/${reportId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      alert('Status updated successfully');
      loadReports();
    } else {
      alert('Failed to update status');
    }
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Error updating status');
  }
}

// Submit admin response
async function submitResponse(reportId) {
  const responseText = document.getElementById('responseText').value.trim();

  if (!responseText) {
    alert('Please enter a response');
    return;
  }

  try {
    const response = await fetch(`/api/admin/reports/${reportId}/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response_text: responseText })
    });

    if (response.ok) {
      alert('Response saved successfully');
      loadReports();
      document.getElementById('reportModal').classList.remove('show');
    } else {
      alert('Failed to save response');
    }
  } catch (error) {
    console.error('Error submitting response:', error);
    alert('Error submitting response');
  }
}

// Close modal
document.querySelector('.modal-close').addEventListener('click', () => {
  document.getElementById('reportModal').classList.remove('show');
});

// Sidebar menu navigation
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    const section = item.dataset.section;
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
      sec.classList.remove('active');
    });
    
    // Remove active from all menu items
    document.querySelectorAll('.menu-item').forEach(mi => {
      mi.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(section).classList.add('active');
    item.classList.add('active');
  });
});

// Status filter
document.getElementById('statusFilter').addEventListener('change', (e) => {
  const status = e.target.value;
  
  if (!status) {
    displayReports(allReports);
  } else {
    const filtered = allReports.filter(report => report.status === status);
    displayReports(filtered);
  }
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
});
