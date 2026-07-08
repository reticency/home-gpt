'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowRight, Users, Wallet, Palette, CheckCircle2, XCircle } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { FamilyMemberType, StyleType, RequirementType, type FamilyMember, type UserRequirement } from '@/types';
import { StepIndicator } from '@/components/StepIndicator';

const familyOptions = [
  { type: FamilyMemberType.SINGLE, label: '单身', icon: '👤' },
  { type: FamilyMemberType.COUPLE, label: '夫妻', icon: '👫' },
  { type: FamilyMemberType.CHILD, label: '孩子', icon: '👶', hasCount: true },
  { type: FamilyMemberType.ELDER, label: '老人', icon: '👴', hasCount: true },
  { type: FamilyMemberType.PET, label: '宠物', icon: '🐶', hasCount: true },
];

const styleOptions = [
  { type: StyleType.WOOD, label: '原木风', description: '自然温馨' },
  { type: StyleType.MODERN, label: '现代简约', description: '简洁大气' },
  { type: StyleType.NORDIC, label: '北欧风', description: '清新明亮' },
  { type: StyleType.LUXURY, label: '轻奢风', description: '精致典雅' },
  { type: StyleType.CHINESE, label: '新中式', description: '传统韵味' },
  { type: StyleType.JAPANESE, label: '日式', description: '禅意宁静' },
];

const requirementOptions = [
  { type: RequirementType.STORAGE, label: '大量收纳' },
  { type: RequirementType.PARENTING, label: '亲子互动' },
  { type: RequirementType.WORK, label: '工作学习' },
  { type: RequirementType.ENTERTAINMENT, label: '休闲娱乐' },
  { type: RequirementType.ACCESSIBILITY, label: '无障碍' },
];

