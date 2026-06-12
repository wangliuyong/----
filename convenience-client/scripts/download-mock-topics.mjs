/**
 * 下载 mock 主题配图到 src/static/mock/topics/
 * 使用 loremflickr 语义标签，下载后走本地 static，小程序/H5/APP 均可稳定加载
 *
 * 用法：node scripts/download-mock-topics.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../src/static/mock/topics');

/** 主题 → loremflickr 标签（逗号分隔，语义相关） */
const TOPIC_TAGS = {
  phone: 'phone,smartphone',
  laptop: 'laptop,computer',
  headphones: 'headphones,audio',
  'air-purifier': 'appliance,home',
  'furniture-table': 'table,furniture',
  bed: 'bed,bedroom',
  stroller: 'baby,stroller',
  bag: 'handbag,bag',
  gaming: 'gaming,console',
  chair: 'office,chair',
  car: 'car,automobile',
  carpool: 'car,road',
  cat: 'cat,kitten',
  'keys-lost': 'keys,keychain',
  books: 'books,library',
  warehouse: 'warehouse,logistics',
  coffee: 'coffee,cafe',
  food: 'food,cooking',
  wedding: 'wedding,bride',
  hospital: 'hospital,medical',
  wheelchair: 'wheelchair,medical',
  shop: 'convenience,store',
  ebike: 'bicycle,electric',
  supermarket: 'supermarket,grocery',
  'plumbing-work': 'construction,plumber',
  'kitchen-cabinet': 'kitchen,cabinet',
  legal: 'law,legal',
  document: 'document,office',
  nail: 'nails,manicure',
  'beauty-device': 'skincare,beauty',
  'baby-care': 'baby,newborn',
  storefront: 'shop,storefront',
  'job-event': 'conference,event',
  tutoring: 'tutoring,education',
  internship: 'office,intern',
  photography: 'camera,photography',
  cleaning: 'cleaning,housekeeping',
  'renovation-clean': 'renovation,cleaning',
  'air-conditioner': 'airconditioner,cooling',
  plumbing: 'plumber,pipes',
  moving: 'moving,truck',
  keys: 'keys,lock',
  apartment: 'apartment,interior',
  bedroom: 'bedroom,room',
  'job-office': 'office,business',
  general: 'city,community',
  sports: 'sports,fitness',
  music: 'music,guitar',
  'office-equipment': 'printer,office',
  design: 'design,creative',
  sales: 'sales,business',
  'pet-service': 'pet,dog',
  'appliance-clean': 'cleaning,appliance',
  plants: 'plants,garden',
  parking: 'parking,car',
  repair: 'tools,repair',
  driving: 'driving,car',
  'car-wash': 'carwash,car',
  event: 'party,event',
  'skill-exchange': 'teamwork,people',
  bakery: 'bakery,bread',
  groceries: 'groceries,vegetables',
  dining: 'restaurant,dining',
  makeup: 'makeup,cosmetics',
  'wedding-car': 'wedding,car',
  hotel: 'hotel,room',
  therapy: 'therapy,wellness',
  health: 'health,medical',
  tcm: 'chinese,medicine',
  medicine: 'medicine,pills',
  equipment: 'equipment,machine',
  franchise: 'business,franchise',
  materials: 'construction,materials',
  'design-plan': 'blueprint,architecture',
  'furniture-install': 'furniture,installation',
  accounting: 'accounting,finance',
  contract: 'contract,document',
  'business-reg': 'business,registration',
  haircut: 'haircut,salon',
  skincare: 'skincare,face',
  'early-education': 'children,education',
  maternity: 'pregnancy,maternity',
  'parent-child': 'family,parent',
};

async function downloadTopic(topic, tags) {
  const url = `https://loremflickr.com/800/600/${tags}/all`;
  const out = path.join(OUT_DIR, `${topic}.jpg`);
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${topic} HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4096) throw new Error(`${topic} file too small (${buf.length} bytes)`);
  fs.writeFileSync(out, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  let fail = 0;
  for (const [topic, tags] of Object.entries(TOPIC_TAGS)) {
    try {
      const size = await downloadTopic(topic, tags);
      console.log(`OK  ${topic}.jpg (${size} bytes)`);
      ok += 1;
      /** 避免请求过快被限流 */
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.error(`FAIL ${topic}:`, e.message);
      fail += 1;
    }
  }
  console.log(`\nDone: ${ok} ok, ${fail} fail → ${OUT_DIR}`);
  if (fail > 0) process.exit(1);
}

main();
