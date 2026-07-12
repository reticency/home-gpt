import { NextRequest, NextResponse } from 'next/server';
import { SeedreamAPI } from '@/utils/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size = '1024x1024', area } = body;

    const useAI = process.env.USE_AI === 'true' && process.env.ARK_API_KEY;

    if (useAI) {
      const seedream = new SeedreamAPI();
      const response = await seedream.generateImage(prompt, size);

      if (response.data && response.data[0]?.url) {
        return NextResponse.json({
          success: true,
          result: {
            area,
            imageUrl: response.data[0].url,
            prompt,
            status: 'generated' as const,
            generatedAt: Date.now(),
          },
        });
      }

      return NextResponse.json({
        success: false,
        error: '生成失败',
      });
    } else {
      const mockImages: Record<string, string> = {
        客厅: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&w=800&h=600&fit=crop',
        厨房: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&w=800&h=600&fit=crop',
        卧室: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        卫生间: 'https://plus.unsplash.com/premium_photo-1661902468735-eabf780f8ff6?ixlib=rb-4.0.3&w=800&h=600&fit=crop',
        餐厅: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&w=800&h=600&fit=crop',
        书房: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&w=800&h=600&fit=crop',
      };

      const imageUrl = mockImages[area] || mockImages['客厅'];

      return NextResponse.json({
        success: true,
        result: {
          area,
          imageUrl,
          prompt,
          status: 'generated' as const,
          generatedAt: Date.now(),
        },
      });
    }
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ success: false, error: '图片生成失败' }, { status: 500 });
  }
}
