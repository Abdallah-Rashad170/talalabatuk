exports.generateOrderNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth()+1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  const t = String(Math.floor(Math.random()*9000)+1000);
  return `TM-${y}${m}${d}-${t}`;
};

exports.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
