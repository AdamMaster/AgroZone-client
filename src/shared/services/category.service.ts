export async function getCategories() {
  const res = await fetch('http://localhost:4000/categories', {
    next: { revalidate: 3600 }
  })

  if (!res.ok) {
    throw new Error('Не удалось загрузить категории')
  }

  return res.json()
}
