import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Users, Sparkles, Phone } from 'lucide-react';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

interface FindMatchesProps {
  userInfo: {
    encrypted_yw_id: string;
    display_name?: string;
    photo_url?: string;
  } | null;
}

interface MatchUser {
  id: string;
  display_name: string;
  photo_url?: string;
  bio: string;
  matchScore: number;
  matchReason: string;
  interests: string[];
  agentPersonality: string;
}

const FindMatches: React.FC<FindMatchesProps> = ({ userInfo }) => {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchUser | null>(null);
  const [isAgentChatting, setIsAgentChatting] = useState(false);
  const [agentConversation, setAgentConversation] = useState<string[]>([]);

  useEffect(() => {
    // 加载现有匹配或自动搜索
    loadMatches();
  }, [userInfo]);

  const loadMatches = async () => {
    try {
      console.log('🔍 Loading existing matches...');
      const response = await fetch('https://backend.youware.com/api/get-matches', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.matches) {
          setMatches(data.matches);
        } else {
          // 如果没有现有匹配，自动搜索
          await findNewMatches();
        }
      } else {
        // 如果API调用失败，使用模拟数据
        setMatches(getMockMatches());
      }
    } catch (error) {
      console.error('❌ Failed to load matches:', error);
      // 使用模拟数据作为备选
      setMatches(getMockMatches());
    }
  };

  const findNewMatches = async () => {
    setIsSearching(true);
    try {
      console.log('🎯 Finding new matches...');
      
      const openai = createOpenAI({
        baseURL: 'https://api.youware.com/public/v1/ai',
        apiKey: 'sk-YOUWARE'
      });

      const config = globalThis.ywConfig?.ai_config?.matching_engine;
      if (!config) {
        throw new Error('匹配引擎配置未找到');
      }

      const prompt = `为用户寻找3-5个潜在的匹配对象。请基于以下信息生成匹配建议：
      
      用户：${userInfo?.display_name || '当前用户'}
      
      请生成包含以下字段的JSON格式匹配列表：
      {
        "matches": [
          {
            "id": "unique_id",
            "display_name": "姓名",
            "bio": "个人简介",
            "matchScore": 85,
            "matchReason": "匹配原因",
            "interests": ["兴趣1", "兴趣2"],
            "agentPersonality": "Agent性格描述"
          }
        ]
      }`;

      const systemPrompt = config.system_prompt({
        matchingCriteria: '价值观相似度、兴趣匹配度、性格互补性',
        userProfile: userInfo?.display_name || '新用户'
      });

      const { text } = await generateText({
        model: openai(config.model),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: config.temperature || 0.6,
        maxTokens: config.maxTokens || 3000
      });

      console.log('✅ Generated matches response:', text);

      // 解析AI生成的匹配结果
      let matchData;
      try {
        matchData = JSON.parse(text);
      } catch (e) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          matchData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析匹配结果');
        }
      }

      if (matchData.matches && Array.isArray(matchData.matches)) {
        setMatches(matchData.matches);
        // 保存匹配结果到后端
        await saveMatches(matchData.matches);
      } else {
        throw new Error('匹配结果格式不正确');
      }

    } catch (error) {
      console.error('❌ Failed to find matches:', error);
      // 使用模拟数据作为备选
      setMatches(getMockMatches());
    } finally {
      setIsSearching(false);
    }
  };

  const getMockMatches = (): MatchUser[] => {
    return [
      {
        id: '1',
        display_name: '李思思',
        bio: '热爱读书和旅行的设计师，相信美好的事物能改变世界',
        matchScore: 92,
        matchReason: '你们都重视创造力和美学，在价值观上高度契合',
        interests: ['设计', '阅读', '旅行', '摄影'],
        agentPersonality: '温和理性，善于倾听和提供建设性建议'
      },
      {
        id: '2',
        display_name: '王志远',
        bio: '科技创业者，致力于用技术解决社会问题',
        matchScore: 88,
        matchReason: '你们都关注社会影响力，有着相似的价值追求',
        interests: ['科技', '创业', '社会公益', '登山'],
        agentPersonality: '逻辑思维强，乐于分享知识和经验'
      },
      {
        id: '3',
        display_name: '张雨晨',
        bio: '心理咨询师，喜欢探索人性的深度和复杂性',
        matchScore: 85,
        matchReason: '你们都有深刻的内省能力和对人的关怀',
        interests: ['心理学', '哲学', '音乐', '瑜伽'],
        agentPersonality: '富有同理心，善于情感支持和深度对话'
      }
    ];
  };

  const saveMatches = async (matchList: MatchUser[]) => {
    try {
      const response = await fetch('https://backend.youware.com/api/save-matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matches: matchList })
      });

      if (response.ok) {
        console.log('✅ Matches saved successfully');
      }
    } catch (error) {
      console.error('❌ Failed to save matches:', error);
    }
  };

  const handleAgentChat = async (match: MatchUser) => {
    setSelectedMatch(match);
    setIsAgentChatting(true);
    setAgentConversation([]);

    try {
      console.log('🤖 Starting agent conversation with:', match.display_name);
      
      const openai = createOpenAI({
        baseURL: 'https://api.youware.com/public/v1/ai',
        apiKey: 'sk-YOUWARE'
      });

      const config = globalThis.ywConfig?.ai_config?.agent_chat;
      if (!config) {
        throw new Error('Agent配置未找到');
      }

      const prompt = `你现在要模拟${match.display_name}的AI Agent进行对话。
      
      ${match.display_name}的信息：
      - 个人简介：${match.bio}
      - 兴趣爱好：${match.interests.join(', ')}
      - Agent性格：${match.agentPersonality}
      
      请以${match.display_name}的AI Agent身份，向${userInfo?.display_name || '用户'}打招呼，介绍一下自己并表达想要了解对方的意愿。`;

      const systemPrompt = config.system_prompt({
        userName: match.display_name,
        userType: 'Agent代表',
        context: '初次见面'
      });

      const { text } = await generateText({
        model: openai(config.model),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: config.temperature || 0.8,
        maxTokens: config.maxTokens || 4000
      });

      setAgentConversation([text]);
      console.log('✅ Agent conversation started');

    } catch (error) {
      console.error('❌ Failed to start agent conversation:', error);
      setAgentConversation(['你好！很高兴与您的Agent进行交流。让我们开始对话吧！']);
    } finally {
      setIsAgentChatting(false);
    }
  };

  const handleVoiceCall = (match: MatchUser) => {
    alert(`即将与 ${match.display_name} 的Agent进行语音通话！此功能正在开发中。`);
  };

  if (isSearching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">正在寻找匹配...</h2>
          <p className="text-gray-600">AI正在为您分析和匹配最合适的伙伴</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">发现匹配</h1>
                <p className="text-gray-600">找到与您价值观契合的伙伴</p>
              </div>
            </div>
            
            <button
              onClick={findNewMatches}
              disabled={isSearching}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>刷新匹配</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">暂无匹配结果</h2>
            <p className="text-gray-600 mb-6">完善您的个人档案以获得更好的匹配效果</p>
            <Link
              to="/profile"
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              完善档案
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Profile Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                      {match.display_name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{match.display_name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-sm font-medium text-red-600">{match.matchScore}% 匹配</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{match.bio}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-medium text-blue-600 mb-1">匹配原因</p>
                    <p className="text-sm text-gray-700">{match.matchReason}</p>
                  </div>
                </div>

                {/* Interests */}
                <div className="p-4 bg-gray-50">
                  <p className="text-xs font-medium text-gray-600 mb-2">共同兴趣</p>
                  <div className="flex flex-wrap gap-2">
                    {match.interests.slice(0, 3).map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                    {match.interests.length > 3 && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        +{match.interests.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Agent Info */}
                <div className="p-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-1">Agent特征</p>
                  <p className="text-sm text-gray-700">{match.agentPersonality}</p>
                </div>

                {/* Action Buttons */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAgentChat(match)}
                      disabled={isAgentChatting}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Agent对话
                    </button>
                    <button
                      onClick={() => handleVoiceCall(match)}
                      className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors text-sm"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      语音通话
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Agent Conversation Modal */}
        {selectedMatch && agentConversation.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {selectedMatch.display_name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedMatch.display_name} 的Agent</h3>
                      <p className="text-sm text-gray-600">正在与您对话</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {agentConversation.map((message, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link
                    to="/chat"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>继续对话</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindMatches;