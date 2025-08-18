import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Edit3, Camera } from 'lucide-react';

interface ProfileEditProps {
  userInfo: {
    encrypted_yw_id: string;
    display_name?: string;
    photo_url?: string;
  } | null;
}

interface UserProfile {
  bio: string;
  valuesProfile: string;
  interests: string;
  personalityType: string;
  agentPreferences: string;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ userInfo }) => {
  const [profile, setProfile] = useState<UserProfile>({
    bio: '',
    valuesProfile: '',
    interests: '',
    personalityType: '',
    agentPreferences: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, [userInfo]);

  const loadUserProfile = async () => {
    if (!userInfo?.encrypted_yw_id) return;
    
    setIsLoading(true);
    try {
      console.log('📄 Loading user profile...');
      const response = await fetch('https://backend.youware.com/api/get-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          setProfile({
            bio: data.profile.bio || '',
            valuesProfile: data.profile.values_profile || '',
            interests: data.profile.interests || '',
            personalityType: data.profile.personality_type || '',
            agentPreferences: data.profile.agent_preferences || ''
          });
        }
        console.log('✅ Profile loaded successfully');
      }
    } catch (error) {
      console.error('❌ Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userInfo?.encrypted_yw_id) return;
    
    setIsSaving(true);
    try {
      console.log('💾 Saving user profile...');
      const response = await fetch('https://backend.youware.com/api/save-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        setSuccessMessage('个人档案保存成功！');
        setTimeout(() => setSuccessMessage(''), 3000);
        console.log('✅ Profile saved successfully');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('❌ Failed to save profile:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载个人档案...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">个人档案</h1>
                <p className="text-gray-600">完善您的个人信息，让AI更好地了解您</p>
              </div>
            </div>
            
            {successMessage && (
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <div className="text-center">
                <div className="relative inline-block">
                  {userInfo?.photo_url ? (
                    <img 
                      src={userInfo.photo_url} 
                      alt={userInfo.display_name || 'User'} 
                      className="h-24 w-24 rounded-full mx-auto"
                    />
                  ) : (
                    <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                      {userInfo?.display_name?.[0] || 'U'}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-4">
                  {userInfo?.display_name || '用户'}
                </h3>
                <p className="text-gray-600 text-sm mt-1">Echo 社区成员</p>
                
                {profile.bio && (
                  <p className="text-gray-700 text-sm mt-3 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* 基础信息 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <Edit3 className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">基础信息</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      个人简介
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="介绍一下您自己，让大家更好地了解您..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* 价值观档案 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">价值观档案</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      核心价值观
                    </label>
                    <textarea
                      value={profile.valuesProfile}
                      onChange={(e) => handleInputChange('valuesProfile', e.target.value)}
                      placeholder="描述您的核心价值观和人生理念..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      兴趣爱好
                    </label>
                    <textarea
                      value={profile.interests}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      placeholder="分享您的兴趣爱好和喜欢的活动..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* 性格特征 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">性格特征</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      性格类型
                    </label>
                    <textarea
                      value={profile.personalityType}
                      onChange={(e) => handleInputChange('personalityType', e.target.value)}
                      placeholder="描述您的性格特点和行为风格..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Agent偏好 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Agent偏好</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      交流偏好
                    </label>
                    <textarea
                      value={profile.agentPreferences}
                      onChange={(e) => handleInputChange('agentPreferences', e.target.value)}
                      placeholder="描述您希望AI Agent如何与您交流..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* 保存按钮 */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  <span>{isSaving ? '保存中...' : '保存档案'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;