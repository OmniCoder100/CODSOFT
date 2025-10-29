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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'login';
    const limit = parseInt(searchParams.get('limit') || '50');

    if (type === 'login') {
      // Get login history
      const history = db.prepare(
        `SELECT id, email, ip_address, location, user_agent, status, timestamp 
         FROM login_history 
         WHERE user_id = ? 
         ORDER BY timestamp DESC 
         LIMIT ?`
      ).all(user.userId, limit);

      return NextResponse.json({ history }, { status: 200 });
    } else if (type === 'scan') {
      // Get scan history
      const history = db.prepare(
        `SELECT id, scan_type, target, status, timestamp 
         FROM scan_history 
         WHERE user_id = ? 
         ORDER BY timestamp DESC 
         LIMIT ?`
      ).all(user.userId, limit);

      return NextResponse.json({ history }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Invalid history type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
