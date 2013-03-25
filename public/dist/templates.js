function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl=tmpl|| {};
 tmpl.user_login_register_view=function anonymous(it) {var out='<div><div class="row-fluid text-center"><br><br><h1>FunLife</h1><br><div id="login_error" class="alert"></div><br><br><div id="login_holder"><form id="login_form"><input id=\'#login_form_email_field\' type="text" name="user[email]" placeholder="email"><br><input id=\'#login_form_password_field\' type="text" name="user[password]" placeholder="password"></form><ul class="pager"><li><a href="/users_controller/login_register/register">Register</a></li><li><a href="/users_controller/login_register/login">Login</a></li></ul></div></div></div>';return out;};

