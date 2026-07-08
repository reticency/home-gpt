'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Users, Layers, Sparkles, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationId: number;
    const scrollSpeed = 1;

    const scroll = () => {
      const halfScroll = (container.scrollWidth / 2) - 1;
      if (container.scrollLeft >= halfScroll) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      animationId = requestAnimationFrame(scroll);
    };

    const startScroll = () => {
      animationId = requestAnimationFrame(scroll);
    };

    setTimeout(startScroll, 100);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-helvetica">
      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between py-6 pl-6 md:pl-10 pr-6 md:pr-10 w-full max-w-[1536px] mx-auto"
        >
          <Link href="/" className="flex items-center gap-[12px]">
            <div className="w-[32px] h-[32px] bg-[rgba(30,50,90,0.8)] rounded-[8px] flex items-center justify-center shadow-sm">
              <Home className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-regular tracking-tighter text-xl text-white drop-shadow-md">HomeGPT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-white font-normal text-sm drop-shadow-md">
            <Link href="#features" className="cursor-pointer hover:opacity-70 transition-opacity">
              功能介绍
            </Link>
            <Link href="#testimonials" className="cursor-pointer hover:opacity-70 transition-opacity">
              使用案例
            </Link>
            <Link href="#about" className="cursor-pointer hover:opacity-70 transition-opacity">
              关于我们
            </Link>
          </nav>
        </motion.div>
      </header>

      <main>
        <section className="relative w-full h-screen flex items-center justify-center p-3 md:p-5 bg-[#f0f0f0]">
          <section className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden flex flex-col items-center bg-white/10 group">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
            >
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-[#f0f0f0] via-transparent to-black/30 z-10" />

            <div className="relative z-20 w-full h-full flex flex-col items-center">
              <div className="w-full flex flex-col items-center pt-8 md:pt-32 px-6 text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="mb-[32px]"
                >
                  <span className="inline-flex items-center gap-2 px-[12px] py-[4px] bg-white/60 backdrop-blur-md border border-white/20 rounded-full text-[12px] font-semibold text-[rgba(30,50,90,0.9)]">
                    <Sparkles className="w-4 h-4" />
                    AI Agent 驱动
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-white mb-2 tracking-tight leading-[1.05] drop-shadow-lg"
                >
                  设计你<span className="text-[#1E325A]">未来想要</span>的生活
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-sm sm:text-base md:text-lg text-white opacity-80 leading-relaxed max-w-xl font-normal"
                >
                  上传户型图，AI 告诉你这个家应该怎么设计。减少装修后悔，提升居住幸福感。
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-8"
                >
                  <Link href="/upload">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-[8px] px-[32px] py-[14px] bg-[rgba(30,50,90,0.8)] text-white rounded-full text-[14px] font-semibold hover:bg-[rgba(30,50,90,1)] transition-colors group"
                    >
                      <div className="bg-white/20 p-1 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-[16px] h-[16px] text-white" />
                      </div>
                      开始设计
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

            </div>
          </section>
        </section>

        <section id="features" className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] lg:px-[32px] py-[80px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {[
              { icon: Layers, title: '智能户型分析', desc: 'AI 深度解析你的户型图，识别空间优势与不足，给出专业改造建议。' },
              { icon: Users, title: '家庭规划师', desc: '根据家庭成员结构，规划最适合的功能分区，满足不同阶段生活需求。' },
              { icon: Sparkles, title: 'AI 效果图', desc: '基于你的风格偏好，生成高保真装修效果图，所见即所得。' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-[28px] bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/20 hover:shadow-[0px_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-[72px] h-[72px] mb-[24px] bg-[rgba(30,50,90,0.05)] rounded-[16px] flex items-center justify-center group-hover:bg-[rgba(30,50,90,0.1)] transition-colors">
                  <item.icon className="w-[32px] h-[32px] text-[rgba(30,50,90,0.8)]" />
                </div>
                <h3 className="text-[22px] font-semibold text-[#2D2D2D] mb-[12px]">{item.title}</h3>
                <p className="text-[15px] font-normal text-[#5E6470] opacity-80 leading-[1.6]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] lg:px-[32px] py-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/20 overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-[48px] flex flex-col justify-center">
                <h2 className="text-[32px] font-semibold text-[#2D2D2D] mb-[32px]">
                  为什么选择 HomeGPT？
                </h2>
                <ul className="space-y-[20px]">
                  {[
                    '专注实用功能，拒绝华而不实',
                    '收纳规划专家，空间利用率最大化',
                    '预算合理分配，避免超支陷阱',
                    '家庭成长规划，一步到位',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-[20px]"
                    >
                      <div className="w-[28px] h-[28px] rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#22C55E] text-[14px] font-bold">✓</span>
                      </div>
                      <span className="text-[16px] font-medium text-[#2D2D2D]">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#E5F0FF] to-[#f0f0f0] p-[48px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[64px] md:text-[80px] font-semibold text-[rgba(30,50,90,0.9)] mb-[12px]">87%</div>
                  <div className="text-[16px] font-normal text-[#5E6470] opacity-80">用户满意度</div>
                  <div className="mt-[48px] text-[48px] md:text-[64px] font-semibold text-[#2D2D2D] mb-[12px]">10万+</div>
                  <div className="text-[16px] font-normal text-[#5E6470] opacity-80">成功案例</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="testimonials" className="py-[80px]">
          <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px]">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-[24px] -mx-[16px] md:-mx-[32px] px-[16px] md:px-[32px] hide-scrollbar"
            >
              {[...Array(2)].flatMap((_, setIndex) => [
                <motion.div
                  key={`card1-${setIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[480px] bg-white/60 backdrop-blur-xl rounded-[1.5rem] p-[32px] border border-white/20"
                >
                  <div className="flex items-center gap-[8px] mb-[24px]">
                    <div className="w-[10px] h-[10px] bg-[rgba(30,50,90,0.8)] rounded-full" />
                    <span className="text-[16px] font-semibold text-[#2D2D2D]">汤臣一品</span>
                  </div>
                  <p className="text-[18px] font-normal text-[#5E6470] opacity-80 leading-[1.6] mb-[32px]">
                    "HomeGPT 帮我解决了装修中最头疼的收纳问题，设计师推荐的方案非常实用，住进去后才发现空间利用率提升了很多。"
                  </p>
                  <div className="flex items-center gap-[16px]">
                    <div className="w-[40px] h-[40px] bg-[rgba(30,50,90,0.05)] rounded-full flex items-center justify-center">
                      <Users className="w-[20px] h-[20px] text-[rgba(30,50,90,0.8)]" />
                    </div>
                    <div>
                      <div className="text-[rgba(30,50,90,0.9)] font-semibold">张女士</div>
                      <div className="text-[14px] text-[#5E6470] opacity-60">三口之家，上海</div>
                    </div>
                  </div>
                </motion.div>,
                <motion.div
                  key={`card2-${setIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[480px] bg-white/60 backdrop-blur-xl rounded-[1.5rem] p-[32px] border border-white/20"
                >
                  <div className="flex items-center gap-[8px] mb-[24px]">
                    <div className="w-[10px] h-[10px] bg-[rgba(30,50,90,0.8)] rounded-full" />
                    <span className="text-[16px] font-semibold text-[#2D2D2D]">北京壹号院</span>
                  </div>
                  <p className="text-[18px] font-normal text-[#5E6470] opacity-80 leading-[1.6] mb-[32px]">
                    "预算分配建议非常专业，避免了很多不必要的开支。之前担心超支，现在装修完成后还剩了一些预算买家具。"
                  </p>
                  <div className="flex items-center gap-[16px]">
                    <div className="w-[40px] h-[40px] bg-[rgba(30,50,90,0.05)] rounded-full flex items-center justify-center">
                      <Users className="w-[20px] h-[20px] text-[rgba(30,50,90,0.8)]" />
                    </div>
                    <div>
                      <div className="text-[rgba(30,50,90,0.9)] font-semibold">李先生</div>
                      <div className="text-[14px] text-[#5E6470] opacity-60">新婚夫妻，北京</div>
                    </div>
                  </div>
                </motion.div>,
                <motion.div
                  key={`card3-${setIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[480px] bg-white/60 backdrop-blur-xl rounded-[1.5rem] p-[32px] border border-white/20"
                >
                  <div className="flex items-center gap-[8px] mb-[24px]">
                    <div className="w-[10px] h-[10px] bg-[rgba(30,50,90,0.8)] rounded-full" />
                    <span className="text-[16px] font-semibold text-[#2D2D2D]">深圳湾1号</span>
                  </div>
                  <p className="text-[18px] font-normal text-[#5E6470] opacity-80 leading-[1.6] mb-[32px]">
                    "老房翻新用了 HomeGPT 的方案，AI 给出的户型改造建议让整个空间焕然一新，采光和通风都改善了很多。"
                  </p>
                  <div className="flex items-center gap-[16px]">
                    <div className="w-[40px] h-[40px] bg-[rgba(30,50,90,0.05)] rounded-full flex items-center justify-center">
                      <Users className="w-[20px] h-[20px] text-[rgba(30,50,90,0.8)]" />
                    </div>
                    <div>
                      <div className="text-[rgba(30,50,90,0.9)] font-semibold">王阿姨</div>
                      <div className="text-[14px] text-[#5E6470] opacity-60">三代同堂，深圳</div>
                    </div>
                  </div>
                </motion.div>,
              ])}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-[100px]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f0f0f0] via-[#E5F0FF] to-[#f0f0f0]" />
          <div className="relative max-w-[960px] mx-auto px-[16px] md:px-[32px] text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[32px] md:text-[40px] font-semibold text-[#2D2D2D] mb-[24px]"
            >
              准备好设计你的理想家了吗？
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[16px] md:text-[18px] font-normal text-[#5E6470] opacity-80 mb-[48px] max-w-[560px] mx-auto"
            >
              只需四步，AI 帮你规划未来十年的生活空间
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-[8px] px-[40px] py-[16px] bg-[rgba(30,50,90,0.8)] text-white rounded-full text-[16px] font-semibold hover:bg-[rgba(30,50,90,1)] transition-colors group mx-auto"
                >
                  <div className="bg-white/20 p-1.5 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-[16px] h-[16px] text-white" />
                  </div>
                  上传户型图，开始设计
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer id="about" className="border-t border-[#E5E5EA]">
        <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] lg:px-[32px] py-[32px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[24px] h-[24px] bg-[rgba(30,50,90,0.8)] rounded-[8px] flex items-center justify-center">
                <Home className="w-[14px] h-[14px] text-white" />
              </div>
              <span className="text-[14px] font-semibold text-[#2D2D2D]">HomeGPT</span>
            </div>
            <p className="text-[13px] font-normal text-[#5E6470] opacity-60">
              © 2026 HomeGPT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
