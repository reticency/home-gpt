'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, Image, FileText, X, ArrowRight, Home } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { compressImage } from '@/utils/storage';
import { StepIndicator } from '@/components/StepIndicator';



export default function UploadPage() {
  const router = useRouter();
  const { setFloorPlan, currentProject } = useProject();
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('请上传图片或PDF文件');
      setIsLoading(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过10MB');
      setIsLoading(false);
      return;
    }

    try {
      let previewBase64: string;
      let storageBase64: string;

      if (file.type.startsWith('image/')) {
        previewBase64 = await compressImage(file);
        storageBase64 = previewBase64;
      } else {
        storageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        previewBase64 = '';
      }

      const floorPlan = {
        base64: storageBase64,
        filename: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'pdf' as const,
        size: file.size,
      };

      setPreview(previewBase64);
      setFilename(file.name);
      setFloorPlan(floorPlan);
    } catch {
      setError('文件处理失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [setFloorPlan]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleNext = () => {
    router.push('/requirements');
  };

  const handleClear = () => {
    setPreview(null);
    setFilename('');
    setError(null);
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
            <StepIndicator currentStep={1} />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-foreground mb-4">上传你的户型图</h1>
            <p className="text-muted">支持图片、PDF等格式</p>
          </div>

          {filename ? (
            <div className="bg-white rounded-apple shadow-sm border border-border overflow-hidden animate-scaleIn">
              {filename.endsWith('.pdf') ? (
                <div className="relative p-8 flex flex-col items-center justify-center">
                  <button
                    onClick={handleClear}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-orange-500" />
                  </div>
                  <p className="text-foreground font-medium">{filename}</p>
                  <p className="text-muted text-sm mt-1">PDF 文件</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={preview}
                    alt={filename}
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                  <button
                    onClick={handleClear}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {filename.endsWith('.pdf') ? (
                    <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-orange-500" />
                    </div>
                  ) : (
                    <Image className="w-5 h-5 text-muted" />
                  )}
                  <span className="text-foreground font-medium">{filename}</span>
                </div>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-apple font-medium hover:bg-accent/90 transition-colors"
                >
                  下一步
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`relative border-2 border-dashed rounded-apple p-16 text-center transition-all duration-200 cursor-pointer ${
                isDragging
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-accent/50 hover:bg-gray-50'
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf,image/webp"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-colors ${
                isDragging ? 'bg-accent' : 'bg-gray-100'
              }`}>
                <Upload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-muted'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                isDragging ? 'text-accent' : 'text-foreground'
              }`}>
                {isDragging ? '松开上传' : '拖放文件到这里'}
              </h3>
              <p className="text-muted mb-6">或者点击选择文件</p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted">
                <div className="flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  <span>JPG/PNG</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </div>
              </div>
              {isLoading && (
                <div className="mt-6 flex items-center justify-center gap-2 text-accent">
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span>处理中...</span>
                </div>
              )}
              {error && (
                <div className="mt-4 px-4 py-3 bg-error/10 text-error rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}