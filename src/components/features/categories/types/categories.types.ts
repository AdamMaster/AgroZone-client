export interface ICategoryFeature {
  id: string
  categoryId: string
  name: string
  label: string
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT' | 'BOOLEAN'
  options?: string[]
  // Единицы измерения для type = NUMBER. Первый элемент — каноническая
  // единица: именно в ней значение хранится в Ad.features (см.
  // dynamic-field.tsx — при вводе в другой единице значение
  // конвертируется в каноническую перед сохранением). Если элементов
  // больше одного — пользователь выбирает нужную при заполнении поля,
  // если один — просто показывается подписью рядом с полем. Пустой
  // массив/undefined — у поля нет единицы измерения вовсе.
  units?: string[]
  // Отдаётся бэкендом (CategoryFeature.filterable), но раньше не было в
  // типе — нужно для сайдбара фильтра, чтобы не показывать нефильтруемые
  // поля (см. audit categories.ts).
  filterable: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ICategory {
  id: string
  name: string
  slug: string
  code: string
  iconId: string | null
  parentId: string | null
  level: number
  sortOrder: number
  path: string[]
  fullPath: string
  categoryFeatures: ICategoryFeature[]
  priceUnits: string[]
  children?: ICategory[]
  isBack?: boolean
}
