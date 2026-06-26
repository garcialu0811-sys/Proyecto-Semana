// Shop and Inventory Controller

let shopItems = [];
let userData = null;

const COMPANION_SVGS = {
  wolf: `
    <svg width="80" height="80" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;">
      <rect x="3" y="3" width="10" height="10" fill="#d1d1d1"/>
      <rect x="2" y="4" width="1" height="6" fill="#a1a1a1"/>
      <rect x="13" y="4" width="1" height="6" fill="#a1a1a1"/>
      <rect x="3" y="1" width="2" height="2" fill="#808080"/>
      <rect x="11" y="1" width="2" height="2" fill="#808080"/>
      <rect x="5" y="5" width="2" height="1" fill="#fff"/>
      <rect x="6" y="5" width="1" height="1" fill="#000"/>
      <rect x="9" y="5" width="2" height="1" fill="#fff"/>
      <rect x="9" y="5" width="1" height="1" fill="#000"/>
      <rect x="4" y="10" width="8" height="2" fill="#ef4444"/> <!-- red collar -->
      <rect x="6" y="7" width="4" height="2" fill="#b1b1b1"/>
      <rect x="7" y="7" width="2" height="1" fill="#000"/>
    </svg>
  `,
  slime_pet: `
    <svg width="80" height="80" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;">
      <rect width="8" height="8" fill="#70c070"/>
      <rect x="1" y="3" width="2" height="2" fill="#104010"/>
      <rect x="5" y="3" width="2" height="2" fill="#104010"/>
      <rect x="2" y="6" width="4" height="1" fill="#104010"/>
    </svg>
  `
};

async function loadInventoryPage() {
  const user = await apiFetch('/auth/user');
  const shop = await apiFetch('/inventory/shop');
  
  if (!user || !shop) return;
  
  userData = user;
  shopItems = shop;

  // Set Wealth
  document.getElementById('wealth-coins').innerText = user.coins;
  document.getElementById('wealth-gems').innerText = user.gems;

  // Set sidebar pet avatar
  const sidebarPet = document.getElementById('sidebar-pet-avatar');
  const sidebarPetName = document.getElementById('sidebar-pet-name');
  if (user.activePet && COMPANION_SVGS[user.activePet]) {
    sidebarPet.innerHTML = COMPANION_SVGS[user.activePet];
    sidebarPetName.innerText = user.activePet === 'wolf' ? 'Lobo Compañero' : 'Pequeño Slime';
  } else {
    sidebarPet.innerHTML = `
      <svg width="80" height="80" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;">
        <rect x="2" y="2" width="12" height="12" fill="#30363d" stroke="#21262d" stroke-width="2"/>
        <line x1="4" y1="4" x2="12" y2="12" stroke="#21262d" stroke-width="2"/>
        <line x1="12" y1="4" x2="4" y2="12" stroke="#21262d" stroke-width="2"/>
      </svg>
    `;
    sidebarPetName.innerText = 'Ninguna';
  }

  // Render grids
  renderShop();
  renderInventory();
}

function renderShop() {
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';

  const ownedItemIds = new Set(userData.inventory.map(i => i.itemId._id.toString()));

  shopItems.forEach(item => {
    const isOwned = ownedItemIds.has(item._id.toString());
    const card = document.createElement('div');
    card.className = `item-card ${item.rarity}`;
    
    // Currency icon details
    const priceText = item.priceCoins > 0 
      ? `<span>${item.priceCoins} Monedas</span>` 
      : `<span>${item.priceGems} Esmeraldas</span>`;

    card.innerHTML = `
      <span class="item-badge ${item.rarity}">${item.rarity.toUpperCase()}</span>
      <div class="item-icon-box">
        <div class="item-icon icon-${item.icon}"></div>
      </div>
      <h3 class="item-name">${item.name}</h3>
      <p class="item-desc">${item.description}</p>
      <div class="price-box">
        ${isOwned ? '<span>Adquirido</span>' : priceText}
      </div>
      <button class="mc-btn ${isOwned ? 'disabled' : 'green'} item-action-btn" 
        ${isOwned ? 'disabled' : ''} 
        onclick="buyItem('${item._id}')">
        ${isOwned ? 'Adquirido' : 'Comprar'}
      </button>
    `;
    grid.appendChild(card);
  });
}

function renderInventory() {
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';

  if (userData.inventory.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--color-muted); margin-top: 20px;">Tu inventario está vacío. ¡Compra artículos en la tienda!</p>`;
    return;
  }

  userData.inventory.forEach(entry => {
    const item = entry.itemId;
    if (!item) return;

    const card = document.createElement('div');
    card.className = `item-card ${item.rarity}`;
    
    const isEquipped = entry.equipped;

    card.innerHTML = `
      <span class="item-badge ${item.rarity}">${item.rarity.toUpperCase()}</span>
      <div class="item-icon-box">
        <div class="item-icon icon-${item.icon}"></div>
      </div>
      <h3 class="item-name">${item.name}</h3>
      <p class="item-desc">${item.description}</p>
      <div class="price-box">
        <span>${isEquipped ? 'Equipado' : 'En inventario'}</span>
      </div>
      <button class="mc-btn ${isEquipped ? 'red' : 'green'} item-action-btn" 
        onclick="toggleEquip('${item._id}', ${isEquipped})">
        ${isEquipped ? 'Desequipar' : 'Equipar'}
      </button>
    `;
    grid.appendChild(card);
  });
}

async function buyItem(itemId) {
  const res = await apiFetch('/inventory/buy', {
    method: 'POST',
    body: JSON.stringify({ itemId })
  });

  if (res && res.msg) {
    // Spawn success golden particles
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, '#fbbf24', 30);
    alert(res.msg);
    loadInventoryPage();
    loadUserStats(); // reload header stats too!
  }
}

async function toggleEquip(itemId, isEquipped) {
  const action = isEquipped ? 'unequip' : 'equip';
  const res = await apiFetch('/inventory/equip', {
    method: 'POST',
    body: JSON.stringify({ itemId, action })
  });

  if (res && res.msg) {
    // Spawn green sparkles
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, '#34d399', 20);
    alert(res.msg);
    loadInventoryPage();
    loadUserStats(); // refresh navbar avatar
  }
}

function switchInventoryTab(tabId) {
  // Tabs toggle
  document.getElementById('tab-shop-btn').classList.toggle('active', tabId === 'shop');
  document.getElementById('tab-inv-btn').classList.toggle('active', tabId === 'inventory');

  // Panes toggle
  document.getElementById('pane-shop').classList.toggle('active', tabId === 'shop');
  document.getElementById('pane-inventory').classList.toggle('active', tabId === 'inventory');
}

document.addEventListener('DOMContentLoaded', loadInventoryPage);
