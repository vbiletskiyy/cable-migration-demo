class Message < ApplicationRecord
  belongs_to :account
  after_create_commit -> { broadcast_append_to "the_chat" }

  validates :content, presence: true
end
