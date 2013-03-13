<div class="panel">
  <div class="row-fluid text-center">
    <br><br>
    <h1>FunLife</h1>
    <br>
    <div id="wrong_password" class="alert alert-error">Wrong Password</div>
    <div id="email_exists" class="alert">An account with that email already exists. Login instead?</div>
    <br><br>
    <div id="login_holder">
      <form id="login_form">
        <input type="text" name="user[email]" placeholder="email">
        <br>
        <input type="text" name="user[password]" placeholder="password">
      </form>
      <ul class="pager">
          <li><a href="/users_controller/user_login/register">Register</a></li>
          <li><a href="/users_controller/user_login/login">Login</a></li>
      </ul>
    </div>
  </div>
</div>

