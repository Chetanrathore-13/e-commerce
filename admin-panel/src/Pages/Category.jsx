import { CategoryManager } from "../Components/CategoryManager"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Category Management</h1>
      <CategoryManager />
    </div>
  )
}
