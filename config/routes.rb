FunlifeServer::Application.routes.draw do


  scope defaults: { format: "json" } do

    ############Sessions################
    resources :sessions, only: [:create] do
      collection do
        delete :destroy
      end
    end


    ############Users################
    resources :users, only: [:index, :create, :show, :update] do
      member do
        get :following
        get :followers
        get :photos
        get :fav_places
        get :fav_activities
        get :invitations
      end
      collection do
        get :dashboard
      end
    end


    ############Conversations################
    resources :conversations, only: [:index, :create, :show, :destroy] do
      resources :conversation_messages, only: [:index, :create]
    end


    ############Relationships################
    resources :relationships, only: [:create] do
      collection do
        delete :destroy
      end
    end


    ############Events################
    resources :events, only: [:index, :create, :show, :destroy] do
      resources :guests, controller: "event_guests", only: [:index, :create, :update, :destroy]
      resources :comments, only: [:index, :create, :delete]
    end


    ############Photos################
    resources :photos, only: [:create, :show, :delete] do
      collection do
        get :auth
      end
      member do
        post :like
      end
      resources :comments, only: [:index, :create, :delete]
    end

    ############Places################
    resources :places, only: [:index, :show] do
      member do
        post :like
      end
      resources :comments, only: [:index, :create, :delete]
    end


    ############Cross Origin Resource Sharing (CORS) ################ is that what this is for?
    match '*options', controller: 'users', action: 'options', constraints: { method: 'OPTIONS' }
    match '/users',   controller: 'users', action: 'options', constraints: { method: 'OPTIONS' }

  end


  ############Root################
  root to: 'users#index'


end
