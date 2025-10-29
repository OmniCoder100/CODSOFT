import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db/database';
import { verifyPassword, generateToken, getClientInfo } from '@/lib/auth';
import { sanitizeInput, getDeviceType, extractLocation } from '@/lib/utils';
import UAParser from 'ua-parser-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    // Get user from database
    const user = db.prepare(
      'SELECT id, email, password_hash FROM users WHERE email = ?'
    ).get(sanitizedEmail) as { id: number; email: string; password_hash: string } | undefined;

    if (!user) {
      // Log failed attempt
      const { userAgent, ip } = getClientInfo(request);
      db.prepare(
        'INSERT INTO login_history (user_id, email, ip_address, user_agent, status) VALUES (?, ?, ?, ?, ?)'
      ).run(0, sanitizedEmail, ip, userAgent, 'failed');

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      // Log failed attempt
      const { userAgent, ip } = getClientInfo(request);
      db.prepare(
        'INSERT INTO login_history (user_id, email, ip_address, user_agent, status) VALUES (?, ?, ?, ?, ?)'
      ).run(user.id, sanitizedEmail, ip, userAgent, 'failed');

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get client information
    const { userAgent, ip } = getClientInfo(request);
    const parser = new UAParser(userAgent);
    const deviceInfo = parser.getResult();
    const deviceName = `${deviceInfo.browser.name || 'Unknown'} on ${deviceInfo.os.name || 'Unknown'}`;
    const location = extractLocation(ip);

    // Create session
    const token = generateToken({ userId: user.id, email: user.email, sessionId: 0 });
    const sessionResult = db.prepare(
      `INSERT INTO sessions (user_id, token, device_info, device_name, ip_address, location, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(user.id, token, JSON.stringify(deviceInfo), deviceName, ip, location, userAgent);

    // Update token with actual session ID
    const sessionId = sessionResult.lastInsertRowid as number;
    const finalToken = generateToken({ userId: user.id, email: user.email, sessionId });
    db.prepare('UPDATE sessions SET token = ? WHERE id = ?').run(finalToken, sessionId);

    // Log successful login
    db.prepare(
      'INSERT INTO login_history (user_id, email, ip_address, location, user_agent, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(user.id, sanitizedEmail, ip, location, userAgent, 'success');

    const response = NextResponse.json(
      {
        message: 'Login successful',
        token: finalToken,
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('auth_token', finalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
