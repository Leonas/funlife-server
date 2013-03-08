This is the chat view
<div class="container-fluid text-center">
  <div class="row-fluid">
    <div class="span6">
      Messages
    </div>
    <div class="span6">
      Sent
    </div>
  </div>
</div>
{{~it.chat_log :value:index}}
Chatting with {{=value.chat_info.person2}}
{{? value.messages.name === current_user.name }}
<div class='chat_message_left'>
    <div class='userimg' style='background-image:url({{=value.userimg}});'></div>
    <div class='usercomment'>
        <span class='username'>{{=value.name}}</span>
        <span class='commentTime'>{{=value.time}}</span>
        <p class='commentContent'>{{=value.comment}}</p>
    </div>
</div>
{{?? value.level != true}}
<div class='chat_message_right'>
    <div class='userimg' style='background-image: url({{=value.userimg}})'></div>
    <div class='usercomment'>
        <span class='username'>{{=value.name}}</span>
        <span class='commentTime'>{{=value.time}}</span>
        <p class='commentContent'>{{=value.comment}}</p>
    </div>
</div>
{{?}}
{{~}}

<form>
 <input></input>
</form>



<button id='chat_submit' class='button'>Reply</button>