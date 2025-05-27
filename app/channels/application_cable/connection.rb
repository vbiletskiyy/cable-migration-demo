module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      Rails.logger.info "Cable: connection established"
      self.current_user = "GuestUser" # For now, stub identity
    end
  end
end
