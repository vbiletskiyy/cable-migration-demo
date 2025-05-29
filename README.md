# Cable Migration Demo

This project demonstrates WebSocket performance comparison between **ActionCable** and **AnyCable** using Rails and k6 for load testing.

## 🐳 Getting Started with Docker

1. **Build the containers:**
   ```bash
   docker compose build

2. **Start the app:**

   ```bash
   docker compose up
   ```

3. **Set up the database (in another terminal):**

   ```bash
   docker compose exec web bash
   rails db:create
   rails db:migrate
   ```

You're now ready to use the application!

## ⚙️ Running Without Docker

1. Install dependencies:

   ```bash
   bundle install
   ```

2. Set up the database:

   ```bash
   rails db:create
   rails db:migrate
   ```

3. Start the Rails server:

   ```bash
   rails server
   ```

4. **Running AnyCable manually** (in two separate terminals):

   ```bash
   # Terminal 1
   bundle exec anycable

   # Terminal 2
   bundle exec bin/anycable-go
   ```

> Make sure to update `config/cable.yml`:
>
> ```yaml
> http_broadcast_url: "http://localhost:8090/_broadcast"
> ```
>
> Instead of:
>
> ```yaml
> http_broadcast_url: "http://anycable:8090/_broadcast"
> ```

## 🚦 Branches

* `action-cable`: Classic Rails ActionCable setup.
* `migrate-action-cable-to-any-cable`: Migrated version using AnyCable.

## 📈 Load Testing with k6

Install `k6` following instructions here:
👉 [https://grafana.com/docs/k6/latest/set-up/install-k6/](https://grafana.com/docs/k6/latest/set-up/install-k6/)

Run the WebSocket test:

```bash
k6 run k6/websocket_test.js
```

## ✅ Notes

* To test **AnyCable inside Docker**, open a shell inside the container:

  ```bash
  docker compose exec web bash
  bundle exec anycable
  ```

* For consistent results, ensure all containers/services are up before testing.
