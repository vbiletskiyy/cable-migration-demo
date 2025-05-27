class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "the_chat"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