export default function RequirementsPage() {
  const router = useRouter();
  const { currentProject, setRequirements } = useProject();
  const [selectedFamily, setSelectedFamily] = useState<FamilyMember[]>([]);
  const [familyCounts, setFamilyCounts] = useState<Record<string, number>>({});
  const [budget, setBudget] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<StyleType | null>(null);
  const [selectedRequirements, setSelectedRequirements] = useState<UserRequirement[]>([]);

  useEffect(() => {
    if (!currentProject) {
      router.push('/upload');
      return;
    }
    if (currentProject.familyMembers.length > 0) {
      setSelectedFamily(currentProject.familyMembers);
    }
    if (currentProject.budget > 0) {
      setBudget((currentProject.budget / 10000).toString());
    }
    if (currentProject.style) {
      setSelectedStyle(currentProject.style);
    }
    if (currentProject.requirements.length > 0) {
      setSelectedRequirements(currentProject.requirements);
    }
  }, [currentProject, router]);

  const toggleFamily = (type: FamilyMemberType) => {
    const exists = selectedFamily.find((m) => m.type === type);
    if (exists) {
      setSelectedFamily(selectedFamily.filter((m) => m.type !== type));
    } else {
      setSelectedFamily([...selectedFamily, { type, count: familyCounts[type] || 1 }]);
    }
  };

  const updateFamilyCount = (type: FamilyMemberType, count: number) => {
    setFamilyCounts({ ...familyCounts, [type]: count });
    setSelectedFamily(selectedFamily.map((m) => (m.type === type ? { ...m, count } : m)));
  };

  const toggleRequirement = (type: RequirementType) => {
    const exists = selectedRequirements.find((r) => r.type === type);
    if (exists) {
      setSelectedRequirements(selectedRequirements.filter((r) => r.type !== type));
    } else {
      setSelectedRequirements([...selectedRequirements, { type }]);
    }
  };

  const isValid = () => {
    return (
      selectedFamily.length > 0 &&
      parseFloat(budget) > 0 &&
      selectedStyle !== null &&
      selectedRequirements.length > 0
    );
  };

  const handleNext = () => {
    if (!isValid()) return;
    setRequirements(
      selectedFamily,
      parseFloat(budget),
      selectedStyle!,
      selectedRequirements
    );
    router.push('/analyzing');
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
            <StepIndicator currentStep={2} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-[32px] font-semibold text-[#2D2D2D] mb-4">告诉我们你的需求</h1>
            <p className="text-[#5E6470] opacity-80">填写以下信息，让 AI 更好地为你设计</p>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/20 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[rgba(30,50,90,0.8)]" />
                <h2 className="text-lg font-semibold text-[#2D2D2D]">家庭成员</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {familyOptions.map((option) => {
                  const isSelected = selectedFamily.some((m) => m.type === option.type);
                  return (
                    <motion.button
                      key={option.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleFamily(option.type)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                        isSelected
                          ? 'border-[rgba(30,50,90,0.8)] bg-[rgba(30,50,90,0.05)]'
                          : 'border-[#E5E5EA] hover:border-[rgba(30,50,90,0.5)]'
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className={`text-sm font-medium ${isSelected ? 'text-[rgba(30,50,90,0.9)]' : 'text-[#2D2D2D]'}`}>
                        {option.label}
                      </span>
                      {option.hasCount && isSelected && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const count = familyCounts[option.type] || 1;
                              if (count > 1) updateFamilyCount(option.type, count - 1);
                            }}
                            className="w-6 h-6 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#2D2D2D] text-sm"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{familyCounts[option.type] || 1}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const count = familyCounts[option.type] || 1;
                              updateFamilyCount(option.type, count + 1);
                            }}
                            className="w-6 h-6 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#2D2D2D] text-sm"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/20 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-[rgba(30,50,90,0.8)]" />
                <h2 className="text-lg font-semibold text-[#2D2D2D]">预算</h2>
              </div>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E6470] opacity-60">¥</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="请输入预算（万元）"
                  className="w-full pl-8 pr-4 py-4 text-xl font-semibold border-2 border-[#E5E5EA] rounded-xl focus:border-[rgba(30,50,90,0.8)] focus:outline-none transition-colors bg-white/40"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5E6470] opacity-60">万元</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/20 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-[rgba(30,50,90,0.8)]" />
                <h2 className="text-lg font-semibold text-[#2D2D2D]">装修风格</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {styleOptions.map((option) => (
                  <motion.button
                    key={option.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStyle(option.type)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedStyle === option.type
                        ? 'border-[rgba(30,50,90,0.8)] bg-[rgba(30,50,90,0.05)]'
                        : 'border-[#E5E5EA] hover:border-[rgba(30,50,90,0.5)]'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${selectedStyle === option.type ? 'text-[rgba(30,50,90,0.9)]' : 'text-[#2D2D2D]'}`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-[#5E6470] opacity-60">{option.description}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/20 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[rgba(30,50,90,0.8)]" />
                <h2 className="text-lg font-semibold text-[#2D2D2D]">核心需求</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {requirementOptions.map((option) => {
                  const isSelected = selectedRequirements.some((r) => r.type === option.type);
                  return (
                    <motion.button
                      key={option.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleRequirement(option.type)}
                      className={`px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-[rgba(30,50,90,0.8)] bg-[rgba(30,50,90,0.8)] text-white'
                          : 'border-[#E5E5EA] hover:border-[rgba(30,50,90,0.5)] text-[#2D2D2D]'
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-1 ${selectedFamily.length > 0 ? 'text-[#22C55E]' : 'text-[#5E6470] opacity-60'}`}>
                {selectedFamily.length > 0 ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>家庭成员</span>
              </div>
              <div className={`flex items-center gap-1 ${parseFloat(budget) > 0 ? 'text-[#22C55E]' : 'text-[#5E6470] opacity-60'}`}>
                {parseFloat(budget) > 0 ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>预算</span>
              </div>
              <div className={`flex items-center gap-1 ${selectedStyle ? 'text-[#22C55E]' : 'text-[#5E6470] opacity-60'}`}>
                {selectedStyle ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>风格</span>
              </div>
              <div className={`flex items-center gap-1 ${selectedRequirements.length > 0 ? 'text-[#22C55E]' : 'text-[#5E6470] opacity-60'}`}>
                {selectedRequirements.length > 0 ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>需求</span>
              </div>
            </div>
            <motion.button
              whileHover={isValid() ? { scale: 1.02 } : {}}
              whileTap={isValid() ? { scale: 0.98 } : {}}
              onClick={handleNext}
              disabled={!isValid()}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 ${
                isValid()
                  ? 'bg-[rgba(30,50,90,0.8)] text-white hover:bg-[rgba(30,50,90,1)]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="bg-white/20 p-1.5 rounded-full flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </div>
              开始分析
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
