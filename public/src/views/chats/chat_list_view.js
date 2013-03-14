All your chats:

    <table>
        <tr>
            <td>Email</td>
            <td>Name</td>
            <td>Chat</td>
            <tr>
{{~it.chat_list :value:index}}
                <tr>
                    <td>{{=value.email}}</td>
                    <td>{{=value.name}}</td>
                    <td><a href="/chats_controller/chat/{{=value.user_id}}">View</a></td>
                </tr>

{{~}}

            </table>
