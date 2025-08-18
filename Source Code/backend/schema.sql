-- Echo社区数据库架构

-- 用户表
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encrypted_yw_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  bio TEXT,
  values_profile TEXT,
  interests TEXT,
  personality_type TEXT,
  agent_preferences TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 测试结果表
CREATE TABLE test_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_type TEXT NOT NULL,
  questions TEXT NOT NULL,
  answers TEXT NOT NULL,
  analysis_result TEXT,
  score INTEGER,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Agent对话记录表
CREATE TABLE agent_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  conversation_type TEXT DEFAULT 'chat',
  messages TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 匹配记录表
CREATE TABLE matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  matched_user_id INTEGER NOT NULL,
  match_score REAL,
  match_reason TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (matched_user_id) REFERENCES users (id)
);