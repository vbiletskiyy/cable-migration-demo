# Pin npm packages by running ./bin/importmap

pin "@rails/actioncable", to: "actioncable.esm.js"
pin "application", preload: true

# Pin all channel files
pin "channels", to: "channels/index.js"
pin "channels/consumer", to: "channels/consumer.js"
pin "channels/chat_channel", to: "channels/chat_channel.js"
