<div class="navbar navbar-fixed-top">
   <div class='navbar-inner text-center lead'>
      People Nearby
   </div>
</div>
   <div class="row-fluid btn-group">
     <a class="span4 btn" href='/people_controller/'>Following</a>
     <a class="span4 btn" href='/people_controller/followers/'>Followers</a>
     <a class="span4 btn" href='/people_controller/nearby/'>Nearby</a>
   </div>


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
      <a id="chat_{{=value.user_id}}" href="/people_controller/detail/{{=value.user_id}}" class="thumbnail">
      <img src="/src/layout/img/user_placeholder.jpeg">
      {{=value.name}}
       </a>
     </li>



{{~}}

</ul>
</div>