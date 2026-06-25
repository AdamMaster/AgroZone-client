export async function getCategories() {
  const res = await fetch('http://localhost:4000/categories')

  if (!res.ok) {
    throw new Error('Не удалось загрузить категории')
  }

  return res.json()
}
