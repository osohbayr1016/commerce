import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { createR2Client, getR2Config } from '@/lib/cloudflare/r2-client';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: keyParts } = await params;
    const key = keyParts.join('/');

    if (!key) {
      return NextResponse.json({ error: 'Missing file key' }, { status: 400 });
    }

    const config = getR2Config();
    const client = createR2Client();

    const command = new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    });

    const response = await client.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const headers = new Headers();
    if (response.ContentType) {
      headers.set('Content-Type', response.ContentType);
    }
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(response.Body as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
