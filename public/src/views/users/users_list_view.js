<h3>Users (Testing Only)</h3>
<a class="btn btn-small"  href="/users_controller/logout">Logout</a>
<br><br>
  

{{~it.users_list :value:index}}


	{{? index != 0 && index % 4 === 0 }}
	  	</ul>
		</div>
	{{?}}

  {{? index % 4 === 0 }}
  <div class="row-fluid">
  <ul class="thumbnails">
{{?}}


	  <li class="span3">
	    <a id="chat_{{=value.user_id}}" href="/chats_controller/chat/{{=value.user_id}}" class="thumbnail">
	      <img src="/src/layout/img/user_placeholder.jpeg">
	      {{=value.name}}
	      {{=index}}
	    </a>
	  </li>



{{~}}

</ul>
</div>
