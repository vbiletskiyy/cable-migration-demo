class AddAccountIdToMessages < ActiveRecord::Migration[8.0]
  def change
    add_reference :messages, :account, index: true
  end
end
