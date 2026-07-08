'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Home, Users, Layers, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FFFFFF] font-[Inter,system-ui,-apple-system,sans-serif]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-[1440px] mx-auto px-[32px] md:px-[32px] lg:px-[32px] h-[90px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-[12px]">
            <div className="w-[32px] h-[32px] bg-[#0000EE] rounded-[8px] flex items-center justify-center">
              <Home className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[18px] font-semibold text-[#020617]">HomeGPT</span>
          </Link>
          <nav className="hidden md:flex items-center gap-[8px]">
            <Link href="#features" className="text-[14px] font-normal text-[#374151] hover:text-[#0000EE] px-[16px] py-[8px] transition-colors">
              功能介绍
            </Link>
            <Link href="#testimonials" className="text-[14px] font-normal text-[#374151] hover:text-[#0000EE] px-[16px] py-[8px] transition-colors">
              使用案例
            </Link>
            <Link href="#about" className="text-[14px] font-normal text-[#374151] hover:text-[#0000EE] px-[16px] py-[8px] transition-colors">
              关于我们
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-[90px]">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E5F0FF] via-[#FFFFFF] to-[#FFFFFF]" />
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,238,0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative max-w-[1440px] mx-auto px-[16px] md:px-[32px] lg:px-[32px] py-[100px] md:py-[120px] text-center">
            <div className="mb-[32px]">
              <span className="inline-flex items-center px-[12px] py-[4px] bg-[rgba(0,0,238,0.1)] text-[#0000EE] rounded-full text-[12px] font-semibold">
                AI Agent 驱动
              </span>
            </div>
            <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-bold text-[#020617] mb-[32px] leading-[1.05]">
              设计你<span className="text-[#0000EE]">未来想要</span>的生活
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#374151] max-w-[640px] mx-auto mb-[48px] leading-[1.6]">
              上传户型图，AI 告诉你这个家应该怎么设计。<br className="hidden md:block" />减少装修后悔，提升居住幸福感。
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-[8px] px-[32px] py-[14px] bg-[#0000EE] text-white rounded-full text-[14px] font-semibold hover:bg-[#145AFF] hover:shadow-[0px_8px_24px_rgba(0,0,238,0.3)] transition-all duration-200"
            >
              开始设计
              <ArrowRight className="w-[18px] h-[18px]" />
            </Link>
          </div>
        </section>

        <section id="features" className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] lg:px-[32px] py-[80px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            <div className="group p-[28px] bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] hover:border-[#0000EE] hover:shadow-[0px_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div className="w-[72px] h-[72px] mb-[24px] bg-[rgba(0,0,238,0.08)] rounded-[16px] flex items-center justify-center group-hover:bg-[rgba(0,0,238,0.15)] transition-colors">
                <Layers className="w-[32px] h-[32px] text-[#0000EE]" />
              </div>
              <h3 className="text-[22px] font-semibold text-[#020617] mb-[12px]">智能户型分析</h3>
              <p className="text-[15px] font-normal text-[#696A72] leading-[1.6]">
                AI 深度解析你的户型图，识别空间优势与不足，给出专业改造建议。
              </p>
            </div>
            <div className="group p-[28px] bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] hover:border-[#0000EE] hover:shadow-[0px_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div className="w-[72px] h-[72px] mb-[24px] bg-[rgba(0,0,238,0.08)] rounded-[16px] flex items-center justify-center group-hover:bg-[rgba(0,0,238,0.15)] transition-colors">
                <Users className="w-[32px] h-[32px] text-[#0000EE]" />
              </div>
              <h3 className="text-[22px] font-semibold text-[#020617] mb-[12px]">家庭规划师</h3>
              <p className="text-[15px] font-normal text-[#696A72] leading-[1.6]">
                根据家庭成员结构，规划最适合的功能分区，满足不同阶段生活需求。
              </p>
            </div>
            <div className="group p-[28px] bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] hover:border-[#0000EE] hover:shadow-[0px_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div className="w-[72px] h-[72px] mb-[24px] bg-[rgba(0,0,238,0.08)] rounded-[16px] flex items-center justify-center group-hover:bg-[rgba(0,0,238,0.15)] transition-colors">
                <Sparkles className="w-[32px] h-[32px] text-[#0000EE]" />
              </div>
              <h3 className="text-[22px] font-semibold text-[#020617] mb-[12px]">AI 效果图</h3>
              <p className="text-[15px] font-normal text-[#696A72] leading-[1.6]">
                基于你的风格偏好，生成高保真装修效果图，所见即所得。
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] lg:px-[32px] py-[80px]">
          <div className="bg-[#FFFFFF] rounded-[24px] border border-[#E5E7EB] shadow-[0px_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-[48px] flex flex-col justify-center">
                <h2 className="text-[32px] font-bold text-[#020617] mb-[32px]">
                  为什么选择 HomeGPT？
                </h2>
                <ul className="space-y-[20px]">
                  <li className="flex items-start gap-[20px]">
                    <div className="w-[28px] h-[28px] rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#22C55E] text-[14px] font-bold">✓</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#020617]">专注实用功能，拒绝华而不实</span>
                  </li>
                  <li className="flex items-start gap-[20px]">
                    <div className="w-[28px] h-[28px] rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#22C55E] text-[14px] font-bold">✓</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#020617]">收纳规划专家，空间利用率最大化</span>
                  </li>
                  <li className="flex items-start gap-[20px]">
                    <div className="w-[28px] h-[28px] rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#22C55E] text-[14px] font-bold">✓</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#020617]">预算合理分配，避免超支陷阱</span>
                  </li>
                  <li className="flex items-start gap-[20px]">
                    <div className="w-[28px] h-[28px] rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#22C55E] text-[14px] font-bold">✓</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#020617]">家庭成长规划，一步到位</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#E5F0FF] to-[#FFFFFF] p-[48px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[64px] md:text-[80px] font-bold text-[#0000EE] mb-[12px]">87%</div>
                  <div className="text-[16px] font-normal text-[#696A72]">用户满意度</div>
                  <div className="mt-[48px] text-[48px] md:text-[64px] font-bold text-[#020617] mb-[12px]">10万+</div>
                  <div className="text-[16px] font-normal text-[#696A72]">成功案例</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-[#F8FAFC] py-[80px]">
          <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px]">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-[24px] -mx-[16px] md:-mx-[32px] px-[16px] md:px-[32px] hide-scrollbar"
            >
              {[...Array(2)].flatMap((_, setIndex) => [
                <div key={`card1-${setIndex}`} className="flex-shrink-0 w-[480px] bg-[#FFFFFF] rounded-[20px] p-[32px] shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-[8px] mb-[24px]">
                    <div className="w-[10px] h-[10px] bg-[#0000EE] rounded-full" />
                    <span className="text-[16px] font-semibold text-[#020617]">汤臣一品</span>
                  </div>
                  <p className="text-[18px] font-normal text-[#374151] leading-[1.6] mb-[32px]">
                    "HomeGPT 帮我解决了装修中最头疼的收纳问题，设计师推荐的方案非常实用，住进去后才发现空间利用率提升了很多。"
                  </p>
                  <div className="flex items-center gap-[16px]">
                    <div className="w-[40px] h-[40px] bg-[#E5F0FF] rounded-full flex items-center justify-center">
                      <Users className="w-[20px] h-[20px] text-[#0000EE]" />
                    </div>
                    <div>
                      <div className="text-[#0000EE] font-semibold">张女士</div>
                      <div className="text-[14px] text-[#696A72]">三口之家，上海</div>
                    </div>
                  </div>
                </div>,
                <div key={`card2-${setIndex}`} className="flex-shrink-0 w-[480px] bg-[#FFFFFF] rounded-[20px] p-[32px] shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-[8px] mb-[24px]">
                    <div className="w-[10px] h-[10px] bg-[#0000EE] rounded-full" />
                    <span className="text-[16px] font-semibold text-[#020617]">北京壹号院</span>
                  </div>
                  <p className="text-[18px] font-normal text-[#374151] leading-[1.6] mb-[32px]">
                    "预算分配建议非常专业，避免了很多不必要的开支。之前担心超支，现在装修完成后还剩了一些预算买家具。"
                  </p>
                  <div className="flex items-center gap-[16px]">
                    <div className="w-[40px] h-[40px] bg-[#E5F0FF] rounded-full flex items-center justify-center">
                      <Users className="w-[20px] h-[20px] text-[#0000EE]" />
                    </div>
                    <div>
                      <div className="text-[#0000EE] font-semibold">李先生</div>
                      <div className="text-[14px] text-[#696A72]">新婚夫妻，北京</div>
                    </div>
                  </div>
                </div>,
                <div key={`card3-${setIndex}`} className="flex-shrink-0 w-[480px] bg-[#FFFFFF] rounded-[20px] p-[32px] shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-[8px] mb-[24px]">
                    <div className="w-[10px] h-[10px] bg-[#0000EE] rounded-full" />
                    <span className="text-[16px] font-semibold text-[#020617]">深圳湾1号</span>
                  </div>
                  <p className="text-[18px] font-normal text-[#374151] leading-[1.6] mb-[32px]">
                    "老房翻新用了 HomeGPT 的方案，AI 给出的户型改造建议让整个空间焕然一新，采光和通风都改善了很多。"
                  </p>
                  <div className="flex items-center gap-[16px]">
                    <div className="w-[40px] h-[40px] bg-[#E5F0FF] rounded-full flex items-center justify-center">
                      <Users className="w-[20px] h-[20px] text-[#0000EE]" />
                    </div>
                    <div>
                      <div className="text-[#0000EE] font-semibold">王阿姨</div>
                      <div className="text-[14px] text-[#696A72]">三代同堂，深圳</div>
                    </div>
                  </div>
                </div>,
              ])}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-[100px]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#E5F0FF] to-[#FFFFFF]" />
          <div className="relative max-w-[960px] mx-auto px-[16px] md:px-[32px] text-center">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#020617] mb-[24px]">
              准备好设计你的理想家了吗？
            </h2>
            <p className="text-[16px] md:text-[18px] font-normal text-[#696A72] mb-[48px] max-w-[560px] mx-auto">
              只需四步，AI 帮你规划未来十年的生活空间
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-[8px] px-[40px] py-[16px] bg-[#0000EE] text-white rounded-full text-[16px] font-semibold hover:bg-[#145AFF] hover:shadow-[0px_8px_24px_rgba(0,0,238,0.3)] transition-all duration-200"
            >
              上传户型图，开始设计
              <ArrowRight className="w-[18px] h-[18px]" />
            </Link>
          </div>
        </section>
      </main>

      <footer id="about" className="border-t border-[#E5E7EB] bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] lg:px-[32px] py-[32px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[24px] h-[24px] bg-[#0000EE] rounded-[8px] flex items-center justify-center">
                <Home className="w-[14px] h-[14px] text-white" />
              </div>
              <span className="text-[14px] font-semibold text-[#020617]">HomeGPT</span>
            </div>
            <p className="text-[13px] font-normal text-[#696A72]">
              © 2026 HomeGPT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}