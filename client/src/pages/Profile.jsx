import React, { useState } from 'react';
import { Camera, Edit, Save, Mail, MapPin, Calendar } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: 'Agra, India',
    school: 'Green Valley School',
    grade: '10th',
    bio: 'Passionate about environmental conservation and sustainability.'
  });

  const handleSave = () => {
    setIsEditing(false);
    // API call would go here
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-green-400 to-emerald-500 relative">
            <button className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-lg transition-colors">
              <Camera className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=Aarav+Patel&background=16a34a&color=fff'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 p-2 rounded-full text-white transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 text-lg font-medium">{formData.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-800">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{formData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-800">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{formData.location}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => setFormData({...formData, school: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.school}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.grade}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">{formData.bio}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{user?.ecoPoints || 1240}</p>
                <p className="text-gray-600 text-sm mt-1">Eco-Points</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-gray-600 text-sm mt-1">Badges</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">7</p>
                <p className="text-gray-600 text-sm mt-1">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;