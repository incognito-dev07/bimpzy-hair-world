module.exports = () => {
  return `
    <div class="admin-login-container">
      <div class="admin-login-card">
        <div class="login-header">
          <i class="fas fa-crown"></i>
          <h1>Bimpzy Hair World</h1>
          <p>Admin Portal</p>
        </div>
        
        <form class="login-form" id="loginForm">
          <div class="form-group">
            <label><i class="fas fa-user"></i> Username</label>
            <input type="text" id="username" name="username" required placeholder="Enter username">
          </div>
          
          <div class="form-group">
            <label><i class="fas fa-key"></i> Password</label>
            <input type="password" id="password" name="password" required placeholder="Enter password">
          </div>
          
          <button type="submit" class="login-btn">
            <i class="fas fa-sign-in-alt"></i> Login to Dashboard
          </button>
        </form>
        
        <div class="login-footer">
          <a href="/"><i class="fas fa-arrow-left"></i> Back to Website</a>
        </div>
      </div>
    </div>
  `;
};