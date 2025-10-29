import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db/database';
import { getUserFromRequest } from '@/lib/auth';
import { calculateSecurityScore } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get breach checks count
    const breachChecks = db.prepare(
      'SELECT COUNT(*) as count, SUM(breaches_found) as total_breaches FROM breach_checks WHERE user_id = ?'
    ).get(user.userId) as { count: number; total_breaches: number };

    // Get scan history stats
    const scanStats = db.prepare(
      `SELECT 
        COUNT(*) as total_scans,
        SUM(CASE WHEN scan_type = 'file_scan' THEN 1 ELSE 0 END) as file_scans,
        SUM(CASE WHEN scan_type = 'website_scan' THEN 1 ELSE 0 END) as website_scans,
        SUM(CASE WHEN scan_type = 'breach_check' THEN 1 ELSE 0 END) as breach_checks
       FROM scan_history 
       WHERE user_id = ?`
    ).get(user.userId) as any;

    // Get active sessions count
    const activeSessions = db.prepare(
      'SELECT COUNT(*) as count FROM sessions WHERE user_id = ? AND is_active = 1'
    ).get(user.userId) as { count: number };

    // Get login stats
    const loginStats = db.prepare(
      `SELECT 
        COUNT(*) as total_logins,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_logins,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_logins
       FROM login_history 
       WHERE user_id = ?`
    ).get(user.userId) as any;

    // Get recent activity (last 7 days)
    const recentScans = db.prepare(
      `SELECT DATE(timestamp) as date, COUNT(*) as count 
       FROM scan_history 
       WHERE user_id = ? AND timestamp >= datetime('now', '-7 days')
       GROUP BY DATE(timestamp)
       ORDER BY date DESC`
    ).all(user.userId);

    // Calculate security score
    const securityScore = calculateSecurityScore({
      hasBreaches: (breachChecks.total_breaches || 0) > 0,
      breachCount: breachChecks.total_breaches || 0,
      recentScans: scanStats.total_scans || 0,
      activeSessions: activeSessions.count
    });

    return NextResponse.json({
      overview: {
        securityScore,
        totalScans: scanStats.total_scans || 0,
        breachesFound: breachChecks.total_breaches || 0,
        activeSessions: activeSessions.count,
        totalLogins: loginStats.total_logins || 0
      },
      scanBreakdown: {
        fileScans: scanStats.file_scans || 0,
        websiteScans: scanStats.website_scans || 0,
        breachChecks: scanStats.breach_checks || 0
      },
      loginStats: {
        successful: loginStats.successful_logins || 0,
        failed: loginStats.failed_logins || 0
      },
      recentActivity: recentScans
    }, { status: 200 });

  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
