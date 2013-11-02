Funlife::Application.routes.draw do


  scope defaults: { format: "json" } do


    ############Activities################
    resources :activities, except: [:edit, :new] do
      resources :attendees, only: [:index, :create]
      resources :invitations, only: [:create]
      collection do
        get :feed
      end
    end


    ############Categories################
    resources :categories, only: [:index]


    ############Conversations################
    resources :conversations, except: [:edit, :update, :new] do
      resources :conversation_messages, only: [:index, :create]
    end

    ############Friendships################
    resources :friendships, only: [:create, :destroy]


    ############Photos################
    resources :photos, except: [:edit, :update, :new] do
      resources :comments, except: [:edit, :new]
      collection do
        get :following
        get :explore
      end
      member do
        post :like
      end
    end


    ############Users################
    resources :users, except: [:update] do
      collection do
        put :update
      end
    end

    ############Sessions################
    resources :sessions, only: [:create] do
      collection do
        delete :destroy
      end
    end
    match '*options', controller: 'users', action: 'options', constraints: { method: 'OPTIONS' }
    match '/users', :controller => 'users', :action => 'options', :constraints => {:method => 'OPTIONS'}
  end


  ############Root################
  root to: 'users#index'


end
