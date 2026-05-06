import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Edit, Image, Mail, MapPin, Save, Trash2, X } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getAvatarFallbackUrl, getAvatarUrl } from '../utils/avatar';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [quizStats, setQuizStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());

  const getVersionedAvatarUrl = (avatarPath) => {
    return getAvatarUrl(avatarPath, avatarVersion);
  };

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || 'Agra, India',
    school: user?.school || 'Green Valley School',
    grade: user?.grade || '10th',
    team: user?.team || '',
    bio: user?.bio || 'Passionate about environmental conservation and sustainability.'
  });

  // Update formData when user data changes (but not during editing)
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || 'Agra, India',
        school: user.school || 'Green Valley School',
        grade: user.grade || '10th',
        team: user.team || '',
        bio: user.bio || 'Passionate about environmental conservation and sustainability.'
      });
    }
  }, [user, isEditing]);

  const fetchUserData = useCallback(async () => {
    try {
      // Fetch current user data
      const userResponse = await api.get('/auth/profile');
      if (updateUser) {
        updateUser(userResponse.data.user);
      }

      // Fetch quiz statistics (with error handling)
      try {
        const quizResponse = await api.get('/quizzes/user/stats');
        setQuizStats(quizResponse.data);
      } catch (quizError) {
        console.warn('Quiz stats not available:', quizError.message);
        // Set default stats if quiz stats fail
        setQuizStats({
          success: true,
          stats: {
            totalQuizzes: 0,
            totalScore: 0,
            totalPoints: 0,
            averageScore: 0,
            totalEcoPoints: 0,
            lastQuizDate: null
          }
        });
      }

      // Fetch user badges (with error handling)
      try {
        const badgesResponse = await api.get('/users/badges');
        setBadges(badgesResponse.data || []);
      } catch (badgesError) {
        console.warn('Badges not available:', badgesError.message);
        setBadges([]);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const interval = setInterval(fetchUserData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchUserData]);

  const handleSave = async () => {
    try {
      // Only send editable fields (excluding email)
      const updateData = {
        name: formData.name,
        location: formData.location,
        school: formData.school,
        grade: formData.grade,
        team: formData.team,
        bio: formData.bio
      };

      const response = await api.put('/auth/profile', updateData);

      if (response.data.success) {
        // Update user context with new data
        if (updateUser) {
          updateUser(response.data.user);
        }
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Error updating profile. Please try again.';
      alert(errorMessage);
    }
  };

  const handleImageClick = () => {
    setShowImageOptions(true);
  };

  const handleFileSelect = (source) => {
    if (source === 'camera') {
      fileInputRef.current.setAttribute('capture', 'environment');
    } else {
      fileInputRef.current.removeAttribute('capture');
    }
    fileInputRef.current.click();
    setShowImageOptions(false);
  };

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const waitForImageLoad = (imageUrl) => new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(imageUrl);
    image.onerror = reject;
    image.src = imageUrl;
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setUploadingImage(true);

      try {
        const localPreviewUrl = await readFileAsDataUrl(file);
        setPreviewImage(localPreviewUrl);

        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/auth/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          const nextAvatarVersion = Date.now();
          const fullAvatarUrl = `${getAvatarUrl(response.data.avatarUrl)}?v=${nextAvatarVersion}`;
          setAvatarVersion(nextAvatarVersion);
          setFormData(prev => ({ ...prev, avatar: response.data.avatarUrl }));

          // Update user context immediately
          if (updateUser) {
            updateUser(response.data.user || { ...user, avatar: response.data.avatarUrl });
          }

          waitForImageLoad(fullAvatarUrl)
            .then((loadedAvatarUrl) => setPreviewImage(loadedAvatarUrl))
            .catch(() => setPreviewImage(localPreviewUrl));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
      } finally {
        setUploadingImage(false);
        e.target.value = '';
      }
    }
  };

  const handleRemoveProfilePhoto = async () => {
    try {
      setUploadingImage(true);
      const response = await api.delete('/auth/avatar');

      if (response.data.success) {
        setPreviewImage(null);
        setAvatarVersion(Date.now());
        setShowImageOptions(false);
        setFormData(prev => ({ ...prev, avatar: '' }));

        if (updateUser) {
          updateUser(response.data.user || { ...user, avatar: '' });
        }
      }
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Error removing image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-green-400 to-emerald-500 relative"></div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="relative">
                <img
                  src={
                    previewImage ||
                    getVersionedAvatarUrl(user?.avatar) ||
                    getAvatarFallbackUrl(user?.name || '')
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = getAvatarFallbackUrl(user?.name || '');
                  }}
                  onLoad={(e) => {
                  }}
                />
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-0 left-0 bg-green-600 hover:bg-green-700 p-2 rounded-full text-white transition-colors disabled:opacity-50"
                  disabled={uploadingImage}
                  aria-label="Change profile photo"
                >
                  {uploadingImage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
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
                  <div className="flex items-center gap-2 text-gray-800">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{formData.email}</span>
                  </div>
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-2">Email address cannot be edited.</p>
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

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.team}
                      onChange={(e) => setFormData({...formData, team: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.team || 'Not set'}</p>
                  )}
                </div> */}
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
                <p className="text-3xl font-bold text-green-600">
                  {loading ? '...' : (user?.ecoPoints || 0)}
                </p>
                <p className="text-gray-600 text-sm mt-1">Eco-Points</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {loading ? '...' : (badges.length || 1)}
                </p>
                <p className="text-gray-600 text-sm mt-1">Badges</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {loading ? '...' : (quizStats?.totalQuizzes || 0)}
                </p>
                <p className="text-gray-600 text-sm mt-1">Quizzes Done</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Image Options Modal */}
      {showImageOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Select Image Source</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleFileSelect('camera')}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </button>
              <button
                onClick={() => handleFileSelect('gallery')}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Image className="w-5 h-5" />
                <span>Choose from Gallery</span>
              </button>
              {(user?.avatar || previewImage) && (
                <button
                  onClick={handleRemoveProfilePhoto}
                  disabled={uploadingImage}
                  className="w-full flex items-center gap-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Remove Profile Photo</span>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowImageOptions(false)}
              className="mt-4 w-full p-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
