

{{~it.chat_log :value:index}}
Chatting with {{=value.chat_info.other_name}}
{{? value.messages.name === current_user.name }}
<div class='commentLevel1'>
    <div class='userimg' style='background-image:url({{=value.userimg}});'></div>
    <div class='usercomment'>
        <span class='username'>{{=value.name}}</span>
        <span class='commentTime'>{{=value.time}}</span>
        <p class='commentContent'>{{=value.comment}}</p>
    </div>
</div>
{{?? value.level != true}}
<div class='commentLevel2'>
    <div class='userimg' style='background-image: url({{=value.userimg}})'></div>
    <div class='usercomment'>
        <span class='username'>{{=value.name}}</span>
        <span class='commentTime'>{{=value.time}}</span>
        <p class='commentContent'>{{=value.comment}}</p>
    </div>
</div>
{{?}}
{{~}}

There needs to be that one line form here with a button on the right.
<a class='button' href='chats/send'>Reply</a>