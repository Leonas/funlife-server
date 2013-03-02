List of Users
     <a class="button"  href="/users_controller/logout">Logout</a>
<table>
    <tr>
        <td>Email</td>
        <td>Name</td>
        <td>Chat</td>
    <tr>
{{~it.users_list :value:index}}
    <tr>
        <td>{{=value.email}}</td>
        <td>{{=value.name}}</td>
        <td><a id="chat_{{=value.user_id}}" href="/chats_controller/chat/{{=value.user_id}}">Chat</a></td>
    </tr>

{{~}}

</table>