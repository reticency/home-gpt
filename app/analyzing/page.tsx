'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, CheckCircle2, Loader2 } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { StepIndicator } from '@/components/StepIndicator';

const experts = [
  { id: 1, name: '户型分析师', emoji: '🏠', description: '正在分析户型结构' },
  { id: 2, name: '家庭规划师', emoji: '👨‍👩‍👧', description: '正在规划家庭空间' },
  { id: 3, name: '收纳设计师', emoji: '🗄️', description: '正在优化收纳方案' },
  { id: 4, name: '装修预算师', emoji: '💰', description: '正在分配预算比例' },
];

export default function AnalyzingPage() {
  const router = useRouter();
  const { currentProject, startAnalysis, setAnalysisResult } = useProject();
  const [completedExperts, setCompletedExperts] = useState<number[]>([]);
  const [currentExpertIndex, setCurrentExpertIndex] = useState(0);
  const analysisStartedRef = useRef(false);

  useEffect(() => {
    if (!currentProject) {
      router.push('/upload');
      return;
    }
    if (currentProject.status === 'complete') {
      router.push('/result');
      return;
    }
    if (analysisStartedRef.current || currentProject.status === 'analyzing') {
      return;
    }
    analysisStartedRef.current = true;
    startAnalysis();
  }, [currentProject, router, startAnalysis]);

  useEffect(() => {
    if (currentExpertIndex >= experts.length) {
      fetchAnalysis();
      return;
    }

    const timer = setTimeout(() => {
      setCompletedExperts((prev) => [...prev, experts[currentExpertIndex].id]);
      setCurrentExpertIndex((prev) => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentExpertIndex]);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProject?.id,
          imageBase64: currentProject?.floorPlan?.base64,
          familyMembers: currentProject?.familyMembers,
          budget: currentProject?.budget,
          style: currentProject?.style,
          requirements: currentProject?.requirements,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const result = data.result;
        
        const style = currentProject?.style || 'modern';
        const styleName = {
          wood: '原木风格',
          modern: '现代简约风格',
          nordic: '北欧风格',
          chinese: '新中式风格',
          luxury: '轻奢风格',
          japanese: '日式风格',
        }[style];

        const areas = [
          { area: '客厅', prompt: `${styleName}客厅，宽敞明亮，舒适的沙发，精致的茶几，装饰画，绿植，温暖的灯光，高品质装修` },
          { area: '厨房', prompt: `${styleName}厨房，整洁的操作台，现代化厨具，橱柜设计，瓷砖墙面，明亮通风` },
          { area: '卧室', prompt: `${styleName}卧室，舒适的大床，温馨的灯光，衣柜设计，窗帘，地毯，装饰摆件` },
          { area: '卫生间', prompt: `${styleName}卫生间，干湿分离，整洁的瓷砖，现代卫浴设施，镜子，收纳柜` },
        ];

        for (const item of areas) {
          try {
            const imgRes = await fetch('/api/generate/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: item.prompt,
                size: '1024x1024',
                area: item.area,
              }),
            });
            const imgData = await imgRes.json();
            if (imgData.success && imgData.result?.imageUrl) {
              result.renderings = result.renderings || [];
              result.renderings.push({
                area: item.area,
                imageUrl: imgData.result.imageUrl,
                prompt: item.prompt,
                status: 'generated' as const,
                generatedAt: Date.now(),
              });
            }
          } catch {
            result.renderings = result.renderings || [];
            result.renderings.push({
              area: item.area,
              imageUrl: `https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop`,
              prompt: item.prompt,
              status: 'generated' as const,
              generatedAt: Date.now(),
            });
          }
        }

        setAnalysisResult(result);
        router.push('/result');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('分析失败，请稍后重试');
      router.push('/requirements');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">HomeGPT</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <StepIndicator currentStep={3} />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-foreground mb-4">HomeGPT 正在召集专家……</h1>
            <p className="text-muted">AI 正在为您分析户型并生成设计方案</p>
          </div>

          <div className="space-y-4">
            {experts.map((expert, index) => {
              const isCompleted = completedExperts.includes(expert.id);
              const isCurrent = !isCompleted && currentExpertIndex === index;

              return (
                <div
                  key={expert.id}
                  className={`bg-white rounded-apple shadow-sm border border-border p-6 transition-all duration-300 ${
                    isCompleted ? 'opacity-80' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                      isCompleted
                        ? 'bg-success/10'
                        : isCurrent
                        ? 'bg-accent/10 animate-pulse'
                        : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-7 h-7 text-success" />
                      ) : isCurrent ? (
                        <Loader2 className="w-7 h-7 text-accent animate-spin" />
                      ) : (
                        expert.emoji
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-lg font-semibold ${
                        isCompleted ? 'text-success' : 'text-foreground'
                      }`}>
                        {isCompleted ? `${expert.name} ✓` : expert.name}
                      </div>
                      <div className="text-muted text-sm">{expert.description}</div>
                    </div>
                    {isCurrent && (
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-accent rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 200}ms` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${(completedExperts.length / experts.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-center text-muted text-sm">
              正在分析中，请稍候...
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}