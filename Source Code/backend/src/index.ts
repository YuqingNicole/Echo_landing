export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Extract user info from headers
      const userId = request.headers.get('X-Encrypted-Yw-ID');
      const isLogin = request.headers.get('X-Is-Login') === '1';
      
      console.log('📋 Request Info:', {
        path,
        method,
        userId: userId ? 'present' : 'missing',
        isLogin
      });

      // Route handlers
      if (path === '/api/save-profile' && method === 'POST') {
        return await handleSaveProfile(request, env, userId);
      }
      
      if (path === '/api/get-profile' && method === 'GET') {
        return await handleGetProfile(request, env, userId);
      }
      
      if (path === '/api/save-test-results' && method === 'POST') {
        return await handleSaveTestResults(request, env, userId);
      }
      
      if (path === '/api/get-matches' && method === 'GET') {
        return await handleGetMatches(request, env, userId);
      }
      
      if (path === '/api/save-matches' && method === 'POST') {
        return await handleSaveMatches(request, env, userId);
      }

      // Default response
      return new Response(JSON.stringify({
        success: true,
        message: 'Echo Backend API',
        timestamp: new Date().toISOString()
      }), {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('❌ API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: (error as Error).message
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

// Save user profile
async function handleSaveProfile(request: Request, env: any, userId: string | null): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  if (!userId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'User not authenticated'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    const profileData = await request.json();
    console.log('💾 Saving profile for user:', userId);

    // First, check if user exists
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE encrypted_yw_id = ?'
    ).bind(userId).first();

    if (!existingUser) {
      // Create new user
      await env.DB.prepare(`
        INSERT INTO users (encrypted_yw_id, bio, values_profile, interests, personality_type, agent_preferences, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(
        userId,
        profileData.bio || '',
        profileData.valuesProfile || '',
        profileData.interests || '',
        profileData.personalityType || '',
        profileData.agentPreferences || ''
      ).run();
    } else {
      // Update existing user
      await env.DB.prepare(`
        UPDATE users 
        SET bio = ?, values_profile = ?, interests = ?, personality_type = ?, agent_preferences = ?, updated_at = CURRENT_TIMESTAMP
        WHERE encrypted_yw_id = ?
      `).bind(
        profileData.bio || '',
        profileData.valuesProfile || '',
        profileData.interests || '',
        profileData.personalityType || '',
        profileData.agentPreferences || '',
        userId
      ).run();
    }

    console.log('✅ Profile saved successfully');
    return new Response(JSON.stringify({
      success: true,
      message: 'Profile saved successfully'
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('❌ Failed to save profile:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to save profile',
      message: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Get user profile
async function handleGetProfile(request: Request, env: any, userId: string | null): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  if (!userId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'User not authenticated'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    console.log('📖 Getting profile for user:', userId);

    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE encrypted_yw_id = ?'
    ).bind(userId).first();

    if (!user) {
      return new Response(JSON.stringify({
        success: true,
        profile: null
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log('✅ Profile retrieved successfully');
    return new Response(JSON.stringify({
      success: true,
      profile: user
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('❌ Failed to get profile:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get profile',
      message: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Save test results
async function handleSaveTestResults(request: Request, env: any, userId: string | null): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  if (!userId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'User not authenticated'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    const testData = await request.json();
    console.log('🎯 Saving test results for user:', userId);

    // Get user ID or create user if not exists
    let user = await env.DB.prepare(
      'SELECT id FROM users WHERE encrypted_yw_id = ?'
    ).bind(userId).first();

    if (!user) {
      // Create new user if not exists
      const insertResult = await env.DB.prepare(`
        INSERT INTO users (encrypted_yw_id, created_at, updated_at)
        VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(userId).run();
      
      user = { id: insertResult.meta.last_row_id };
      console.log('✅ Created new user with ID:', user.id);
    }

    // Save test results
    await env.DB.prepare(`
      INSERT INTO test_results (user_id, test_type, questions, answers, analysis_result, completed_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      user.id,
      testData.testType || 'unknown',
      testData.questions || '[]',
      testData.answers || '[]',
      testData.analysisResult || ''
    ).run();

    console.log('✅ Test results saved successfully');
    return new Response(JSON.stringify({
      success: true,
      message: 'Test results saved successfully'
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('❌ Failed to save test results:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to save test results',
      message: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Get matches
async function handleGetMatches(request: Request, env: any, userId: string | null): Promise<Response> {
  if (!userId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'User not authenticated'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log('🔍 Getting matches for user:', userId);

    // Get user ID
    const user = await env.DB.prepare(
      'SELECT id FROM users WHERE encrypted_yw_id = ?'
    ).bind(userId).first();

    if (!user) {
      return new Response(JSON.stringify({
        success: true,
        matches: []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get matches from database
    const matches = await env.DB.prepare(
      'SELECT * FROM matches WHERE user_id = ? ORDER BY created_at DESC LIMIT 10'
    ).bind(user.id).all();

    console.log('✅ Matches retrieved successfully');
    return new Response(JSON.stringify({
      success: true,
      matches: matches.results || []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Failed to get matches:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get matches',
      message: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Save matches
async function handleSaveMatches(request: Request, env: any, userId: string | null): Promise<Response> {
  if (!userId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'User not authenticated'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { matches } = await request.json();
    console.log('💝 Saving matches for user:', userId);

    // Get user ID
    const user = await env.DB.prepare(
      'SELECT id FROM users WHERE encrypted_yw_id = ?'
    ).bind(userId).first();

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Clear existing matches for this user
    await env.DB.prepare(
      'DELETE FROM matches WHERE user_id = ?'
    ).bind(user.id).run();

    // Save new matches
    for (const match of matches) {
      await env.DB.prepare(`
        INSERT INTO matches (user_id, matched_user_id, match_score, match_reason, status, created_at)
        VALUES (?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
      `).bind(
        user.id,
        match.id || 'generated_' + Date.now(),
        match.matchScore || 0,
        match.matchReason || ''
      ).run();
    }

    console.log('✅ Matches saved successfully');
    return new Response(JSON.stringify({
      success: true,
      message: 'Matches saved successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Failed to save matches:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to save matches',
      message: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}