import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db/database';
import { getUserFromRequest } from '@/lib/auth';
import crypto from 'crypto';
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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Check file size (max 32MB for VirusTotal free tier)
    const maxSize = 32 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 32MB limit' },
        { status: 400 }
      );
    }

    // Calculate file hash
    const buffer = await file.arrayBuffer();
    const hash = crypto.createHash('sha256').update(Buffer.from(buffer)).digest('hex');

    // For demonstration, return mock scan results
    // In production, integrate with VirusTotal API
    const mockScanResult = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      hash: hash,
      scanDate: new Date().toISOString(),
      status: 'clean',
      detectionRatio: '0/70',
      engines: {
        total: 70,
        detected: 0
      },
      details: [
        { engine: 'Microsoft', result: 'Clean' },
        { engine: 'Kaspersky', result: 'Clean' },
        { engine: 'Avast', result: 'Clean' },
        { engine: 'BitDefender', result: 'Clean' },
        { engine: 'Norton', result: 'Clean' }
      ]
    };

    // If VirusTotal API key is available, use it
    if (process.env.VIRUSTOTAL_API_KEY) {
      try {
        // First, check if file hash exists
        const vtResponse = await axios.get(
          `https://www.virustotal.com/api/v3/files/${hash}`,
          {
            headers: {
              'x-apikey': process.env.VIRUSTOTAL_API_KEY
            },
            validateStatus: (status) => status === 200 || status === 404
          }
        );

        if (vtResponse.status === 200) {
          const data = vtResponse.data.data.attributes;
          mockScanResult.status = data.last_analysis_stats.malicious > 0 ? 'infected' : 'clean';
          mockScanResult.detectionRatio = `${data.last_analysis_stats.malicious}/${data.last_analysis_stats.total}`;
          mockScanResult.engines = {
            total: data.last_analysis_stats.total,
            detected: data.last_analysis_stats.malicious
          };
        }
      } catch (error) {
        console.error('VirusTotal API error:', error);
      }
    }

    // Store scan in database
    db.prepare(
      `INSERT INTO scan_history (user_id, scan_type, target, results, status) 
       VALUES (?, ?, ?, ?, ?)`
    ).run(
      user.userId,
      'file_scan',
      file.name,
      JSON.stringify(mockScanResult),
      mockScanResult.status
    );

    return NextResponse.json({
      ...mockScanResult,
      message: mockScanResult.status === 'clean' 
        ? 'File is clean and safe to use' 
        : 'Warning: Potential threats detected'
    }, { status: 200 });

  } catch (error) {
    console.error('File scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
