<div class="navbar navbar-fixed-top">
   <div class='navbar-inner row-fluid lead'>
      <div class='span4 text-left'>
         <a class="btn btn-small go_back"  href="/chats_controller/">Back</a>
      </div>
      <div class='span4 text-center '>Chats</div>
   </div>
</div>

   <div class="row-fluid btn-group">
     <a class="span6 btn" href='/chats_controller/'>Recieved</a>
     <a class="span6 btn" href='/chats_controller/recieved/'>Sent</a>
   </div>
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

<div class='row-fluid well well-small'>
   <div class='span2'>
      <img src="/src/photos/7.png">
   </div>
   <div class='span10'>
   <small class='muted'>7:10pm</small><br>
      Hello Bob! How are you doing?
   </div>
</div>


<div class='row-fluid well well-small'>
   <div class='span10'>
   <small class='muted'>7:12pm</small><br>
     I'm doing good how are you?
   </div>
   <div class='span2'>
      <img src="/src/photos/5.png">
   </div>
</div>



<div class="navbar navbar-inverse navbar-fixed-bottom">
   <div class='navbar-inner row-fluid'>
      <div class="input-append span12">
      <div class='span10'>
         <input class='span12' type="text">
      </div>
      <div class='span2 text-center'>
          <a class="btn btn-info" type="button">Send</a>
      </div>
</div>
      </div>
</div>

