
Hello, I am on the _comments.js partial view <br>
<a href="/hello">Go Back</a>



{{~it.comments :value:index}}
   {{? value.level == 1 }}
    <div class='commentLevel1'>
         <div class='userimg' style='background-image:url({{=value.userimg}});'></div>
        <div class='usercomment'>
            <span class='username'>{{=value.name}}</span> 
            <span class='commentTime'>{{=value.time}}</span>
            <p class='commentContent'>{{=value.comment}}</p>
  			<a class='button' href='#reply'>Reply</a>
        </div>
    </div>
    {{?? value.level == 2}}
    <div class='commentLevel2'>
            <div class='userimg' style='background-image: url({{=value.userimg}})'></div>
        <div class='usercomment'>
            <span class='username'>{{=value.name}}</span> 
            <span class='commentTime'>{{=value.time}}</span>
            <p class='commentContent'>{{=value.comment}}</p>
        <a class='button' href='#reply'>Reply</a>
        </div>
    </div>
   {{??}}
     <div class='commentLevel3'>
        <div class='userimg' style='background-image: url({{=value.userimg}})'></div>
        <div class='usercomment'>
            <span class='username'>{{=value.name}}</span> 
            <span class='commentTime'>{{=value.time}}</span>
            <p class='commentContent'>{{=value.comment}}</p>
        <a class='button' href='#reply'>Reply</a>
        </div>
    </div>
  {{?}}
  {{~}}
