const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // e.g. 'diamond_chestplate', 'wolf_spawn_egg'
  type: { type: String, enum: ['skin', 'chest', 'tool', 'pet'], required: true },
  priceCoins: { type: Number, default: 0 },
  priceGems: { type: Number, default: 0 },
  rarity: { type: String, enum: ['comun', 'raro', 'epico', 'legendario'], default: 'comun' }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
