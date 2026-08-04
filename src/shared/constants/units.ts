// Ключи — значения enum Prisma PriceUnit (server/prisma/schema.prisma), они
// приходят с бэка именно в таком регистре (ad.unit: 'KG', 'TON', ...), а не
// в нижнем — раньше здесь были ключи в нижнем регистре и словарь ни разу не
// срабатывал. Значения — винительный падеж ("за Тонну" → "за тонну"), чтобы
// использовать напрямую в фразах вида `за ${PRICE_UNITS[unit].toLowerCase()}`.
export const PRICE_UNITS: Record<string, string> = {
  ITEM: 'Штуку',
  TON: 'Тонну',
  KG: 'Килограмм',
  LITER: 'Литр',
  M3: 'м³',
  BAG: 'Мешок',
  HEAD: 'Голову',
  DOSE: 'Дозу',
  RUNNING_METER: 'Погонный метр',
  HA: 'Гектар',
  HOUR: 'Час'
}
