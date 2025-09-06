"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/contexts/TranslationContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, ShoppingCart, Search, BookOpen, Download } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface Book {
  id: number
  name: string
  englishName: string
  category: string
  language: string
  author: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  image?: string
  imageUrl?: string
  coverImage?: string
  description: string
  pages: number
  format: "pdf"
  bestseller: boolean
}

interface Category {
  id: string
  name: string
}

interface Language {
  id: string
  name: string
}

export default function Books() {
  const { t, isLoading: translationLoading } = useTranslation()
  
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [language, setLanguage] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    alternativeMobile: '',
    specialInstructions: ''
  })

  // State for API data
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/books/public`)
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      const data = await response.json()
      console.log('API Response:', data) // Debug log
      // Ensure data is an array, handle different response formats
      if (Array.isArray(data)) {
        setBooks(data)
      } else if (data && Array.isArray(data.books)) {
        setBooks(data.books)
      } else if (data && Array.isArray(data.data)) {
        setBooks(data.data)
      } else {
        console.warn('Unexpected data format:', data)
        setBooks([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/books/categories`)
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  // Fetch languages from API
  const fetchLanguages = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/books/languages`)
      if (!response.ok) {
        throw new Error('Failed to fetch languages')
      }
      const data = await response.json()
      setLanguages(data.languages || [])
    } catch (err) {
      console.error('Failed to fetch languages:', err)
    }
  }

  // Initialize data on component mount
  useEffect(() => {
    fetchBooks()
    fetchCategories()
    fetchLanguages()
  }, [])

  // Fallback categories and languages if API doesn't return data
  const fallbackCategories = [
    { id: "predictive", name: "Predictive" },
    { id: "remedial", name: "Remedial" },
    { id: "classical", name: "Classical" },
    { id: "modern", name: "Modern" },
    { id: "healing", name: "Healing" },
    { id: "gemstone", name: "Gemstone" },
    { id: "yoga", name: "Yoga" },
    { id: "meditation", name: "Meditation" },
    { id: "other", name: "Other" }
  ]

  const fallbackLanguages = [
    { id: "hindi", name: "Hindi" },
    { id: "english", name: "English" },
    { id: "sanskrit", name: "Sanskrit" },
    { id: "urdu", name: "Urdu" },
    { id: "other", name: "Other" }
  ]

  // Use API data or fallback data
  const displayCategories = categories.length > 0 ? categories : fallbackCategories
  const displayLanguages = languages.length > 0 ? languages : fallbackLanguages

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    const matchesLanguage = language === "all" || book.language === language
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesLanguage && matchesSearch
  })

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Checkout Data:', checkoutData)
    console.log('Selected Product:', selectedProduct)
    
    alert(`Thank you ${checkoutData.name}! Your order for ${selectedProduct.name} has been received. You will be redirected to payment gateway.`)
    
    setCheckoutData({
      name: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      alternativeMobile: '',
      specialInstructions: ''
    })
    setShowCheckoutForm(false)
    setSelectedProduct(null)
  }

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading books...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Books</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchBooks} className="bg-orange-600 hover:bg-orange-700">
            Try Again
          </Button>
        </div>
      </main>
    )
  }

  // Show loading state while translations are loading
  if (translationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/books-hero.jpg')",
            opacity: 0.9
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-purple-900/80"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">📚</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">🌟</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">📖</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">✨</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('books.hero.title', 'Sacred Books Collection')}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {t('books.hero.subtitle', 'Sacred Books of Astrology & Spirituality')}
          </p>
          <p className="text-lg opacity-80 mb-8 max-w-3xl mx-auto">
            {t('books.hero.description', 'Authentic knowledge from ancient scriptures and modern experts')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span>Authentic Content</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🙏</span>
              <span>Expert Authors</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <span>Multiple Languages</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">🔍 Find Your Perfect Book</h2>
              <p className="text-gray-600">Filter by category, language and author</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-orange-600" />
                  Search Books
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search books, author, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-orange-600" />
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {displayCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  🌍 Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {displayLanguages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Search className="w-5 h-5 mr-2" />
                  Search Now
                </Button>
              </div>
            </div>
            
            {/* Quick Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="text-sm text-gray-600 mr-4">Quick Filters:</div>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors">
                ✨ Bestsellers
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors">
                📚 New Arrivals
              </button>
              <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors">
                🏆 Top Rated
              </button>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors">
                💰 Best Deals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Available Books Collection</h2>
            <p className="text-gray-600">
              {filteredBooks.length} books found 
              {books.length > 0 && ` (${books.length} total from API)`}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-gray-400 mt-2">
                API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/books/public
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50">
                {book.bestseller && (
                  <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                    ✨ Bestseller
                  </Badge>
                )}
                
                <div className="relative">
                  <img 
                    src={book.image || book.imageUrl || book.coverImage || '/placeholder.jpg'} 
                    alt={book.name}
                    className="w-full h-78 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-2 p-4">
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{book.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{book.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{book.rating}</span>
                      <span className="text-sm text-gray-500">({book.reviews})</span>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                      PDF
                    </Badge>
                  </div>

                  {/* Book Details */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-gray-50 px-3 py-2 rounded-lg text-center">
                      <div className="text-xs text-gray-600">Pages</div>
                      <div className="font-semibold text-sm">{book.pages}</div>
                    </div>
                    <div className="bg-gray-50 px-3 py-2 rounded-lg text-center">
                      <div className="text-xs text-gray-600">Language</div>
                      <div className="font-semibold text-sm">{book.language}</div>
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-orange-600">₹{book.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₹{book.originalPrice.toLocaleString()}</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 shadow-lg"
                      onClick={() => {
                        setSelectedProduct({
                          ...book,
                          selectedOption: { price: book.price || 0 },
                          optionType: 'direct'
                        })
                        setShowCheckoutForm(true)
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              {books.length === 0 ? (
                <div>
                  <p className="text-gray-500 text-lg mb-4">No books available from the API.</p>
                  <p className="text-sm text-gray-400 mb-4">Please check if the backend server is running and the API endpoint is accessible.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={fetchBooks}
                  >
                    Retry Loading Books
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 text-lg">No books match your current filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory("all")
                      setLanguage("all")
                      setSearchTerm("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Books?</h2>
            <p className="text-lg text-gray-600">Authentic and sacred knowledge</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "✅", title: "Authentic Content", desc: "Books written by experts", color: "from-green-500 to-emerald-500" },
              { icon: "🔄", title: "Easy Returns", desc: "30-day return policy", color: "from-blue-500 to-cyan-500" },
              { icon: "🚚", title: "Fast Delivery", desc: "Free shipping on orders above ₹500", color: "from-orange-500 to-red-500" }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Spiritual Journey Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get authentic knowledge from sacred books
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Explore Books
            </Button>
            <Button variant="outline" className="border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600">
              Call: +91 9773380099
            </Button>
          </div>
        </div>
      </section>

      {/* Checkout Form Modal */}
      {showCheckoutForm && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardTitle className="text-2xl flex items-center justify-between">
                🛒 Checkout - {selectedProduct.name}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowCheckoutForm(false)
                    setSelectedProduct(null)
                  }}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Order Summary */}
              <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-200">
                <h3 className="font-bold text-lg text-orange-800 mb-2">📋 Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Author:</span>
                    <span className="font-medium">{selectedProduct.author}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t">
                    <span>Total Amount:</span>
                    <span>₹{selectedProduct.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">📝 Delivery Information</h3>
                  <p className="text-gray-600">Please fill in your details for delivery</p>
                </div>

                {/* Fixed Product Name Field */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    🛍️ Product Name
                  </label>
                  <Input
                    type="text"
                    value={selectedProduct.name}
                    disabled
                    className="border-2 border-orange-200 bg-orange-100 text-orange-800 font-semibold cursor-not-allowed"
                  />
                  <p className="text-xs text-orange-600 mt-1">This field is fixed and cannot be changed</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 Full Name *
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.name}
                      onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📱 Mobile Number *
                    </label>
                    <Input
                      type="tel"
                      required
                      value={checkoutData.mobile}
                      onChange={(e) => setCheckoutData({...checkoutData, mobile: e.target.value})}
                      placeholder="Enter mobile number"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📞 Alternative Mobile
                    </label>
                    <Input
                      type="tel"
                      value={checkoutData.alternativeMobile}
                      onChange={(e) => setCheckoutData({...checkoutData, alternativeMobile: e.target.value})}
                      placeholder="Alternative number (optional)"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📮 PIN Code *
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.pincode}
                      onChange={(e) => setCheckoutData({...checkoutData, pincode: e.target.value})}
                      placeholder="PIN Code"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏠 Complete Address *
                  </label>
                  <Textarea
                    required
                    value={checkoutData.address}
                    onChange={(e: any) => setCheckoutData({...checkoutData, address: e.target.value})}
                    placeholder="Enter your complete delivery address"
                    className="border-2 border-orange-200 focus:border-orange-400"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏙️ City *
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.city}
                      onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})}
                      placeholder="City"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🗺️ State *
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.state}
                      onChange={(e) => setCheckoutData({...checkoutData, state: e.target.value})}
                      placeholder="State"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Special Instructions (Optional)
                  </label>
                  <Textarea
                    value={checkoutData.specialInstructions}
                    onChange={(e: any) => setCheckoutData({...checkoutData, specialInstructions: e.target.value})}
                    placeholder="Any special delivery instructions or requests"
                    className="border-2 border-orange-200 focus:border-orange-400"
                    rows={2}
                  />
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">📌 Important Information</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Free shipping across India</p>
                    <p>• Delivery within 5-7 working days</p>
                    <p>• COD available (Cash on Delivery)</p>
                    <p>• 30-day return policy</p>
                    <p>• Authentic content guaranteed</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowCheckoutForm(false)
                      setSelectedProduct(null)
                    }}
                  >
                    ← Back
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3"
                  >
                    💳 Proceed to Payment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
