import consumer from "channels/consumer"

consumer.subscriptions.create("ChatChannel", {
  connected() {
    console.log("Connected to ChatChannel")
  },

  disconnected() {
    console.log("Disconnected from ChatChannel")
  },

  received(data) {
    const messages = document.querySelector("#messages")
    if (messages) {
      messages.insertAdjacentHTML("beforeend", `<p>${data.content}</p>`)
      messages.lastElementChild.scrollIntoView({ behavior: "smooth" })
    }
  }
})
