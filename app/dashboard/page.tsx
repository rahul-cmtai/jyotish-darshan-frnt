"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Award, 
  TrendingUp,
  BarChart3,
  Activity,
  Globe,
  Mail,
  BookOpen,
  Flame,
  Gem,
  CircleDot,
  Brain,
  Star,
  Calendar,
  MessageSquare,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Jyotish Lok Dashboard
      </h1>
      
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 rounded-lg p-6 text-white mb-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
        <p className="text-lg opacity-90">
          Welcome! Have a blessed day
        </p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Services</h3>
              <p className="text-3xl font-bold text-blue-600">60</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gallery Items</h3>
              <p className="text-3xl font-bold text-green-600">247</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Leads</h3>
              <p className="text-3xl font-bold text-orange-600">156</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Posts</h3>
              <p className="text-3xl font-bold text-purple-600">89</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Books</p>
              <p className="text-sm text-gray-600">12 items</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-orange-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Pujas</p>
              <p className="text-sm text-gray-600">8 items</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ratna</p>
              <p className="text-sm text-gray-600">15 items</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <CircleDot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Rudraksha</p>
              <p className="text-sm text-gray-600">10 items</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Sadhana</p>
              <p className="text-sm text-gray-600">6 items</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Yantra</p>
              <p className="text-sm text-gray-600">9 items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/services" className="block">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors">
              <div className="text-lg font-semibold">Manage Services</div>
            </button>
          </Link>
          
          <Link href="/dashboard/gallery" className="block">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors">
              <div className="text-lg font-semibold">Gallery</div>
            </button>
          </Link>
          
          <Link href="/dashboard/leads" className="block">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center transition-colors">
              <div className="text-lg font-semibold">Contact Leads</div>
            </button>
          </Link>
          
          <Link href="/dashboard/blog" className="block">
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition-colors">
              <div className="text-lg font-semibold">Blog Posts</div>
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New blog post published</p>
              <p className="text-xs text-gray-600">"Planetary Influence on Life" - 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <MessageSquare className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New contact lead received</p>
              <p className="text-xs text-gray-600">Service inquiry from Rajesh Kumar - 4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <ImageIcon className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Gallery updated</p>
              <p className="text-xs text-gray-600">5 new photos added to Puja category - 6 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <Settings className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Service updated</p>
              <p className="text-xs text-gray-600">Rudraksha pricing updated - 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  