Funlife::Application.routes.draw do


  resources :places, except: [:new, :edit]

  scope defaults: { format: "json" } do

    ############Sessions################
    resources :sessions, only: [:create] do
      collection do
        delete :destroy
      end
    end


    ############Users################
    resources :users, except: [:update] do
      member do
        get :following
        get :followers
      end
      collection do
        put :update
      end
    end


    ############Conversations################
    resources :conversations, except: [:edit, :update, :new] do
      resources :conversation_messages, only: [:index, :create]
    end


    ############Relationships################
    resources :relationships, only: [:create] do
      delete :destroy, on: :collection
    end


    ############Events################
    resources :events, except: [:edit, :new] do
      resources :attendees, only: [:index, :create]
      resources :invitations, only: [:create]
      collection do
        get :feed
      end
    end


    ############Categories################
    resources :categories, only: [:index]


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


    ############Cross Origin Resource Sharing (CORS) ################ is that what this is for?
    match '*options', controller: 'users', action: 'options', constraints: { method: 'OPTIONS' }
    match '/users',   controller: 'users', action: 'options', constraints: { method: 'OPTIONS' }

  end


  ############Root################
  root to: 'users#index'


end
