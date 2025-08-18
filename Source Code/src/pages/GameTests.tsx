import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Circle, Sparkles } from 'lucide-react';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

interface GameTestsProps {
  userInfo: {
    encrypted_yw_id: string;
    display_name?: string;
    photo_url?: string;
  } | null;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  type: 'single' | 'multiple';
}

interface TestResult {
  question: string;
  answer: string;
  score: number;
}

const GameTests: React.FC<GameTestsProps> = ({ userInfo }) => {
  const [currentTest, setCurrentTest] = useState<'values' | 'personality' | 'interests' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const testTypes = [
    {
      id: 'values' as const,
      title: '价值观探索',
      description: '深入了解您的核心价值观和人生理念',
      icon: '💎',
      color: 'blue'
    },
    {
      id: 'personality' as const,
      title: '性格测试',
      description: '发现您独特的性格特征和行为模式',
      icon: '🎭',
      color: 'purple'
    },
    {
      id: 'interests' as const,
      title: '兴趣爱好',
      description: '探索您的兴趣爱好和生活方式偏好',
      icon: '🌟',
      color: 'green'
    }
  ];

  const generateQuestions = async (testType: string) => {
    setIsGeneratingQuestions(true);
    
    try {
      console.log('🎮 Generating questions for test type:', testType);
      
      const openai = createOpenAI({
        baseURL: 'https://api.youware.com/public/v1/ai',
        apiKey: 'sk-YOUWARE'
      });

      const config = globalThis.ywConfig?.ai_config?.game_facilitator;
      if (!config) {
        throw new Error('AI配置未找到');
      }

      const prompt = `为${testType}测试生成5个有趣且深入的问题。每个问题应该有4个选项。
      请以JSON格式返回，结构如下：
      {
        "questions": [
          {
            "id": 1,
            "question": "问题内容",
            "options": ["选项1", "选项2", "选项3", "选项4"],
            "type": "single"
          }
        ]
      }`;

      const systemPrompt = config.system_prompt({
        testType: testType,
        difficultyLevel: '中等',
        userProgress: '初始阶段'
      });

      const { text } = await generateText({
        model: openai(config.model),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: config.temperature || 0.9,
        maxTokens: config.maxTokens || 1500
      });

      console.log('✅ Generated questions response:', text);

      // 尝试解析JSON响应
      let questionData;
      try {
        questionData = JSON.parse(text);
      } catch (e) {
        // 如果直接解析失败，尝试提取JSON部分
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          questionData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析AI生成的问题格式');
        }
      }

      if (questionData.questions && Array.isArray(questionData.questions)) {
        setQuestions(questionData.questions);
        setCurrentQuestionIndex(0);
        setAnswers({});
      } else {
        throw new Error('生成的问题格式不正确');
      }

    } catch (error) {
      console.error('❌ Failed to generate questions:', error);
      // 使用默认问题作为备选
      const defaultQuestions = getDefaultQuestions(testType);
      setQuestions(defaultQuestions);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const getDefaultQuestions = (testType: string): Question[] => {
    const questionSets = {
      values: [
        {
          id: 1,
          question: '在人际关系中，您最重视什么？',
          options: ['真诚和信任', '共同成长', '相互支持', '深度沟通'],
          type: 'single' as const
        },
        {
          id: 2,
          question: '面对困难时，您的态度是？',
          options: ['积极面对挑战', '寻求他人帮助', '深思熟虑后行动', '保持乐观心态'],
          type: 'single' as const
        }
      ],
      personality: [
        {
          id: 1,
          question: '在社交场合中，您通常？',
          options: ['主动与人交谈', '观察他人后再参与', '寻找志同道合的人', '享受倾听的角色'],
          type: 'single' as const
        },
        {
          id: 2,
          question: '做决定时，您更依赖？',
          options: ['直觉和感受', '逻辑分析', '他人建议', '过往经验'],
          type: 'single' as const
        }
      ],
      interests: [
        {
          id: 1,
          question: '您更喜欢哪种休闲方式？',
          options: ['读书学习', '户外运动', '艺术创作', '社交聚会'],
          type: 'single' as const
        },
        {
          id: 2,
          question: '您对哪个领域最感兴趣？',
          options: ['科技创新', '文化艺术', '自然环境', '人文社科'],
          type: 'single' as const
        }
      ]
    };

    return questionSets[testType as keyof typeof questionSets] || questionSets.values;
  };

  const handleAnswerSelect = (questionId: number, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: [option]
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 完成测试，分析结果
      analyzeResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const analyzeResults = async () => {
    setIsAnalyzing(true);
    
    try {
      console.log('🔍 Analyzing test results...');
      
      const openai = createOpenAI({
        baseURL: 'https://api.youware.com/public/v1/ai',
        apiKey: 'sk-YOUWARE'
      });

      const config = globalThis.ywConfig?.ai_config?.profile_analyzer;
      if (!config) {
        throw new Error('分析配置未找到');
      }

      // 构建分析内容
      const analysisData = questions.map((q, index) => ({
        question: q.question,
        answer: answers[q.id]?.[0] || '未回答'
      }));

      const prompt = `请分析以下测试结果，为用户提供深入的个性分析：
      
      测试类型：${currentTest}
      测试结果：${JSON.stringify(analysisData, null, 2)}
      
      请提供：
      1. 核心特征分析（3-4条）
      2. 性格优势（2-3条）
      3. 成长建议（2-3条）
      4. 匹配偏好（2-3条）
      
      请用温暖、正面且具有洞察力的语言。`;

      const systemPrompt = config.system_prompt({
        analysisType: currentTest + '分析',
        userBackground: userInfo?.display_name || '新用户'
      });

      const { text } = await generateText({
        model: openai(config.model),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || 2000
      });

      console.log('✅ Analysis result:', text);
      setAnalysisResult(text);

      // 保存测试结果到后端
      await saveTestResults(analysisData, text);

    } catch (error) {
      console.error('❌ Failed to analyze results:', error);
      setAnalysisResult('分析过程中出现错误，请稍后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveTestResults = async (testData: any, analysis: string) => {
    try {
      const response = await fetch('https://backend.youware.com/api/save-test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testType: currentTest,
          questions: JSON.stringify(questions),
          answers: JSON.stringify(testData),
          analysisResult: analysis
        })
      });

      if (!response.ok) {
        console.error('❌ Failed to save test results:', response.status);
      } else {
        console.log('✅ Test results saved successfully');
      }
    } catch (error) {
      console.error('❌ Error saving test results:', error);
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuestions([]);
    setTestResults([]);
    setAnalysisResult('');
  };

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回首页
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">游戏化测试</h1>
            <p className="text-gray-600 mt-2">通过有趣的测试深入了解自己</p>
          </div>
        </div>

        {/* Test Selection */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testTypes.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
                onClick={() => {
                  setCurrentTest(test.id);
                  generateQuestions(test.title);
                }}
              >
                <div className="text-4xl mb-4">{test.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{test.title}</h3>
                <p className="text-gray-600 mb-6">{test.description}</p>
                <div className={`bg-${test.color}-50 text-${test.color}-600 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center`}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  开始测试
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isGeneratingQuestions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">正在生成专属测试...</h2>
          <p className="text-gray-600">AI正在为您准备个性化的问题</p>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">测试完成！</h1>
              <p className="text-gray-600">以下是您的个性分析结果</p>
            </div>

            <div className="prose max-w-none mb-8">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {analysisResult}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetTest}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                进行其他测试
              </button>
              <Link
                to="/profile"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-600 hover:text-white transition-colors text-center"
              >
                完善个人档案
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">正在分析您的答案...</h2>
          <p className="text-gray-600">AI正在深度分析您的个性特征</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion?.id]?.length > 0;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              问题 {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {currentQuestion && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id]?.includes(option);
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      {option}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                上一题
              </button>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestionIndex === questions.length - 1 ? '完成测试' : '下一题'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameTests;