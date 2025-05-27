# Pin npm packages by running ./bin/importmap

pin "@rails/actioncable", to: "actioncable.esm.js"
pin "application", preload: true

# Pin all channel files
pin "channels", to: "channels/index.js"
pin "channels/consumer", to: "channels/consumer.js"
pin "channels/chat_channel", to: "channels/chat_channel.js"
pin "@anycable/turbo-stream", to: "@anycable--turbo-stream.js" # @0.8.1
pin "@anycable/web", to: "@anycable--web.js" # @1.1.0
pin "@anycable/core", to: "@anycable--core.js" # @1.1.2
pin "@hotwired/turbo", to: "@hotwired--turbo.js" # @8.0.13
pin "nanoevents" # @9.1.0
pin "cable", to: "cable.js", preload: true
