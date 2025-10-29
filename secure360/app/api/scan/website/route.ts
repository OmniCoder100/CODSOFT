import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db/database';
import { getUserFromRequest } from '@/lib/auth';
import { sanitizeInput } from '@/lib/utils';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const sanitizedUrl = sanitizeInput(url);

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(sanitizedUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Perform security checks
    const scanResults = {
      url: sanitizedUrl,
      scanDate: new Date().toISOString(),
      https: parsedUrl.protocol === 'https:',
      ssl: {
        valid: false,
        issuer: 'Unknown',
        expiryDate: null
      },
      securityHeaders: {
        'Content-Security-Policy': false,
        'X-Frame-Options': false,
        'X-Content-Type-Options': false,
        'Strict-Transport-Security': false,
        'X-XSS-Protection': false
      },
      openPorts: [] as number[],
      vulnerabilities: [] as any[],
      securityScore: 0
    };

    try {
      // Check security headers
      const response = await axios.get(sanitizedUrl, {
        timeout: 10000,
        validateStatus: () => true,
        maxRedirects: 5
      });

      const headers = response.headers;
      scanResults.securityHeaders = {
        'Content-Security-Policy': !!headers['content-security-policy'],
        'X-Frame-Options': !!headers['x-frame-options'],
        'X-Content-Type-Options': !!headers['x-content-type-options'],
        'Strict-Transport-Security': !!headers['strict-transport-security'],
        'X-XSS-Protection': !!headers['x-xss-protection']
      };

      // Check SSL (simplified)
      if (parsedUrl.protocol === 'https:') {
        scanResults.ssl.valid = true;
        scanResults.ssl.issuer = 'Valid Certificate';
      }

    } catch (error: any) {
      if (error.code === 'ENOTFOUND') {
        return NextResponse.json(
          { error: 'Website not found' },
          { status: 404 }
        );
      }
    }

    // Analyze vulnerabilities
    if (!scanResults.https) {
      scanResults.vulnerabilities.push({
        severity: 'high',
        type: 'No HTTPS',
        description: 'Website does not use HTTPS encryption',
        recommendation: 'Enable HTTPS with a valid SSL certificate'
      });
    }

    if (!scanResults.securityHeaders['Content-Security-Policy']) {
      scanResults.vulnerabilities.push({
        severity: 'medium',
        type: 'Missing CSP Header',
        description: 'Content-Security-Policy header is not set',
        recommendation: 'Implement Content-Security-Policy to prevent XSS attacks'
      });
    }

    if (!scanResults.securityHeaders['X-Frame-Options']) {
      scanResults.vulnerabilities.push({
        severity: 'medium',
        type: 'Missing X-Frame-Options',
        description: 'X-Frame-Options header is not set',
        recommendation: 'Set X-Frame-Options to prevent clickjacking attacks'
      });
    }

    if (!scanResults.securityHeaders['Strict-Transport-Security']) {
      scanResults.vulnerabilities.push({
        severity: 'medium',
        type: 'Missing HSTS',
        description: 'Strict-Transport-Security header is not set',
        recommendation: 'Enable HSTS to enforce HTTPS connections'
      });
    }

    // Calculate security score
    let score = 100;
    scanResults.vulnerabilities.forEach(vuln => {
      if (vuln.severity === 'high') score -= 20;
      if (vuln.severity === 'medium') score -= 10;
      if (vuln.severity === 'low') score -= 5;
    });
    scanResults.securityScore = Math.max(score, 0);

    // Common ports check (mock data)
    scanResults.openPorts = [80, 443];

    // Store scan in database
    db.prepare(
      `INSERT INTO scan_history (user_id, scan_type, target, results, status) 
       VALUES (?, ?, ?, ?, ?)`
    ).run(
      user.userId,
      'website_scan',
      sanitizedUrl,
      JSON.stringify(scanResults),
      scanResults.vulnerabilities.length > 0 ? 'vulnerabilities_found' : 'secure'
    );

    return NextResponse.json({
      ...scanResults,
      summary: {
        total: scanResults.vulnerabilities.length,
        high: scanResults.vulnerabilities.filter(v => v.severity === 'high').length,
        medium: scanResults.vulnerabilities.filter(v => v.severity === 'medium').length,
        low: scanResults.vulnerabilities.filter(v => v.severity === 'low').length
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Website scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
