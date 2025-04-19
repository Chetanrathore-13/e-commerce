import { useState, useEffect } from "react"
import { PlusCircle, Pencil, Trash2, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { toast } from "../components/ui/sonner"
import { cn } from "../lib/utils"


export function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    parent_category_id: "",
  })
  const [formErrors, setFormErrors] = useState({
    name: "",
  })
  const [submitting, setSubmitting] = useState(false)

  // Custom color from the requirement
  const customColor = "rgb(176, 142, 91)"
  const customColorHex = "#b08e5b"

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await mockCategoryApi.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Get parent category name
  const getParentCategoryName = (parentId) => {
    if (!parentId) return "None"
    const parent = categories.find((cat) => cat._id === parentId)
    return parent ? parent.name : "Unknown"
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (name === "name" && value.trim() !== "") {
      setFormErrors((prev) => ({ ...prev, name: "" }))
    }
  }

  // Handle parent category selection
  const handleParentChange = (value) => {
    setFormData((prev) => ({ ...prev, parent_category_id: value === "none" ? "" : value }))
  }

  // Validate form
  const validateForm = () => {
    let valid = true
    const errors = { name: "" }

    if (!formData.name.trim()) {
      errors.name = "Category name is required"
      valid = false
    }

    setFormErrors(errors)
    return valid
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      parent_category_id: "",
    })
    setFormErrors({
      name: "",
    })
    setSelectedCategory(null)
  }

  // Open form for creating a new category
  const handleAddNew = () => {
    resetForm()
    setFormOpen(true)
  }

  // Open form for editing a category
  const handleEdit = (category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      parent_category_id: category.parent_category_id || "",
    })
    setFormOpen(true)
  }

  // Open delete confirmation dialog
  const handleDeleteClick = (category) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      if (selectedCategory) {
        // Update existing category
        await mockCategoryApi.updateCategory(selectedCategory._id, formData)
        toast({
          title: "Category Updated",
          description: "The category has been updated successfully.",
        })
      } else {
        // Create new category
        await mockCategoryApi.createCategory(formData)
        toast({
          title: "Category Created",
          description: "New category has been created successfully.",
        })
      }

      setFormOpen(false)
      resetForm()
      fetchCategories()
    } catch (error) {
      console.error("Error saving category:", error)

      // Handle unique name constraint error
      if (error.message.includes("already exists")) {
        setFormErrors((prev) => ({ ...prev, name: "A category with this name already exists" }))
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to save category. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Delete category
  const handleDelete = async () => {
    if (!selectedCategory) return

    try {
      await mockCategoryApi.deleteCategory(selectedCategory._id)

      toast({
        title: "Category Deleted",
        description: "The category has been deleted successfully.",
      })

      setDeleteDialogOpen(false)
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={handleAddNew} style={{ backgroundColor: customColorHex }} className="hover:bg-opacity-90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No categories found. Create your first category.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{getParentCategoryName(category.parent_category_id)}</TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(category)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Update the category details below."
                : "Fill in the details to create a new category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  className={cn(formErrors.name && "border-red-500")}
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent">Parent Category</Label>
                <Select value={formData.parent_category_id || "none"} onValueChange={handleParentChange}>
                  <SelectTrigger id="parent">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories
                      .filter(
                        (cat) =>
                          // Don't show the current category as a parent option
                          !selectedCategory || cat._id !== selectedCategory._id,
                      )
                      .map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: customColorHex }}
                className="hover:bg-opacity-90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : selectedCategory ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &quot;
              {selectedCategory?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
