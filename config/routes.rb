FunlifeServer::Application.routes.draw do


  scope defaults: { format: "json" } do

    ############Sessions################
    resources :sessions, only: [:create] do
      collection do
        delete :destroy
      end
    end


    ############Users################
    resources :users, only: [:index, :create, :show] do
      member do
        get :following
        get :followers
        get :fav_places
        get :fav_activities
        get :invitations
        get :photos
      end
      collection do
        put :update
        get :dashboard
      end
      resources :comments, only: [:index, :create]
    end


    ############Conversations################
    resources :conversations, only: [:index, :create, :show, :destroy] do
      member do
        post :create_message
      end
    end


    ############Relationships################
    resources :relationships, only: [:create] do
      collection do
        delete :destroy
      end
    end


    ############Events################
    resources :events, only: [:index, :create, :show, :destroy] do
      resources :guests, controller: "event_guests", only: [:index, :create, :update, :destroy] do
        collection do
          get :attending
        end
      end
      resources :comments, only: [:index, :create, :update, :delete]
    end


    ############Photos################
    resources :photos, only: [:create, :show, :delete] do
      collection do
        get :auth
      end
      resources :comments, only: [:index, :create]
      resources :likes, only: [:create] do
        collection do
          delete :destroy
        end
      end
    end

    ############Places################
    resources :places, only: [:index, :show] do
      resources :comments, only: [:index, :create]
      resources :likes, only: [:create] do
        collection do
          delete :destroy
        end
      end
    end


    ############Comments################
    resources :comments, only: [:show, :update, :destroy]



    ############Activities################
    resources :activities, only: [:index, :show] do
      member do
        get :events
        get :places
      end
    end

    ############Cross Origin Resource Sharing (CORS) ################
    match "*options", controller: "users", action: "options", constraints: { method: "OPTIONS" }
    match "/users",   controller: "users", action: "options", constraints: { method: "OPTIONS" }

  end


  ############Root################
  root to: "users#index"


end
