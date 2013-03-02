Funlife::Application.routes.draw do
  resources :chats, except: :edit

  # The priority is based upon order of creation:
  # first created -> highest priority.

  root to: 'users#index'
  resources :users
  post 'login', to: 'token_authentications#create'
  post 'authenticate_token', to: 'token_authentications#startup_login_check'
  post 'register', to: 'users#complete_registration'
  get 'startup', to: 'token_authentications#startup_login_check'
  #match 'token_auth/:user' => 'token_authentications#create'

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

end
