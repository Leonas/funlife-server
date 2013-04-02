class CategoriesController < ApplicationController
  # GET /index
  def index
    @categories = Category.all
    render json: @categories
  end
end
