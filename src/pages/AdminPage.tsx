import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, BarChart2, Settings, 
  PlusCircle, Edit, Trash2, Search
} from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('lessons');
  
  // Placeholder data - in a real app, this would come from an API call
  const users = [
    { id: 1, name: 'John Smith', email: 'john@example.com', plan: 'premium', joinDate: '2023-10-15' },
    { id: 2, name: 'Maria Garcia', email: 'maria@example.com', plan: 'basic', joinDate: '2023-11-02' },
    { id: 3, name: 'David Lee', email: 'david@example.com', plan: 'free', joinDate: '2023-12-18' },
  ];
  
  const lessons = [
    { id: 1, title: 'Basic Pronouns', unitId: 1, type: 'vocabulary', status: 'published' },
    { id: 2, title: 'Simple Greetings', unitId: 1, type: 'conversation', status: 'published' },
    { id: 3, title: 'Family Terms', unitId: 2, type: 'vocabulary', status: 'draft' },
  ];
  
  const tabs = [
    { id: 'lessons', label: 'Lessons', icon: <BookOpen size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lessons':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Manage Lessons</h2>
              <button className="btn-primary flex items-center gap-2">
                <PlusCircle size={16} />
                <span>Add New Lesson</span>
              </button>
            </div>
            
            <div className="flex mb-4">
              <div className="relative flex-1 mr-4">
                <input 
                  type="text" 
                  placeholder="Search lessons..." 
                  className="input pl-10"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <select className="input max-w-xs">
                <option value="">All Units</option>
                <option value="1">Unit 1: Basics</option>
                <option value="2">Unit 2: Greetings</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Unit</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lessons.map(lesson => (
                    <tr key={lesson.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{lesson.id}</td>
                      <td className="py-3 px-4 font-medium">{lesson.title}</td>
                      <td className="py-3 px-4">Unit {lesson.unitId}</td>
                      <td className="py-3 px-4">
                        <span className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded capitalize">
                          {lesson.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                          lesson.status === 'published' 
                            ? 'bg-success-50 text-success-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {lesson.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded mr-1">
                          <Edit size={18} />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:text-error-600 hover:bg-gray-100 rounded">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">User Management</h2>
            </div>
            
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="input pl-10"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Plan</th>
                    <th className="py-3 px-4 text-left">Join Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{user.id}</td>
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                          user.plan === 'premium' 
                            ? 'bg-accent-peach text-gray-800'
                            : user.plan === 'basic' 
                            ? 'bg-primary-50 text-primary-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded mr-1">
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'analytics':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Analytics & Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <h3 className="text-lg font-medium mb-2">Active Users</h3>
                <p className="text-3xl font-bold text-primary-600">157</p>
                <p className="text-sm text-success-600 flex items-center gap-1 mt-2">
                  <span>↑ 12%</span>
                  <span>vs last month</span>
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-medium mb-2">Premium Subscriptions</h3>
                <p className="text-3xl font-bold text-primary-600">64</p>
                <p className="text-sm text-success-600 flex items-center gap-1 mt-2">
                  <span>↑ 8%</span>
                  <span>vs last month</span>
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-medium mb-2">Lesson Completions</h3>
                <p className="text-3xl font-bold text-primary-600">892</p>
                <p className="text-sm text-success-600 flex items-center gap-1 mt-2">
                  <span>↑ 15%</span>
                  <span>vs last month</span>
                </p>
              </div>
            </div>
            
            <div className="card p-6 mb-8">
              <h3 className="text-lg font-medium mb-4">User Activity</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Activity chart placeholder</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-medium mb-4">Popular Lessons</h3>
                <div className="space-y-4">
                  {[
                    { id: 1, title: 'Basic Pronouns', completions: 124 },
                    { id: 2, title: 'Simple Greetings', completions: 98 },
                    { id: 3, title: 'Question Words', completions: 86 },
                  ].map(lesson => (
                    <div key={lesson.id} className="flex justify-between items-center">
                      <span>{lesson.title}</span>
                      <span className="font-semibold">{lesson.completions} completions</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-medium mb-4">Subscription Breakdown</h3>
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart placeholder</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Admin Settings</h2>
            
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Application Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Name
                  </label>
                  <input type="text" className="input" defaultValue="Tagalog Learn" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Support Email
                  </label>
                  <input type="email" className="input" defaultValue="support@tagaloglearn.com" />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="enableRegistration"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="enableRegistration" className="ml-2 block text-sm text-gray-700">
                    Enable new user registrations
                  </label>
                </div>
              </div>
            </div>
            
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="notifyNewUsers"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="notifyNewUsers" className="ml-2 block text-sm text-gray-700">
                    Notify admins of new user registrations
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="weeklyReport"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="weeklyReport" className="ml-2 block text-sm text-gray-700">
                    Send weekly activity reports
                  </label>
                </div>
              </div>
            </div>
            
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-medium mb-4 text-error-600">Danger Zone</h3>
              
              <div className="space-y-4">
                <button className="btn bg-error-50 text-error-700 hover:bg-error-100">
                  Purge Inactive Users (90+ days)
                </button>
                
                <button className="btn bg-error-50 text-error-700 hover:bg-error-100">
                  Reset Application Cache
                </button>
              </div>
            </div>
            
            <button className="btn-primary mb-6">
              Save Settings
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage content, users, and settings for your Tagalog learning platform
        </p>
      </div>

      <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default AdminPage;