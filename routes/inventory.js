const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InventoryItem = require('../models/InventoryItem');
const User = require('../models/User');

// @route   GET api/inventory/shop
// @desc    Get all items in shop
// @access  Private
router.get('/shop', auth, async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/inventory/buy
// @desc    Buy an item from shop
// @access  Private
router.post('/buy', auth, async (req, res) => {
  const { itemId } = req.body;

  try {
    const item = await InventoryItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ msg: 'Artículo no encontrado en la tienda' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Check if user already has item
    const hasItem = user.inventory.find(i => i.itemId.toString() === itemId);
    if (hasItem) {
      return res.status(400).json({ msg: 'Ya posees este artículo en tu inventario' });
    }

    // Check cost
    if (user.coins < item.priceCoins || user.gems < item.priceGems) {
      return res.status(400).json({ msg: 'No tienes suficientes monedas o gemas' });
    }

    // Deduct and add
    user.coins -= item.priceCoins;
    user.gems -= item.priceGems;
    user.inventory.push({ itemId: item._id, equipped: false });

    await user.save();
    
    const updatedUser = await User.findById(req.user.id).populate('inventory.itemId');

    res.json({
      inventory: updatedUser.inventory,
      coins: updatedUser.coins,
      gems: updatedUser.gems,
      msg: `Compraste ${item.name} con éxito!`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/inventory/equip
// @desc    Equip a skin or activate a pet
// @access  Private
router.post('/equip', auth, async (req, res) => {
  const { itemId, action } = req.body; // action: 'equip' or 'unequip'

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Find the item in user's inventory
    const inventoryEntry = user.inventory.find(i => i.itemId.toString() === itemId);
    if (!inventoryEntry) {
      return res.status(400).json({ msg: 'No posees este artículo' });
    }

    const item = await InventoryItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ msg: 'Artículo no encontrado' });
    }

    if (action === 'equip') {
      // Unequip all items of the same type
      for (let entry of user.inventory) {
        const entryItem = await InventoryItem.findById(entry.itemId);
        if (entryItem && entryItem.type === item.type) {
          entry.equipped = false;
        }
      }
      inventoryEntry.equipped = true;

      // Update specialized fields on User model
      if (item.type === 'skin') {
        user.avatar = item.icon; // e.g. skin name/key
      } else if (item.type === 'pet') {
        user.activePet = item.icon; // e.g. pet name/key
      }
    } else {
      inventoryEntry.equipped = false;
      if (item.type === 'skin') {
        user.avatar = 'steve'; // fallback default
      } else if (item.type === 'pet') {
        user.activePet = '';
      }
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id).populate('inventory.itemId');
    res.json({
      inventory: updatedUser.inventory,
      avatar: updatedUser.avatar,
      activePet: updatedUser.activePet,
      msg: action === 'equip' ? `Equipado: ${item.name}` : `Desequipado: ${item.name}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
