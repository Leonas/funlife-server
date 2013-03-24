<br>
<!--
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
    -->


    <div class="row-fluid">
        <div class="span2"><img class="img-polaroid" src="/photos/7.png"></div>
        <div class="span9 offset1 well well-small">
            <small class="muted">7:10pm</small>
            <p> Hello Bob! How are you doing? </p>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span9 well well-small">
            <small class="muted">7:12pm</small>
            <p>I'm doing good how are you?</p>
        </div>
        <div class="span2"><img class="img-polaroid" src="/photos/5.png"></div>
    </div>


