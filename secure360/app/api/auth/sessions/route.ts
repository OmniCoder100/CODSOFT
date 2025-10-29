import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db/database';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all active sessions for the user
    const sessions = db.prepare(
      `SELECT id, device_name, ip_address, location, created_at, last_activity 
       FROM sessions 
       WHERE user_id = ? AND is_active = 1 
       ORDER BY last_activity DESC`
    ).all(user.userId);

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');
    const logoutAll = searchParams.get('all') === 'true';

    if (logoutAll) {
      // Logout all sessions except current
      db.prepare(
        'UPDATE sessions SET is_active = 0 WHERE user_id = ? AND id != ?'
      ).run(user.userId, user.sessionId);

      return NextResponse.json(
        { message: 'All other sessions logged out successfully' },
        { status: 200 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Logout specific session
    const result = db.prepare(
      'UPDATE sessions SET is_active = 0 WHERE id = ? AND user_id = ?'
    ).run(sessionId, user.userId);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Session logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
