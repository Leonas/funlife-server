Funlife::Application.routes.draw do
  resources :chats, except: :edit

  # The priority is based upon order of creation:
  # first created -> highest priority.

  scope defaults: { format: "json" } do
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
