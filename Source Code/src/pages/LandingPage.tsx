import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Sparkles, MessageCircle, UserCheck, Mic, Brain, Target, Zap } from 'lucide-react';

interface LandingPageProps {
  userInfo: {
    encrypted_yw_id: string;
    display_name?: string;
    photo_url?: string;
  } | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ userInfo }) => {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#F7F9FA'}}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-effect z-50 animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center animate-scale-in">
              <span className="text-xl font-medium" style={{color: '#2C3E50'}}>Echo</span>
            </div>
            <div className="flex items-center space-x-4">
              {userInfo?.display_name ? (
                <div className="flex items-center space-x-3 animate-slide-up animate-delay-200">
                  {userInfo.photo_url && (
                    <img 
                      src={userInfo.photo_url} 
                      alt={userInfo.display_name} 
                      className="h-8 w-8 rounded-full ring-2 transition-all-smooth hover:ring-opacity-70"
                      style={{ringColor: '#6EC6CA40'}}
                    />
                  )}
                  <span className="font-medium" style={{color: '#2C3E50'}}>欢迎，{userInfo.display_name}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 animate-pulse-soft">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <div className="text-sm font-medium" style={{color: '#64748b'}}>
                    {userInfo ? '已连接' : '连接中...'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced */}
      <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{backgroundColor: '#6EC6CA'}}>
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-wave-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-wave-float animate-delay-300"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full blur-2xl animate-float animate-delay-500"></div>
        </div>
        

        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-slide-up mb-12">
            <div className="inline-block mb-8 px-8 py-3 rounded-full glass-primary animate-glow-pulse">
              <p className="font-medium text-lg" style={{color: '#2C3E50'}}>Ego - Echo your ego.</p>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-white mb-8 leading-tight max-w-5xl mx-auto">
              <span className="block animate-slide-up mb-1">Echo yourself.</span>
              <span className="block animate-slide-up animate-delay-200 opacity-95 mb-1">Where values meet.</span>
              <span className="text-gradient block animate-slide-up animate-delay-400 text-2xl md:text-4xl" style={{
                background: 'linear-gradient(135deg, #4A5568 0%, #718096 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Connections that matter.</span>
            </h1>
          </div>
          
          <div className="animate-slide-up animate-delay-300 mb-12">
            <p className="text-lg max-w-4xl mx-auto leading-relaxed mb-8 font-normal" style={{color: '#ffffff'}}>
              打破传统组队交友的界限，重新发现真实的自我。Echo 不只是一款有灵魂的app，
              更是一场回归本质的变革。
            </p>
            <div className="inline-block px-6 py-3 rounded-full glass-primary border-2 border-white/20">
              <p className="font-medium text-sm" style={{color: '#2C3E50'}}>
                ——基于agent系统的自我挖掘和match（组队）系统
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up animate-delay-500">
            <Link 
              to="/tests"
              className="group px-10 py-3 rounded-full font-medium text-base transition-all-smooth transform hover:scale-110 flex items-center space-x-3 shadow-2xl animate-glow-pulse border-2 border-transparent hover:border-white/30"
              style={{
                backgroundColor: '#4A5568', 
                color: '#ffffff',
                boxShadow: '0 20px 40px rgba(74, 85, 104, 0.4), 0 10px 20px rgba(74, 85, 104, 0.3)'
              }}
            >
              <Sparkles className="h-6 w-6 animate-pulse-soft" />
              <span>开始探索</span>
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Link>
            <Link 
              to="/chat"
              className="group border-2 px-10 py-3 rounded-full font-medium text-base transition-all-smooth transform hover:scale-110 glass-card hover:bg-white/10"
              style={{borderColor: '#6EC6CA', color: '#6EC6CA'}}
            >
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-6 w-6" />
                <span>与AI Agent对话</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why We Built Echo - Enhanced with Images */}
      <section className="py-32 relative" style={{backgroundColor: '#ffffff'}}>
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-2 px-6 py-3 rounded-full" style={{backgroundColor: '#6EC6CA20'}}>
                <Users className="h-5 w-5" style={{color: '#6EC6CA'}} />
                <span className="font-semibold" style={{color: '#6EC6CA'}}>我们的使命</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-8" style={{color: '#2C3E50'}}>Why We Built Echo</h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-lg leading-relaxed mb-6" style={{color: '#64748b'}}>
                在当今浮躁且纷繁的社交媒体环境中，我们逐渐失去了真实的连接。Echo 的诞生源于一个简单的信念：
              </p>
              <div className="glass-card p-8 rounded-3xl animate-scale-in animate-delay-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-20 overflow-hidden animate-float">
                  <img 
                    src="https://madeyousmileback.com/wp-content/uploads/2019/06/The-True-Value-of-Friendship-Happiness.webp" 
                    alt="真挚友谊的价值"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xl font-medium leading-relaxed" style={{color: '#6EC6CA'}}>
                  真正有意义的关系应该基于价值观的共鸣，而非标签的堆叠。
                </p>
              </div>
              <p className="text-base mt-8 leading-relaxed" style={{color: '#64748b'}}>
                我们相信，当人们能够基于思想和价值观相遇时，才能建立更深层次、更持久的联系。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features - Redesigned */}
      <section className="py-32 relative" style={{backgroundColor: '#F7F9FA'}}>
        <div className="absolute inset-0 pattern-mesh opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24 animate-slide-up">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-2 px-6 py-3 rounded-full" style={{backgroundColor: '#4A556820'}}>
                <Zap className="h-5 w-5" style={{color: '#4A5568'}} />
                <span className="font-semibold" style={{color: '#4A5568'}}>核心技术</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-8" style={{color: '#2C3E50'}}>
              关于产品：<span style={{color: '#6EC6CA'}}>Not an Another Social App</span>
            </h2>
            <p className="text-lg max-w-5xl mx-auto leading-relaxed" style={{color: '#64748b'}}>
              Echo 专为那些渴望更深层次交流的人而设计。你想链接对方可能不仅处于技能匹配和能力互补，
              <span className="font-semibold" style={{color: '#6EC6CA'}}>更在于价值观的共鸣。</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="glass-card p-10 rounded-3xl card-hover animate-slide-up group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10 animate-float">
                <img 
                  src="https://scitechdaily.com/images/AI-Brain-Circuit-Connectivity.jpg" 
                  alt="AI脑神经网络连接"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="relative mb-8 z-10">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center animate-glow-pulse group-hover:animate-wave-float" 
                     style={{background: 'linear-gradient(135deg, #6EC6CA 0%, #8fd3d6 100())'}}>
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-ping" style={{backgroundColor: '#4A5568'}}></div>
              </div>
              <h3 className="text-lg font-semibold mb-4" style={{color: '#2C3E50'}}>基于 Schwartz 价值观模型</h3>
              <p className="leading-relaxed text-base" style={{color: '#64748b'}}>
                对话中提取长期兴趣与倾向，构建科学的价值观画像
              </p>
            </div>
            
            <div className="glass-card p-10 rounded-3xl card-hover animate-slide-up animate-delay-200 group relative overflow-hidden">
              <div className="absolute top-2 right-2 w-20 h-20 opacity-15 animate-wave-float animate-delay-200">
                <img 
                  src="https://neurosciencenews.com/files/2021/08/brain-connectivity-ai-neurosinces-public.jpg" 
                  alt="AI人工智能神经网络"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="relative mb-8 z-10">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center animate-glow-pulse group-hover:animate-wave-float" 
                     style={{background: 'linear-gradient(135deg, #6EC6CA 0%, #8fd3d6 100%)'}}>
                  <Target className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-ping animate-delay-100" style={{backgroundColor: '#6EC6CA'}}></div>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{color: '#2C3E50'}}>AI/NLP 深度解析</h3>
              <p className="leading-relaxed text-lg" style={{color: '#64748b'}}>
                利用先进的AI/NLP技术解析用户对话语料，生成结构化价值观分布图谱
              </p>
            </div>
            
            <div className="glass-card p-10 rounded-3xl card-hover animate-slide-up animate-delay-400 group relative overflow-hidden">
              <div className="absolute top-4 right-4 w-16 h-16 opacity-20 animate-pulse-soft">
                <img 
                  src="https://media.istockphoto.com/id/2094337676/photo/diverse-team-working-together-in-modern-co-working-space.jpg" 
                  alt="团队协作"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="relative mb-8 z-10">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center animate-glow-pulse group-hover:animate-wave-float" 
                     style={{background: 'linear-gradient(135deg, #4A5568 0%, #718096 100%)'}}>
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-ping animate-delay-200" style={{backgroundColor: '#BFD8D2'}}></div>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{color: '#2C3E50'}}>智能记忆系统</h3>
              <p className="leading-relaxed text-lg" style={{color: '#64748b'}}>
                长短期记忆机制完美结合，记录短期偏好与长期价值信念
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Value - Enhanced Grid */}
      <section className="py-32 relative" style={{backgroundColor: '#ffffff'}}>
        <div className="absolute inset-0 pattern-dots opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24 animate-slide-up">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-2 px-6 py-3 rounded-full" style={{backgroundColor: '#BFD8D220'}}>
                <Users className="h-5 w-5" style={{color: '#BFD8D2'}} />
                <span className="font-semibold" style={{color: '#6EC6CA'}}>用户价值</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{color: '#2C3E50'}}>
              从先懂你开始：<span style={{color: '#6EC6CA'}}>深度连接的四大支柱</span>
            </h2>
            <p className="text-xl max-w-5xl mx-auto leading-relaxed" style={{color: '#64748b'}}>
              Echo 专为那些渴望更深层次交流的人而设计。连接他人不仅基于技能匹配和能力互补，
              更在于价值观的深度共鸣。
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Card 1 */}
            <div className="glass-card p-10 rounded-3xl card-hover animate-slide-up group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-24 opacity-10 animate-float">
                <img 
                  src="https://www.newportacademy.com/wp-content/uploads/Resources-Post-Teen-Friendships-05-1024x570.jpg" 
                  alt="青少年友谊连接"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex items-start space-x-6 relative z-10">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glow-pulse group-hover:animate-wave-float" 
                       style={{background: 'linear-gradient(135deg, #6EC6CA 0%, #8fd3d6 100())'}}>
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping" style={{backgroundColor: '#4A5568'}}></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4" style={{color: '#2C3E50'}}>价值观驱动的匹配</h3>
                  <p className="leading-relaxed text-lg" style={{color: '#64748b'}}>
                    我们不只提供标签匹配，而是基于你在对话中的语言行为、偏好与价值判断，构建专属价值观画像，寻找与你共鸣的人。
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-10 rounded-3xl card-hover animate-slide-up animate-delay-200 group">
              <div className="flex items-start space-x-6">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glow-pulse group-hover:animate-wave-float" 
                       style={{background: 'linear-gradient(135deg, #6EC6CA 0%, #BFD8D2 100())'}}>
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping animate-delay-100" style={{backgroundColor: '#6EC6CA'}}></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4" style={{color: '#2C3E50'}}>个性化 Voice Agent</h3>
                  <p className="leading-relaxed text-lg" style={{color: '#64748b'}}>
                    每位用户都有专属的本地长期记忆voice agent，通过连续对话不断理解你的深层特质，记录偏好演变轨迹。
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-10 rounded-3xl card-hover animate-slide-up animate-delay-300 group">
              <div className="flex items-start space-x-6">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glow-pulse group-hover:animate-wave-float" 
                       style={{background: 'linear-gradient(135deg, #4A5568 0%, #718096 100())'}}>
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping animate-delay-200" style={{backgroundColor: '#BFD8D2'}}></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4" style={{color: '#2C3E50'}}>Agent间智能协作</h3>
                  <p className="leading-relaxed text-lg" style={{color: '#64748b'}}>
                    突破直接交流的局限，通过agent间的信息交互和对话模拟，为你提供更深入的匹配洞察和决策支持。
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="glass-card p-10 rounded-3xl card-hover animate-slide-up animate-delay-400 group">
              <div className="flex items-start space-x-6">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glow-pulse group-hover:animate-wave-float" 
                       style={{background: 'linear-gradient(135deg, #BFD8D2 0%, #d1e3de 100())'}}>
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping animate-delay-300" style={{backgroundColor: '#4A5568'}}></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4" style={{color: '#2C3E50'}}>真实自我激发系统</h3>
                  <p className="leading-relaxed text-lg" style={{color: '#64748b'}}>
                    精心设计的对话框架鼓励真实表达，通过智能问题设计和情境反馈，逐步触达你的内在动机和核心价值。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Logic - Enhanced */}
      <section className="py-32 relative" style={{backgroundColor: '#BFD8D2'}}>
        <div className="absolute inset-0 pattern-mesh opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-slide-up mb-20">
            <div className="inline-block mb-8">
              <div className="flex items-center space-x-3 px-8 py-4 rounded-full glass-primary">
                <Target className="h-6 w-6" style={{color: '#6EC6CA'}} />
                <span className="font-bold text-xl" style={{color: '#2C3E50'}}>匹配逻辑</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-10" style={{color: '#2C3E50'}}>
              <span style={{color: '#6EC6CA'}}>Values First.</span> 价值观优先的匹配哲学
            </h2>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="glass-card p-10 rounded-3xl animate-scale-in">
                <p className="text-xl leading-relaxed" style={{color: '#2C3E50'}}>
                  我们独特的匹配算法首先基于你的价值观和思想连接你与他人，而不是基于表层的技能和标签。
                  Agent 通过与你持续对话，引导你表达真实想法与偏好，并在这个过程中提取出你的核心价值观。
                </p>
              </div>
              <div className="flex items-center justify-center space-x-8 animate-slide-up animate-delay-300">
                <div className="flex items-center space-x-3 px-6 py-3 rounded-full glass-primary">
                  <Brain className="h-5 w-5" style={{color: '#6EC6CA'}} />
                  <span className="font-semibold" style={{color: '#2C3E50'}}>深度分析</span>
                </div>
                <ArrowRight className="h-6 w-6" style={{color: '#6EC6CA'}} />
                <div className="flex items-center space-x-3 px-6 py-3 rounded-full glass-primary">
                  <Target className="h-5 w-5" style={{color: '#4A5568'}} />
                  <span className="font-semibold" style={{color: '#2C3E50'}}>价值观画像</span>
                </div>
                <ArrowRight className="h-6 w-6" style={{color: '#6EC6CA'}} />
                <div className="flex items-center space-x-3 px-6 py-3 rounded-full glass-primary">
                  <Users className="h-5 w-5" style={{color: '#BFD8D2'}} />
                  <span className="font-semibold" style={{color: '#2C3E50'}}>精准匹配</span>
                </div>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#2C3E50bb'}}>
                所有信息都被记录在本地的长期记忆中，逐步构建你的价值观画像，并用于寻找与你真正契合的队友。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium Design */}
      <section className="py-32 relative overflow-hidden" style={{backgroundColor: '#6EC6CA'}}>
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl opacity-20 animate-wave-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl opacity-15 animate-wave-float animate-delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-2xl opacity-10 animate-float"></div>
        </div>
        

        
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-slide-up mb-12">
            <div className="inline-block mb-8 px-8 py-3 rounded-full glass-primary animate-glow-pulse">
              <span className="font-semibold text-lg" style={{color: '#2C3E50'}}>开启你的价值观之旅</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              准备好发现真实的
              <span className="block animate-slide-up animate-delay-200" style={{color: '#4A5568'}}>自己了吗？</span>
            </h2>
          </div>
          
          <div className="animate-slide-up animate-delay-300 mb-16">
            <div className="glass-card p-10 rounded-3xl max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed" style={{color: '#2C3E50'}}>
                加入Echo社区，让AI Agent帮助您建立有意义的连接，
                在价值观驱动的环境中找到真正的归属感。
              </p>
            </div>
          </div>
          
          <div className="animate-slide-up animate-delay-500">
            <Link 
              to="/tests"
              className="group inline-flex items-center space-x-4 px-16 py-6 rounded-full font-bold text-xl transition-all-smooth shadow-2xl transform hover:scale-110 animate-glow-pulse"
              style={{
                backgroundColor: '#4A5568', 
                color: '#ffffff',
                boxShadow: '0 25px 50px rgba(74, 85, 104, 0.5), 0 15px 30px rgba(74, 85, 104, 0.4)'
              }}
            >
              <Sparkles className="h-7 w-7 animate-pulse-soft" />
              <span>立即开始</span>
              <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="py-20 border-t relative" style={{backgroundColor: '#2C3E50', borderColor: '#34495e'}}>
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-8 md:mb-0 animate-scale-in">
              <span className="text-3xl font-bold text-white">Echo</span>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xl font-semibold mb-2" style={{color: '#BFD8D2'}}>
                Echo yourself. Where values meet.
              </div>
              <div className="text-lg font-medium mb-1" style={{color: '#6EC6CA'}}>
                用AI连接每一颗真诚的心
              </div>
              <div className="text-sm" style={{color: '#64748b'}}>
                © 2024 Echo. 价值观驱动的深度社交平台
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;