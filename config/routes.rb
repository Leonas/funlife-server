Funlife::Application.routes.draw do

  scope defaults: { format: "json" } do

    resources :activities, except: [:edit, :new] do
      collection do
        get :feed
      end
    end

    resources :categories, only: [:index]

    resources :chats, except: [:edit, :update, :new] do
      resources :chat_messages, only: [:index, :create]
    end

    resources :friendships, only: [:create, :destroy]

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

    resources :users, except: [:update] do
      collection do
        put :update
      end
    end

    resources :sessions, only: [:create] do
      collection do
        delete :destroy
      end
    end
    match '*options', controller: 'users', action: 'options', constraints: { method: 'OPTIONS' }
    match '/users', :controller => 'users', :action => 'options', :constraints => {:method => 'OPTIONS'}
  end

  root to: 'users#index'


end
