export const NPB_STADIUMS = [
  { id: 'fighters', name: 'エスコンフィールドHOKKAIDO', lat: 42.9904, lng: 141.5513, team: '日本ハム' },
  { id: 'eagles', name: '楽天モバイルパーク宮城', lat: 38.2565, lng: 140.9026, team: '楽天' },
  { id: 'lions', name: 'ベルーナドーム', lat: 35.7686, lng: 139.4205, team: '西武' },
  { id: 'marines', name: 'ZOZOマリンスタジアム', lat: 35.6451, lng: 140.0308, team: 'ロッテ' },
  { id: 'giants', name: '東京ドーム', lat: 35.7056, lng: 139.7519, team: '巨人' },
  { id: 'swallows', name: '明治神宮野球場', lat: 35.6743, lng: 139.7171, team: 'ヤクルト' },
  { id: 'baystars', name: '横浜スタジアム', lat: 35.4433, lng: 139.6401, team: 'DeNA' },
  { id: 'dragons', name: 'バンテリンドーム ナゴヤ', lat: 35.1859, lng: 136.9474, team: '中日' },
  { id: 'tigers', name: '阪神甲子園球場', lat: 34.7212, lng: 135.3616, team: '阪神' },
  { id: 'buffaloes', name: '京セラドーム大阪', lat: 34.6692, lng: 135.4761, team: 'オリックス' },
  { id: 'carp', name: 'MAZDA Zoom-Zoom スタジアム広島', lat: 34.3918, lng: 132.4847, team: '広島' },
  { id: 'hawks', name: 'みずほPayPayドーム福岡', lat: 33.5954, lng: 130.3622, team: 'ソフトバンク' },

];

export const TEAMS = NPB_STADIUMS.map(s => s.team);