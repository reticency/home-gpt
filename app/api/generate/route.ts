import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const mockUrls = [
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
    ];

    const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];

    return NextResponse.json({
      success: true,
      renderingUrl: randomUrl,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: '生成失败' }, { status: 500 });
  }
}