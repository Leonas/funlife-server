<div>
<h3> Users Nearby </h3>
<a class="btn btn-small"  href="/users_controller/logout">Logout</a>
<br><br>
{{~it.users_list :value:index}}
  <div class='activities width20 inline'>
    <a id="chat_{{=value.user_id}}" href="/chats_controller/chat/{{=value.user_id}}">
        <img class='activityBigIcon img-rounded' src='layout/img/user_placeholder.jpeg'/>
    </a>
    <td>{{=value.name}}</td>
  </div>

{{~}}
</div>