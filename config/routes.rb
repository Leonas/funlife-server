Funlife::Application.routes.draw do

  # The priority is based upon order of creation:
  # first created -> highest priority.

  scope defaults: { format: "json" } do

    resources :chats, except: [:edit, :update]

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
