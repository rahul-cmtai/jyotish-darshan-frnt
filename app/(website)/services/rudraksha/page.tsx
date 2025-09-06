"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, ShoppingCart, Search, Heart, Eye, Circle } from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get full image URL
const getImageUrl = (rudraksha: any): string => {
  // Check multiple possible image field names
  const imagePath = rudraksha.image || rudraksha.imageUrl || rudraksha.imagePath || rudraksha.mediaUrl || rudraksha.thumbnail;
  
  if (!imagePath) return '/images/placeholder.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /, it's a relative path
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Otherwise, assume it's a filename and construct the full path
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

// TypeScript interfaces
interface WorshipOption {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  silverCap: boolean;
  premium?: boolean;
}

interface Rudraksha {
  id: string | number;
  name: string;
  englishName: string;
  category: string;
  deity: string;
  planet: string;
  image: string;
  description: string;
  benefits: string[];
  size: string;
  origin: string;
  certified: boolean;
  rare: boolean;
  inStock: boolean;
  worshipOptions?: WorshipOption[];
  sizeOptions?: Array<{ size: string; price: number }>;
  iglCertified?: boolean;
  worshipIncluded?: { features: string[] };
  specialFeatures?: string[];
  isActive: boolean;
  createdAt?: string;
}

export default function Rudraksha() {
  const { t, isLoading: translationLoading } = useTranslation()
  
  const [selectedMukhi, setSelectedMukhi] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [selectedWorshipOptions, setSelectedWorshipOptions] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})
  const [showWorshipModal, setShowWorshipModal] = useState<number | null>(null)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [checkoutData, setCheckoutData] = useState({
    name: '',    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    alternativeMobile: '',
    specialInstructions: ''
  })
  // API State
  const [rudrakshas, setRudrakshas] = useState<Rudraksha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic categories from API data
  const dynamicCategories = Array.from(new Set(rudrakshas.map(r => r.category))).map(cat => ({
    id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' '),
    english: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')
  }));

  // Use dynamic categories for rudraksha types
  const rudrakshaTypes = [
    { id: "all", name: "All Rudraksha", english: "All Rudraksha" },
    ...dynamicCategories
  ];

  // Static data removed - using API data instead
  /*
  const rudrakshaCollection = [
    {
      id: 1,
      name: "1 Mukhi Rudraksha",
      englishName: "1 Mukhi Rudraksha",
      category: "1-mukhi",
      deity: "Lord Shiva",
      planet: "Sun",
      image: "/placeholder.jpg",
      description: "Supreme Brahman form - most powerful and rare",
      benefits: ["Moksha Attainment", "Spiritual Awakening", "Leadership", "Mental Balance"],
      size: "14-16 mm",
      origin: "Nepal",
      certified: true,
      rare: true,
      inStock: true,
      worshipOptions: [
        {
          id: "basic",
          name: "Basic Blessed",
          description: "Touched at Lord Shiva's feet with purity",
          price: 2000,
          features: ["Lord's touch blessing", "Basic purification"],
          silverCap: false
        },
        {
          id: "chanted",
          name: "Chanted by Brahmin",
          description: "Chanted by learned Brahmin with 501 mantras",
          price: 3100,
          features: ["501 Root mantras", "Panchamrit bath", "Special worship"],
          silverCap: true
        },
        {
          id: "special",
          name: "Special Panchamrit Abhishek",
          description: "Panchamrit Abhishek by two Brahmins",
          price: 5600,
          features: ["Two Brahmins worship", "1008 Root mantras", "Panchamrit bath"],
          silverCap: true
        },
        {
          id: "complete",
          name: "Complete Rudrabhishek",
          description: "Grand ritual by five Brahmins",
          price: 8800,
          features: ["Five Brahmins ritual", "Rudrabhishek ceremony", "Sahasranam recitation", "11,000 mantras"],
          silverCap: true,
          premium: true
        }
      ]
    },
    {
      id: 2,
      name: "2 Mukhi Rudraksha",
      englishName: "2 Mukhi Rudraksha",
      category: "2-mukhi",
      deity: "Ardhanarishwar",
      planet: "Moon",
      image: "/placeholder.jpg",
      description: "Symbol of Shiva-Parvati unity for harmony",
      benefits: ["Marital Harmony", "Family Unity", "Mental Peace", "Relationship Success"],
      size: "12-15 mm",
      origin: "Nepal",
      certified: true,
      rare: false,
      inStock: true,
      worshipOptions: [
        {
          id: "basic",
          name: "Basic Blessed",
          description: "Touched at Lord Shiva's feet with purity",
          price: 1700,
          features: ["Lord's touch blessing", "Basic purification"],
          silverCap: false
        },
        {
          id: "chanted",
          name: "Chanted by Brahmin",
          description: "Chanted by learned Brahmin with 501 mantras",
          price: 3100,
          features: ["501 Root mantras", "Panchamrit bath", "Special worship"],
          silverCap: true
        },
        {
          id: "special",
          name: "Special Panchamrit Abhishek",
          description: "Panchamrit Abhishek by two Brahmins",
          price: 5800,
          features: ["Two Brahmins worship", "1008 Root mantras", "Panchamrit bath"],
          silverCap: true
        },
        {
          id: "complete",
          name: "Complete Rudrabhishek",
          description: "Grand ritual by five Brahmins",
          price: 9100,
          features: ["Five Brahmins ritual", "Rudrabhishek ceremony", "Sahasranam recitation", "11,000 mantras"],
          silverCap: true,
          premium: true
        }
      ]
    },
    {
      id: 3,
      name: "3 Mukhi Rudraksha",
      englishName: "3 Mukhi Rudraksha",
      category: "3-mukhi",
      deity: "Agni Dev",
      planet: "Mars",
      image: "/placeholder.jpg",
      description: "Fire deity form for courage and confidence",
      benefits: ["Self-Confidence", "Courage", "Energy Enhancement", "Sin Destruction"],
      size: "10-13 mm",
      origin: "Nepal",
      certified: true,
      rare: false,
      inStock: true,
      worshipOptions: [
        {
          id: "basic",
          name: "Basic Blessed",
          description: "Touched at Lord Shiva's feet with purity",
          price: 1800,
          features: ["Lord's touch blessing", "Basic purification"],
          silverCap: false
        },
        {
          id: "chanted",
          name: "Chanted by Brahmin",
          description: "Chanted by Brahmin with 501 mantras",
          price: 3100,
          features: ["501 Root mantras", "Panchamrit bath", "Special worship"],
          silverCap: true
        },
        {
          id: "special",
          name: "Special Panchamrit Abhishek",
          description: "Panchamrit Abhishek by two Brahmins",
          price: 5600,
          features: ["Two Brahmins worship", "1008 Root mantras", "Panchamrit bath"],
          silverCap: true
        },
        {
          id: "complete",
          name: "Complete Rudrabhishek",
          description: "Grand ritual by five Brahmins",
          price: 8300,
          features: ["Five Brahmins ritual", "Rudrabhishek ceremony", "Sahasranam recitation", "11,000 mantras"],
          silverCap: true,
          premium: true
        }
      ]
    },
    {
      id: 4,
      name: "4 Mukhi Rudraksha",
      englishName: "4 Mukhi Rudraksha",
      category: "4-mukhi",
      deity: "Lord Brahma",
      planet: "Mercury",
      image: "/placeholder.jpg",
      description: "Lord Brahma symbol for knowledge and wisdom",
      benefits: ["Knowledge Growth", "Memory Power", "Communication Skills", "Educational Success"],
      size: "10-12 mm",
      origin: "Nepal",
      certified: true,
      rare: false,
      inStock: true,
      worshipOptions: [
        {
          id: "basic",
          name: "Basic Blessed",
          description: "Touched at Lord Shiva's feet with purity",
          price: 1950,
          features: ["Lord's touch blessing", "Basic purification"],
          silverCap: false
        },
        {
          id: "chanted",
          name: "Chanted by Brahmin",
          description: "Chanted by Brahmin with 501 mantras",
          price: 3100,
          features: ["501 Root mantras", "Panchamrit bath", "Special worship"],
          silverCap: true
        },
        {
          id: "special",
          name: "Special Panchamrit Abhishek",
          description: "Panchamrit Abhishek by two Brahmins",
          price: 5600,
          features: ["Two Brahmins worship", "1008 Root mantras", "Panchamrit bath"],
          silverCap: true
        },
        {
          id: "complete",
          name: "Complete Rudrabhishek",
          description: "Grand ritual by five Brahmins",
          price: 7600,
          features: ["Five Brahmins ritual", "Rudrabhishek ceremony", "Sahasranam recitation", "11,000 mantras"],
          silverCap: true,
          premium: true
        }
      ]
    },
    {
      id: 5,
      name: "5 Mukhi Rudraksha",
      englishName: "5 Mukhi Rudraksha",
      category: "5-mukhi",
      deity: "Kalagni Rudra",
      planet: "Jupiter",
      image: "/placeholder.jpg",
      description: "Most popular Kalagni Rudra form for all-round benefits",
      benefits: ["General Health", "Mental Peace", "Blood Pressure Control", "Stress Relief"],
      size: "8-12 mm",
      origin: "Nepal",
      certified: true,
      rare: false,
      inStock: true,
      worshipOptions: [
        {
          id: "basic",
          name: "Basic Blessed",
          description: "Touched at Lord Shiva's feet with purity",
          price: 591,
          features: ["Lord's touch blessing", "Basic purification"],
          silverCap: false
        },
        {
          id: "chanted",
          name: "Chanted by Brahmin",
          description: "Chanted by learned Brahmin with 501 mantras",
          price: 2200,
          features: ["501 Root mantras", "Panchamrit bath", "Special worship"],
          silverCap: true
        },
        {
          id: "special",
          name: "Special Panchamrit Abhishek",
          description: "Panchamrit Abhishek by two Brahmins",
          price: 4400,
          features: ["Two Brahmins worship", "1008 Root mantras", "Panchamrit bath"],
          silverCap: true
        },
        {
          id: "complete",
          name: "Complete Rudrabhishek",
          description: "Grand ritual by five Brahmins",
          price: 8100,
          features: ["Five Brahmins ritual", "Rudrabhishek ceremony", "Sahasranam recitation", "11,000 mantras"],
          silverCap: true,
          premium: true
        }
      ]
    },
    {
      id: 7,
      name: "7 Mukhi Rudraksha",
      englishName: "7 Mukhi Rudraksha",
      category: "7-mukhi",
      deity: "Maha Lakshmi",
      planet: "Saturn",
      image: "/placeholder.jpg",
      description: "Goddess Lakshmi form for wealth and prosperity",
      benefits: ["Wealth & Prosperity", "Business Success", "Saturn Peace", "Debt Removal"],
      size: "10-14 mm",
      origin: "Nepal",
      certified: true,
      rare: false,
      inStock: true,
      worshipOptions: [
        {
          id: "basic",
          name: "Basic Blessed",
          description: "Touched at Lord Shiva's feet with purity",
          price: 1111,
          features: ["Lord's touch blessing", "Basic purification"],
          silverCap: false
        },
        {
          id: "chanted",
          name: "Chanted by Brahmin",
          description: "Chanted by learned Brahmin with 501 mantras",
          price: 3200,
          features: ["501 Root mantras", "Panchamrit bath", "Special worship"],
          silverCap: true
        },
        {
          id: "special",
          name: "Special Panchamrit Abhishek",
          description: "Panchamrit Abhishek by two Brahmins",
          price: 5400,
          features: ["Two Brahmins worship", "1008 Root mantras", "Panchamrit bath"],
          silverCap: true
        },
        {
          id: "complete",
          name: "Complete Rudrabhishek",
          description: "Grand ritual by five Brahmins",
          price: 8700,
          features: ["Five Brahmins ritual", "Rudrabhishek ceremony", "Sahasranam recitation", "11,000 mantras"],
          silverCap: true,
          premium: true
        }
      ]
    },
    {
      id: 8,
      name: "8 Mukhi Rudraksha",
      englishName: "8 Mukhi Rudraksha (IGL Certified)",
      category: "multi",
      deity: "Lord Ganesh",
      planet: "Rahu",
      image: "/placeholder.jpg",
      description: "Vighnaharta Ganesh form for obstacle removal",
      benefits: ["Obstacle Removal", "Success", "Rahu Dosha Relief", "Leadership"],
      origin: "Nepal",
      certified: true,
      iglCertified: true,
      rare: true,
      inStock: true,
      sizeOptions: [
        { size: "19-20 mm", price: 13900 },
        { size: "21-22 mm", price: 14900 },
        { size: "23-24 mm", price: 15900 }
      ],
      worshipIncluded: {
        features: [
          "IGL Certificate authenticity guarantee",
          "Five Brahmins grand Rudrabhishek",
          "Shiva Sahasranam recitation",
          "11,000 Root mantras chanting",
          "Panchamrit bath with Gangajal",
          "Silver cap included",
          "Video recording available",
          "Live darshan available"
        ]
      }
    },
    {
      id: 9,
      name: "9 Mukhi Rudraksha",
      englishName: "9 Mukhi Rudraksha (IGL Certified)",
      category: "multi",
      deity: "Navdurga",
      planet: "Mars",
      image: "/placeholder.jpg",
      description: "Nine Durga forms for strength and courage",
      benefits: ["Strength & Courage", "Disease Relief", "Protection", "Enemy Defeat"],
      origin: "Nepal",
      certified: true,
      iglCertified: true,
      rare: true,
      inStock: true,
      sizeOptions: [
        { size: "19-20 mm", price: 14900 },
        { size: "21-22 mm", price: 15900 },
        { size: "23-24 mm", price: 18900 }
      ]
    },
    {
      id: 10,
      name: "10 Mukhi Rudraksha",
      englishName: "10 Mukhi Rudraksha (IGL Certified)",
      category: "multi",
      deity: "Lord Vishnu",
      planet: "All Directions",
      image: "/placeholder.jpg",
      description: "Lord Vishnu form for protection from negativity",
      benefits: ["Negative Energy Protection", "Courage", "Black Magic Relief", "Fearlessness"],
      origin: "Nepal",
      certified: true,
      iglCertified: true,
      rare: true,
      inStock: true,
      sizeOptions: [
        { size: "19-20 mm", price: 14300 },
        { size: "21-22 mm", price: 15300 },
        { size: "23-24 mm", price: 18300 }
      ]
    },
    {
      id: 11,
      name: "11 Mukhi Rudraksha",
      englishName: "11 Mukhi Rudraksha (IGL Certified)",
      category: "multi",
      deity: "Ekadash Rudra",
      planet: "Combined",
      image: "/placeholder.jpg",
      description: "Eleven Rudra forms with Hanuman blessing",
      benefits: ["Fearlessness", "Victory", "Spiritual Progress", "Longevity"],
      origin: "Nepal",
      certified: true,
      iglCertified: true,
      rare: true,
      inStock: true,
      sizeOptions: [
        { size: "19-20 mm", price: 14900 },
        { size: "21-22 mm", price: 15900 },
        { size: "23-24 mm", price: 16900 }
      ]
    },
    {
      id: 12,
      name: "12 Mukhi Rudraksha",
      englishName: "12 Mukhi Rudraksha (IGL Certified)",
      category: "multi",
      deity: "Surya Dev",
      planet: "Sun",
      image: "/placeholder.jpg",
      description: "Sun deity form for brilliance and leadership",
      benefits: ["Brilliance", "Energy", "Administrative Success", "Victory over Enemies"],
      origin: "Nepal",
      certified: true,
      iglCertified: true,
      rare: true,
      inStock: true,
      sizeOptions: [
        { size: "19-20 mm", price: 14300 },
        { size: "21-22 mm", price: 15300 },
        { size: "23-24 mm", price: 17300 }
      ]
    },
    {
      id: 13,
      name: "13 Mukhi Rudraksha",
      englishName: "13 Mukhi Rudraksha (IGL Certified)",
      category: "multi",
      deity: "Kamdev & Shiva",
      planet: "Venus & Shiva",
      image: "/placeholder.jpg",
      description: "Combined form of Kamdev and Shiva for attraction",
      benefits: ["Attraction Power", "Beauty", "Prosperity", "Material Success"],
      origin: "Nepal",
      certified: true,
      iglCertified: true,
      rare: true,
      inStock: true,
      sizeOptions: [
        { size: "19-20 mm", price: 19100 },
        { size: "21-22 mm", price: 20900 },
        { size: "23-24 mm", price: 22700 }
      ]
    },
    {
      id: 14,
      name: "14 Mukhi Rudraksha",
      englishName: "14 Mukhi Rudraksha (IGL Certified)",
      category: "multi",
      deity: "Mahadev's Third Eye",
      planet: "Third Eye",
      image: "/placeholder.jpg",
      description: "Mahadev's third eye - extremely rare divine gem",
      benefits: ["Divine Vision", "Leadership", "Spiritual Power", "Royal Yoga"],
      origin: "Nepal",
      certified: true,
      iglCertified: true,
      rare: true,
      inStock: true,
      sizeOptions: [
        { size: "19-20 mm", price: 47000 },
        { size: "21-22 mm", price: 55000 },
        { size: "23-24 mm", price: 60000 },
        { size: "25+ mm (Premium)", price: 65000 }
      ],
      specialFeatures: [
        "Seven Brahmins grand ritual",
        "Mahamrityunjaya japa",
        "Rudrashtadhyayi recitation",
        "Devmani status in scriptures"
      ]
    }
  ]
  */

  const priceRanges = [
    { id: "all", name: "All Prices" },
    { id: "0-1000", name: "Under ₹1,000" },
    { id: "1000-5000", name: "₹1,000 - ₹5,000" },
    { id: "5000-15000", name: "₹5,000 - ₹15,000" },
    { id: "15000-50000", name: "₹15,000 - ₹50,000" },
    { id: "50000", name: "Above ₹50,000" }
  ]

  const sortOptions = [
    { id: "popularity", name: "Most Popular" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" }
  ]

  const getLowestPrice = (rudraksha: Rudraksha) => {
    if (rudraksha.worshipOptions && rudraksha.worshipOptions.length > 0) {
      return Math.min(...rudraksha.worshipOptions.map((option) => option.price))
    }
    return 0
  }

  const handleSelectOption = (rudraksha: Rudraksha, option: WorshipOption | { size: string; price: number }, optionType: 'worship' | 'size') => {
    setSelectedProduct({
      ...rudraksha,
      selectedOption: option,
      optionType: optionType
    } as any)
    setShowWorshipModal(null)
    setShowCheckoutForm(true)
  }

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically integrate with payment gateway
    console.log('Checkout Data:', checkoutData)
    console.log('Selected Product:', selectedProduct)
    
    // For now, just show an alert
    alert(`Thank you ${checkoutData.name}! Your order for ${selectedProduct?.name} has been received. You will be redirected to payment gateway.`)
    
    // Reset form
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

  const filteredRudraksha = rudrakshas.filter(rudraksha => {
    // Only show active rudrakshas
    if (!rudraksha.isActive) return false;
    
    if (selectedMukhi !== "all" && rudraksha.category !== selectedMukhi) return false
    if (searchTerm && !rudraksha.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !rudraksha.englishName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rudraksha.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rudraksha.deity.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rudraksha.planet.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rudraksha.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase()))) return false
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      const lowestPrice = getLowestPrice(rudraksha)
      if (max && (lowestPrice < min || lowestPrice > max)) return false
      if (!max && lowestPrice < min) return false
    }
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return getLowestPrice(a) - getLowestPrice(b)
      case "price-high":
        return getLowestPrice(b) - getLowestPrice(a)
      case "rating":
        return ((b as any).rating || 4.5) - ((a as any).rating || 4.5)
      case "newest":
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      default:
        return ((b as any).reviews || 100) - ((a as any).reviews || 100)
    }
  });

  // Fetch rudrakshas from API
  useEffect(() => {
    fetchRudrakshas();
  }, []);

  const fetchRudrakshas = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/rudraksha/public`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      console.log('API Response:', data);
      
      // Debug: Log first rudraksha to see image field
      if (data.rudraksha && data.rudraksha.length > 0) {
        const firstRudraksha = data.rudraksha[0];
        console.log('First rudraksha image field:', firstRudraksha.image);
        console.log('All image-related fields:', {
          image: firstRudraksha.image,
          imageUrl: (firstRudraksha as any).imageUrl,
          imagePath: (firstRudraksha as any).imagePath,
          mediaUrl: (firstRudraksha as any).mediaUrl,
          thumbnail: (firstRudraksha as any).thumbnail
        });
        console.log('First rudraksha full data:', firstRudraksha);
      }
      
      // Handle different response formats
      if (data.success) {
        setRudrakshas(data.rudraksha || data.data || []);
      } else if (data.rudraksha) {
        setRudrakshas(data.rudraksha);
      } else if (data.data) {
        setRudrakshas(data.data);
      } else if (Array.isArray(data)) {
        setRudrakshas(data);
      } else {
        setError(data.message || 'Failed to fetch rudrakshas');
      }
    } catch (error: any) {
      console.error('Error fetching rudrakshas:', error);
      setError(`Failed to load rudrakshas: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
            backgroundImage: "url('/images/rudraksha-hero.jpg')",
            opacity: 0.9
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-purple-900/80"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">🕉️</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">📿</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">🌺</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">✨</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('rudraksha.hero.title', 'Rudraksha Collection')}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {t('rudraksha.hero.subtitle', 'Sacred Rudraksha Collection')}
          </p>
          <p className="text-lg opacity-80 mb-8 max-w-3xl mx-auto">
            {t('rudraksha.hero.description', 'Lord Shiva\'s divine blessing - Authentic, certified and blessed rudraksha beads with multiple worship options')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>{t('rudraksha.hero.features.certified', 'IGL Certified')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🙏</span>
              <span>{t('rudraksha.hero.features.blessed', 'Blessed by Brahmins')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📹</span>
              <span>{t('rudraksha.hero.features.video', 'Video Worship Available')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Rudraksha */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Glory of Rudraksha</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Rudraksha is considered dear to Lord Shiva. It not only provides spiritual power 
              but is also extremely beneficial for physical and mental health.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-orange-500">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧘</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Spiritual Benefits</h3>
                <p className="text-gray-600">Concentration in meditation, spiritual power, and peace of mind</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-red-500">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Health Benefits</h3>
                <p className="text-gray-600">Blood pressure control, heart health, and stress reduction</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-purple-500">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Protection</h3>
                <p className="text-gray-600">Protection from negative energy and positive environment</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

       {/* Rudraksha Grid */}
       <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Available Rudraksha</h2>
            {loading ? (
              <p className="text-gray-600">Loading rudrakshas...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <p className="text-gray-600">{filteredRudraksha.length} rudraksha found</p>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading rudrakshas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2 text-red-600">Failed to Load Rudrakshas</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={fetchRudrakshas}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
                             {filteredRudraksha.map((rudraksha) => (
                 <Card key={rudraksha.id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50">
                  {rudraksha.rare && (
                    <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                      ✨ Rare
                    </Badge>
                  )}
                  {rudraksha.certified && (
                    <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                      ✓ Certified
                    </Badge>
                  )}
                  
                  <div className="relative">
                    <img 
                      src={getImageUrl(rudraksha)} 
                      alt={rudraksha.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Hide image and show fallback icon
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('opacity-0', 'pointer-events-none');
                        target.nextElementSibling?.classList.add('opacity-100');
                      }}
                    />
                    {/* Fallback icon when image fails to load */}
                    <div className="w-full h-56 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center opacity-0 pointer-events-none">
                      <Circle className="w-16 h-16 text-orange-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-2 p-4">
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {rudraksha.name.split(' ')[0]} {rudraksha.name.split(' ')[1]}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl text-gray-800 mb-1">{rudraksha.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{rudraksha.englishName}</p>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{rudraksha.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-lg text-center">
                        <div className="text-xs text-gray-600">Deity</div>
                        <div className="font-semibold text-sm">{rudraksha.deity}</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-2 rounded-lg text-center">
                        <div className="text-xs text-gray-600">Planet</div>
                        <div className="font-semibold text-sm">{rudraksha.planet}</div>
                      </div>
                    </div>
                    
                    {((rudraksha as any).rating || (rudraksha as any).reviews) && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor((rudraksha as any).rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({(rudraksha as any).reviews || 100}+)</span>
                      </div>
                    )}

                    {/* Pricing Section */}
                    <div className="mb-4">
                      {rudraksha.worshipOptions ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Worship Options Available:</div>
                          <div className="text-2xl font-bold text-orange-600">
                            Starting from ₹{Math.min(...rudraksha.worshipOptions.map(o => o.price)).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">4 worship options available</div>
                        </div>
                      ) : rudraksha.sizeOptions ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Size Options Available:</div>
                          <div className="text-2xl font-bold text-orange-600">
                            ₹{Math.min(...rudraksha.sizeOptions.map(o => o.price)).toLocaleString()} - ₹{Math.max(...rudraksha.sizeOptions.map(o => o.price)).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">{rudraksha.sizeOptions.length} sizes available</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-orange-600">₹{((rudraksha as any).price || 0).toLocaleString()}</span>
                          {(rudraksha as any).originalPrice && (rudraksha as any).originalPrice > (rudraksha as any).price && (
                            <span className="text-sm text-gray-500 line-through">₹{((rudraksha as any).originalPrice).toLocaleString()}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Size and Origin Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      {rudraksha.size && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium">{rudraksha.size}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Origin:</span>
                        <span className="font-medium">{rudraksha.origin}</span>
                      </div>
                      {rudraksha.iglCertified && (
                        <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded text-center font-medium">
                          IGL Laboratory Certified
                        </div>
                      )}
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {rudraksha.benefits.slice(0, 4).map((benefit, index) => (
                        <div key={index} className="text-xs bg-gradient-to-r from-orange-50 to-red-50 text-orange-800 px-3 py-2 rounded-lg text-center font-medium border border-orange-200">
                          {benefit}
                        </div>
                      ))}
                    </div>

                    {/* Worship Options or Size Options */}
                    {rudraksha.worshipOptions ? (
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">🌺 Worship & Blessing Options 🌺</h3>
                          <p className="text-sm text-gray-600">Choose the level of spiritual preparation</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rudraksha.worshipOptions.map((option, index) => (
                            <Card key={option.id} className={`relative overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg h-full ${option.premium ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 hover:border-orange-400'}`}>
                              {option.premium && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-bl-lg text-xs font-semibold">
                                  ✨ Premium
                                </div>
                              )}
                              <CardContent className="p-4 h-full flex flex-col">
                                <div className="text-center mb-3">
                                  <div className="text-2xl mb-2">
                                    {index === 0 ? '🙏' : index === 1 ? '📿' : index === 2 ? '🔥' : '👑'}
                                  </div>
                                  <h4 className="font-bold text-md text-gray-800 mb-1">{option.name}</h4>
                                  <p className="text-xs text-gray-600 mb-2">{option.description}</p>
                                  <div className="text-xl font-bold text-orange-600 mb-2">
                                    ₹{option.price.toLocaleString()}
                                  </div>
                                  {option.silverCap && (
                                    <Badge className="bg-gray-100 text-gray-700 text-xs">Silver Cap Included</Badge>
                                  )}
                                </div>
                                <div className="space-y-1 mb-3 flex-grow">
                                  <div className="font-medium text-xs text-gray-700">Includes:</div>
                                  {option.features.slice(0, 2).map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-xs text-gray-600">
                                      <span className="text-green-500 mr-1">✓</span>
                                      {feature}
                                    </div>
                                  ))}
                                  {option.features.length > 2 && (
                                    <div className="text-xs text-gray-500">+ {option.features.length - 2} more features</div>
                                  )}
                                </div>
                                <div className="mt-auto">
                                  <Button 
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm py-2"
                                    onClick={() => handleSelectOption(rudraksha, option, 'worship')}
                                  >
                                    <ShoppingCart className="w-3 h-3 mr-1" />
                                    Select Option
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : rudraksha.sizeOptions ? (
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">📏 Size Options Available</h3>
                          <p className="text-sm text-gray-600">All sizes come with complete worship and IGL certification</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {rudraksha.sizeOptions.map((option, index) => (
                            <Card key={index} className="border-2 border-gray-200 hover:border-orange-400 transition-all cursor-pointer hover:shadow-lg h-full">
                              <CardContent className="p-3 text-center h-full flex flex-col">
                                <div className="text-xl mb-2">📐</div>
                                <div className="font-bold text-sm text-gray-800 mb-1">{option.size}</div>
                                <div className="text-lg font-bold text-orange-600 mb-3 flex-grow">
                                  ₹{option.price.toLocaleString()}
                                </div>
                                <div className="mt-auto">
                                  <Button 
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xs py-1"
                                    onClick={() => handleSelectOption(rudraksha, option, 'size')}
                                  >
                                    Select Size
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      ) : (
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 shadow-lg"
                          disabled={!(rudraksha as any).inStock}
                          onClick={() => {
                            if ((rudraksha as any).inStock) {
                              setSelectedProduct({
                                ...(rudraksha as any),
                                selectedOption: { price: (rudraksha as any).price || 0 },
                                optionType: 'direct'
                              })
                              setShowCheckoutForm(true)
                            }
                          }}
                        >
                          {!(rudraksha as any).inStock ? (
                            "Out of Stock"
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Buy Now
                            </>
                          )}
                        </Button>
                      )}
                    
                    {/* Special Features for Premium Items */}
                    {(rudraksha.worshipIncluded?.features || rudraksha.specialFeatures) && (
                      <div className="mt-4">
                        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-200">
                          <div className="font-bold text-sm mb-2">✨ Premium Features Included:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(rudraksha.worshipIncluded?.features || rudraksha.specialFeatures)?.map((feature: string, index: number) => (
                              <div key={index} className="flex items-center text-xs">
                                <span className="text-blue-500 mr-1">•</span>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredRudraksha.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No rudraksha found.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedMukhi("all")
                  setPriceRange("all")
                  setSearchTerm("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Individual Rudraksha Boxes */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Complete Rudraksha Collection
            </h2>
            <p className="text-lg text-gray-600">1 Mukhi to 14 Mukhi - Detailed Information</p>
          </div>

          {/* 1 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-orange-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🕉️</span>
                  1 Mukhi Rudraksha - Complete Information
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">🕉️ Primary Details</h4>
                    <p className="text-gray-700 text-sm">• Deity: Lord Shiva - Supreme Brahman</p>
                    <p className="text-gray-700 text-sm">• Mukhi: Only one natural face</p>
                    <p className="text-gray-700 text-sm">• Most rare and sacred</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">✨ Spiritual Benefits</h4>
                    <p className="text-gray-700 text-sm">• Self-knowledge and spiritual awakening</p>
                    <p className="text-gray-700 text-sm">• Removes ego and promotes meditation</p>
                    <p className="text-gray-700 text-sm">• Mental balance and concentration</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">🏥 Health Benefits</h4>
                    <p className="text-gray-700 text-sm">• Relief from stress, anxiety, depression</p>
                    <p className="text-gray-700 text-sm">• Blood pressure and heart health</p>
                    <p className="text-gray-700 text-sm">• Good sleep and overall wellness</p>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">💼 Business & Leadership</h4>
                    <p className="text-gray-700 text-sm">• Removes business obstacles</p>
                    <p className="text-gray-700 text-sm">• Enhances decision-making ability</p>
                    <p className="text-gray-700 text-sm">• Promotes leadership qualities</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">🌟 Planetary Effects</h4>
                    <p className="text-gray-700 text-sm">• Connected to Sun planet</p>
                    <p className="text-gray-700 text-sm">• Activates crown and third eye chakras</p>
                    <p className="text-gray-700 text-sm">• Increases awareness and insight</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-pink-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">💑</span>
                  2 Mukhi Rudraksha - Complete Details
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h4 className="font-bold text-pink-800 mb-3">💑 Form and Symbol</h4>
                    <p className="text-gray-700 text-sm">• Symbol of Lord Shiva and Mother Parvati</p>
                    <p className="text-gray-700 text-sm">• Symbol of unity, love and balance</p>
                    <p className="text-gray-700 text-sm">• Represents Ardhanarishwar form</p>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">🙏 Religious Importance</h4>
                    <p className="text-gray-700 text-sm">• Happiness and harmony in married life</p>
                    <p className="text-gray-700 text-sm">• Blessing of Lord Ardhanarishwar</p>
                    <p className="text-gray-700 text-sm">• Removes marriage delay and family disputes</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">🌙 Planetary Effects</h4>
                    <p className="text-gray-700 text-sm">• Mainly controls Moon planet</p>
                    <p className="text-gray-700 text-sm">• Beneficial in Chandra dosha</p>
                    <p className="text-gray-700 text-sm">• Mental instability relief</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-red-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-red-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🔥</span>
                  3 Mukhi Rudraksha - Agni Dev Form
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">🕉️ Form and Symbol</h4>
                    <p className="text-gray-700 text-sm">• Form of Lord Agni Dev</p>
                    <p className="text-gray-700 text-sm">• Sin destroyer and energy provider</p>
                    <p className="text-gray-700 text-sm">• Gives power for new beginnings</p>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">🪐 Planetary Effects</h4>
                    <p className="text-gray-700 text-sm">• Controls Mars planet</p>
                    <p className="text-gray-700 text-sm">• Removes Mangal dosha</p>
                    <p className="text-gray-700 text-sm">• Beneficial in anger and blood diseases</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">💼 Business Benefits</h4>
                    <p className="text-gray-700 text-sm">• Auspicious for starting new business</p>
                    <p className="text-gray-700 text-sm">• Converts failures to success</p>
                    <p className="text-gray-700 text-sm">• Gives promotion and self-confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 4 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-yellow-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">📚</span>
                  4 Mukhi Rudraksha - Lord Brahma Symbol
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">🧠 Knowledge and Wisdom</h4>
                    <p className="text-gray-700 text-sm">• Symbol of Lord Brahma</p>
                    <p className="text-gray-700 text-sm">• Giver of knowledge and wisdom</p>
                    <p className="text-gray-700 text-sm">• Makes speech sweet</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">🌟 Mercury Planet Effects</h4>
                    <p className="text-gray-700 text-sm">• Mercury planet factor</p>
                    <p className="text-gray-700 text-sm">• Removes speech defects</p>
                    <p className="text-gray-700 text-sm">• Removes educational obstacles</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">🎯 Suitable for</h4>
                    <p className="text-gray-700 text-sm">• Students, teachers, researchers</p>
                    <p className="text-gray-700 text-sm">• Speakers, lawyers, businessmen</p>
                    <p className="text-gray-700 text-sm">• For increasing memory power</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 5 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-orange-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🕉️</span>
                  5 Mukhi Rudraksha - Kalagni Rudra Form
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">☮️ All Siddhi Provider</h4>
                    <p className="text-gray-700 text-sm">• Most common and available</p>
                    <p className="text-gray-700 text-sm">• Sin destroyer and moksha provider</p>
                    <p className="text-gray-700 text-sm">• Brings peace and balance</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">🪐 Jupiter Effects</h4>
                    <p className="text-gray-700 text-sm">• Jupiter planet factor</p>
                    <p className="text-gray-700 text-sm">• Increases knowledge and decision making</p>
                    <p className="text-gray-700 text-sm">• Removes spiritual confusion</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">❤️ Health Benefits</h4>
                    <p className="text-gray-700 text-sm">• Beneficial in blood pressure and heart disease</p>
                    <p className="text-gray-700 text-sm">• Reduces diabetes and stress</p>
                    <p className="text-gray-700 text-sm">• Excellent for meditation and yoga</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 6 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-pink-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">⚔️</span>
                  6 Mukhi Rudraksha - Lord Kartikeya
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h4 className="font-bold text-pink-800 mb-3">💫 Courage and Attraction</h4>
                    <p className="text-gray-700 text-sm">• Symbol of Lord Kartikeya</p>
                    <p className="text-gray-700 text-sm">• Gives courage, strength and attraction</p>
                    <p className="text-gray-700 text-sm">• Provides sweetness in speech</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">💎 Venus Planet Effects</h4>
                    <p className="text-gray-700 text-sm">• Related to Venus planet</p>
                    <p className="text-gray-700 text-sm">• Removes marriage delay</p>
                    <p className="text-gray-700 text-sm">• Increases attraction and love</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">🎭 For Artists</h4>
                    <p className="text-gray-700 text-sm">• Auspicious for singers, actors, lawyers</p>
                    <p className="text-gray-700 text-sm">• Gives attraction power in business</p>
                    <p className="text-gray-700 text-sm">• Brings popularity and respect</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 7 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-green-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">💰</span>
                  7 Mukhi Rudraksha - Mahalakshmi Form
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">💎 Wealth and Prosperity</h4>
                    <p className="text-gray-700 text-sm">• Symbol of Mother Mahalakshmi</p>
                    <p className="text-gray-700 text-sm">• Removes poverty and financial crisis</p>
                    <p className="text-gray-700 text-sm">• Blessing of Saptarishis</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">🪐 Saturn Planet Peace</h4>
                    <p className="text-gray-700 text-sm">• Related to Saturn planet</p>
                    <p className="text-gray-700 text-sm">• Removes debt and litigation</p>
                    <p className="text-gray-700 text-sm">• Reduces Sade Sati troubles</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">🏪 Business Success</h4>
                    <p className="text-gray-700 text-sm">• Brings stability in business</p>
                    <p className="text-gray-700 text-sm">• Provides continuous profit</p>
                    <p className="text-gray-700 text-sm">• Freedom from financial crisis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 8 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-red-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-red-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🐘</span>
                  8 Mukhi Rudraksha - Vighnaharta Ganesh
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">🛣️ Obstacle Removal</h4>
                    <p className="text-gray-700 text-sm">• Symbol of Lord Ganesh</p>
                    <p className="text-gray-700 text-sm">• Removes all obstacles and barriers</p>
                    <p className="text-gray-700 text-sm">• Gives success in new beginnings</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">🌑 Rahu Dosha Removal</h4>
                    <p className="text-gray-700 text-sm">• Master of Rahu planet</p>
                    <p className="text-gray-700 text-sm">• Calms Kalsarp dosha</p>
                    <p className="text-gray-700 text-sm">• Removes confusion and mental stress</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">🏢 For Startups</h4>
                    <p className="text-gray-700 text-sm">• Success in new plans</p>
                    <p className="text-gray-700 text-sm">• Auspicious for those who fail repeatedly</p>
                    <p className="text-gray-700 text-sm">• Increases leadership ability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 9 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-pink-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">⚔️</span>
                  9 Mukhi Rudraksha - Navdurga Power
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h4 className="font-bold text-pink-800 mb-3">💪 Strength & Courage</h4>
                    <p className="text-gray-700 text-sm">• Symbol of Nine Durga forms</p>
                    <p className="text-gray-700 text-sm">• Gives immense strength and courage</p>
                    <p className="text-gray-700 text-sm">• Protection from negative energies</p>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">🏥 Disease Relief</h4>
                    <p className="text-gray-700 text-sm">• Mars planet control</p>
                    <p className="text-gray-700 text-sm">• Relief from chronic diseases</p>
                    <p className="text-gray-700 text-sm">• Removes fear and mental instability</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">🛡️ Protection & Victory</h4>
                    <p className="text-gray-700 text-sm">• Victory over enemies</p>
                    <p className="text-gray-700 text-sm">• Protection in dangerous situations</p>
                    <p className="text-gray-700 text-sm">• Enhances fearlessness and confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 10 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-blue-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🌟</span>
                  10 Mukhi Rudraksha - Lord Vishnu Protection
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">🛡️ Divine Protection</h4>
                    <p className="text-gray-700 text-sm">• Lord Vishnu's divine form</p>
                    <p className="text-gray-700 text-sm">• Protection from all ten directions</p>
                    <p className="text-gray-700 text-sm">• Shields from negative energies</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">🔮 Black Magic Relief</h4>
                    <p className="text-gray-700 text-sm">• Removes black magic effects</p>
                    <p className="text-gray-700 text-sm">• Protection from evil eye</p>
                    <p className="text-gray-700 text-sm">• Eliminates fear and anxiety</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">💪 Courage & Fearlessness</h4>
                    <p className="text-gray-700 text-sm">• Provides immense courage</p>
                    <p className="text-gray-700 text-sm">• Removes all types of fears</p>
                    <p className="text-gray-700 text-sm">• Enhances mental stability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 11 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-orange-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🔱</span>
                  11 Mukhi Rudraksha - Ekadash Rudra & Hanuman
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">👑 Leadership & Victory</h4>
                    <p className="text-gray-700 text-sm">• Eleven Rudra forms combined</p>
                    <p className="text-gray-700 text-sm">• Enhances leadership qualities</p>
                    <p className="text-gray-700 text-sm">• Ensures victory in all endeavors</p>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">🐒 Hanuman's Blessing</h4>
                    <p className="text-gray-700 text-sm">• Hanuman Ji's special blessing</p>
                    <p className="text-gray-700 text-sm">• Removes fear and brings courage</p>
                    <p className="text-gray-700 text-sm">• Success in politics and administration</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">🧘 Spiritual Progress</h4>
                    <p className="text-gray-700 text-sm">• Accelerates spiritual growth</p>
                    <p className="text-gray-700 text-sm">• Provides longevity and health</p>
                    <p className="text-gray-700 text-sm">• Ideal for court cases and legal matters</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 12 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-yellow-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">☀️</span>
                  12 Mukhi Rudraksha - Surya Dev Brilliance
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">⚡ Energy & Brilliance</h4>
                    <p className="text-gray-700 text-sm">• Sun deity's divine energy</p>
                    <p className="text-gray-700 text-sm">• Enhances personal radiance</p>
                    <p className="text-gray-700 text-sm">• Provides vitality and strength</p>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">🏛️ Administrative Success</h4>
                    <p className="text-gray-700 text-sm">• Success in government jobs</p>
                    <p className="text-gray-700 text-sm">• Leadership in administration</p>
                    <p className="text-gray-700 text-sm">• Authority and respect in society</p>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">⚔️ Victory Over Enemies</h4>
                    <p className="text-gray-700 text-sm">• Defeats all enemies</p>
                    <p className="text-gray-700 text-sm">• Protection from conspiracies</p>
                    <p className="text-gray-700 text-sm">• Enhances confidence and courage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 13 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-purple-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">💘</span>
                  13 Mukhi Rudraksha - Kamdev & Shiva Union
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">✨ Attraction Power</h4>
                    <p className="text-gray-700 text-sm">• Combined power of Kamdev and Shiva</p>
                    <p className="text-gray-700 text-sm">• Enhances personal magnetism</p>
                    <p className="text-gray-700 text-sm">• Attracts success and prosperity</p>
                  </div>
                  
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h4 className="font-bold text-pink-800 mb-3">🌹 Beauty & Prosperity</h4>
                    <p className="text-gray-700 text-sm">• Enhances physical beauty</p>
                    <p className="text-gray-700 text-sm">• Brings material prosperity</p>
                    <p className="text-gray-700 text-sm">• Success in arts and creativity</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">🎭 Material Success</h4>
                    <p className="text-gray-700 text-sm">• Success in business and politics</p>
                    <p className="text-gray-700 text-sm">• Beneficial for media and film industry</p>
                    <p className="text-gray-700 text-sm">• Enhances public relations skills</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 14 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-indigo-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">👁️</span>
                  14 Mukhi Rudraksha - Mahadev's Third Eye
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h4 className="font-bold text-indigo-800 mb-3">🔮 Divine Vision</h4>
                    <p className="text-gray-700 text-sm">• Mahadev's third eye power</p>
                    <p className="text-gray-700 text-sm">• Enhances intuition and foresight</p>
                    <p className="text-gray-700 text-sm">• Provides divine knowledge and wisdom</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">👑 Royal Yoga & Leadership</h4>
                    <p className="text-gray-700 text-sm">• Creates Raja Yoga in horoscope</p>
                    <p className="text-gray-700 text-sm">• Exceptional leadership qualities</p>
                    <p className="text-gray-700 text-sm">• Success in politics and high positions</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">💎 Devmani Status</h4>
                    <p className="text-gray-700 text-sm">• Called "Devmani" in scriptures</p>
                    <p className="text-gray-700 text-sm">• Extremely rare and powerful</p>
                    <p className="text-gray-700 text-sm">• Provides spiritual and material success</p>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-l-4 border-indigo-400">
                  <h4 className="font-bold text-indigo-800 mb-3">🌟 Special Features of 14 Mukhi</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-700">
                    <div>• Seven Brahmins perform grand ritual</div>
                    <div>• Mahamrityunjaya mantra recitation</div>
                    <div>• Rudrashtadhyayi sacred verses</div>
                    <div>• Highest spiritual significance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      {/* <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">🔍 Find Your Perfect Rudraksha</h2>
              <p className="text-gray-600">Filter by Mukhi type, price range, and more</p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-orange-600" />
                  Search Rudraksha
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by name, deity, planet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Circle className="w-4 h-4 mr-2 text-orange-600" />
                  Mukhi Type
                </label>
                <Select value={selectedMukhi} onValueChange={setSelectedMukhi}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder="Select Mukhi" />
                  </SelectTrigger>
                  <SelectContent>
                    {rudrakshaTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  💰 Price Range
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder="Select Price" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.id} value={range.id}>
                        {range.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  📊 Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
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
            
            {/* Quick Filter Tags 
            <div className="flex flex-wrap justify-center gap-3">
              <div className="text-sm text-gray-600 mr-4">Quick Filters:</div>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors">
                ✨ Most Popular
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors">
                🏆 IGL Certified
              </button>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors">
                👑 Premium Collection
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
                💎 Rare Finds
              </button>
          </div>
        </div>
          </div>
      </section> */}

     

      {/* Consultation CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose the Right Rudraksha for You
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get advice on the most suitable rudraksha according to your birth horoscope
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
              Consult Astrologer
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
                    <span>Deity:</span>
                    <span className="font-medium">{selectedProduct.deity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planet:</span>
                    <span className="font-medium">{selectedProduct.planet}</span>
                  </div>
                  {selectedProduct.selectedOption && (
                    <>
                      {selectedProduct.optionType !== 'direct' && (
                        <div className="flex justify-between">
                          <span>{selectedProduct.optionType === 'worship' ? 'Worship Option:' : 'Size:'}</span>
                          <span className="font-medium">
                            {selectedProduct.optionType === 'worship' 
                              ? selectedProduct.selectedOption.name 
                              : selectedProduct.selectedOption.size}
                          </span>
            </div>
          )}
                      <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t">
                        <span>Total Amount:</span>
                        <span>₹{selectedProduct.selectedOption.price.toLocaleString()}</span>
        </div>
                    </>
                  )}
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
                  
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div> */}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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

                <div className="grid md:grid-cols-3 gap-4">
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
                    📝 Special Instructions (Optional)
                  </label>
                  <Textarea
                    value={checkoutData.specialInstructions}
                    onChange={(e: any) => setCheckoutData({...checkoutData, specialInstructions: e.target.value})}
                    placeholder="Any special delivery instructions or requests for the worship ceremony"
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
                    <p>• Certificate of authenticity included</p>
                    <p>• Video of worship ceremony will be shared on WhatsApp</p>
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
