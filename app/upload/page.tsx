'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

      const floorPlanType: 'image' | 'pdf' | 'screenshot' = file.type.startsWith('image/') ? 'image' : 'pdf';
      const floorPlan = {
        base64: storageBase64,
        filename: file.name,
        type: floorPlanType,
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
    <div className="min-h-screen bg-[#f0f0f0] font-helvetica">
      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[rgba(30,50,90,0.8)] rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#2D2D2D]">HomeGPT</span>
          </Link>
        </motion.div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <StepIndicator currentStep={1} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-[32px] font-semibold text-[#2D2D2D] mb-4">上传你的户型图</h1>
            <p className="text-[#5E6470] opacity-80">支持图片、PDF等格式</p>
          </motion.div>

          {filename ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/20 overflow-hidden"
            >
              {filename.endsWith('.pdf') ? (
                <div className="relative p-8 flex flex-col items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClear}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                  <div className="w-20 h-20 bg-[rgba(30,50,90,0.05)] rounded-[1.5rem] flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-[rgba(30,50,90,0.8)]" />
                  </div>
                  <p className="text-[#2D2D2D] font-medium">{filename}</p>
                  <p className="text-[#5E6470] opacity-60 text-sm mt-1">PDF 文件</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={preview || undefined}
                    alt={filename}
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClear}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
              <div className="px-6 py-4 border-t border-[#E5E5EA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {filename.endsWith('.pdf') ? (
                    <div className="w-6 h-6 bg-[rgba(30,50,90,0.05)] rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
                    </div>
                  ) : (
                    <Image className="w-5 h-5 text-[#5E6470] opacity-60" />
                  )}
                  <span className="text-[#2D2D2D] font-medium">{filename}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-[rgba(30,50,90,0.8)] text-white rounded-full font-semibold hover:bg-[rgba(30,50,90,1)] transition-colors"
                >
                  <div className="bg-white/20 p-1 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  下一步
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`relative border-2 border-dashed rounded-[1.5rem] p-16 text-center transition-all duration-200 cursor-pointer ${
                isDragging
                  ? 'border-[rgba(30,50,90,0.8)] bg-[rgba(30,50,90,0.05)]'
                  : 'border-[#E5E5EA] hover:border-[rgba(30,50,90,0.5)] hover:bg-white/40'
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf,image/webp"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`w-20 h-20 mx-auto mb-6 rounded-[1.5rem] flex items-center justify-center transition-colors ${
                  isDragging ? 'bg-[rgba(30,50,90,0.8)]' : 'bg-white/60 backdrop-blur-sm'
                }`}
              >
                <Upload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-[rgba(30,50,90,0.8)]'}`} />
              </motion.div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                isDragging ? 'text-[rgba(30,50,90,0.9)]' : 'text-[#2D2D2D]'
              }`}>
                {isDragging ? '松开上传' : '拖放文件到这里'}
              </h3>
              <p className="text-[#5E6470] opacity-80 mb-6">或者点击选择文件</p>
              <div className="flex items-center justify-center gap-4 text-sm text-[#5E6470] opacity-60">
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex items-center justify-center gap-2 text-[rgba(30,50,90,0.9)]"
                >
                  <div className="w-5 h-5 border-2 border-[rgba(30,50,90,0.8)] border-t-transparent rounded-full animate-spin" />
                  <span>处理中...</span>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 px-4 py-3 bg-[#EF4444]/10 text-[#EF4444] rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
