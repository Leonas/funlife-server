require 'spec_helper'

describe PlacesController do

  # This should return the minimal set of attributes required to create a valid
  # Place. As you add validations to Place, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) { { "name" => "MyString" } }

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # PlacesController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  describe "GET index" do
    xit "assigns all places as @places" do
      place = Place.create! valid_attributes
      get :index, {}, valid_session
      assigns(:places).should eq([place])
    end
  end

  describe "GET show" do
    xit "assigns the requested place as @place" do
      place = Place.create! valid_attributes
      get :show, {id: place.to_param}, valid_session
      assigns(:place).should eq(place)
    end
  end

  describe "GET new" do
    xit "assigns a new place as @place" do
      get :new, {}, valid_session
      assigns(:place).should be_a_new(Place)
    end
  end

  describe "GET edit" do
    xit "assigns the requested place as @place" do
      place = Place.create! valid_attributes
      get :edit, {id: place.to_param}, valid_session
      assigns(:place).should eq(place)
    end
  end

  describe "POST create" do
    describe "with valid params" do
      xit "creates a new Place" do
        expect {
          post :create, {place: valid_attributes}, valid_session
        }.to change(Place, :count).by(1)
      end

      xit "assigns a newly created place as @place" do
        post :create, {place: valid_attributes}, valid_session
        assigns(:place).should be_a(Place)
        assigns(:place).should be_persisted
      end

      xit "redirects to the created place" do
        post :create, {place: valid_attributes}, valid_session
        response.should redirect_to(Place.last)
      end
    end

    describe "with invalid params" do
      xit "assigns a newly created but unsaved place as @place" do
        # Trigger the behavior that occurs when invalid params are submitted
        Place.any_instance.stub(:save).and_return(false)
        post :create, {place: {"name" => "invalid value"}}, valid_session
        assigns(:place).should be_a_new(Place)
      end

      xit "re-renders the 'new' template" do
        # Trigger the behavior that occurs when invalid params are submitted
        Place.any_instance.stub(:save).and_return(false)
        post :create, {place: {"name" => "invalid value"}}, valid_session
        response.should render_template("new")
      end
    end
  end

  describe "PUT update" do
    describe "with valid params" do
      xit "updates the requested place" do
        place = Place.create! valid_attributes
        # Assuming there are no other places in the database, this
        # specifies that the Place created on the previous line
        # receives the :update_attributes message with whatever params are
        # submitted in the request.
        Place.any_instance.should_receive(:update_attributes).with({ "name" => "MyString" })
        put :update, {id: place.to_param, place: {"name" => "MyString"}}, valid_session
      end

      xit "assigns the requested place as @place" do
        place = Place.create! valid_attributes
        put :update, {id: place.to_param, place: valid_attributes}, valid_session
        assigns(:place).should eq(place)
      end

      xit "redirects to the place" do
        place = Place.create! valid_attributes
        put :update, {id: place.to_param, place: valid_attributes}, valid_session
        response.should redirect_to(place)
      end
    end

  end

  describe "DELETE destroy" do
    xit "destroys the requested place" do
      place = Place.create! valid_attributes
      expect {
        delete :destroy, {id: place.to_param}, valid_session
      }.to change(Place, :count).by(-1)
    end
  end

end
