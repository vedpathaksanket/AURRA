import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreCollection: (category?: string) => void;
  onOpenStylist: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCollection, onOpenStylist }) => {
  return (
    <section className="relative overflow-hidden bg-[#F7F4EE] border-b border-[#E8E2D7]">
      {/* Premium Horological Atelier Background Image with Measured Ivory Scrim */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/hero_luxury_watch_bg_1793349055849.jpg"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 scale-105 filter brightness-105 contrast-95"
        />
        {/* Scrims to preserve WCAG AA contrast on text over warm ivory field */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F4EE] via-[#F7F4EE]/85 to-[#F7F4EE]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F4EE] via-transparent to-[#F7F4EE]/60" />
      </div>

      {/* Background ambient warm champagne glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C6A66B]/15 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Brand Statement & Editorial Typography */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left py-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#997A40]">
              <span>Horological Excellence</span>
              <span aria-hidden="true">·</span>
              <span>Direct From Atelier</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#111111] leading-[1.1] tracking-tight">
              Timeless design.<br />
              <span className="italic font-normal text-[#303030]">Crafted for every day.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#555555] max-w-xl font-light leading-relaxed">
              Discover distinctive timepieces combining surgical 316L steel, sapphire crystals, and precision Japanese calibers — with honest, transparent pricing and zero luxury markups.
            </p>

            {/* Micro-proof points: Clean, unboxed text */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#777777] pt-1">
              <span>Solid 316L Surgical Steel</span>
              <span aria-hidden="true">·</span>
              <span>Anti-Reflective Sapphire</span>
              <span aria-hidden="true">·</span>
              <span>2-Year Movement Warranty</span>
            </div>

            {/* Action Buttons: Black for primary buttons, White for secondary */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onExploreCollection('All')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#111111] hover:bg-[#303030] text-[#FFFFFF] text-xs font-semibold tracking-wider uppercase rounded-md transition-all shadow-md cursor-pointer"
              >
                <span>Explore Timepieces</span>
                <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
              </button>

              <button
                onClick={onOpenStylist}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#FFFFFF] hover:bg-[#F7F4EE] text-[#111111] hover:text-[#997A40] text-xs font-semibold tracking-wider uppercase rounded-md border border-[#E8E2D7] hover:border-[#C6A66B] transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Consult Stylist</span>
              </button>
            </div>

            {/* Quick Segment Jump */}
            <div className="pt-2 flex items-center gap-3 text-xs text-[#777777]">
              <span>Quick View:</span>
              <button
                onClick={() => onExploreCollection('Men')}
                className="text-[#171717] hover:text-[#C6A66B] underline underline-offset-4 cursor-pointer font-medium"
              >
                Men's Line
              </button>
              <span>·</span>
              <button
                onClick={() => onExploreCollection('Women')}
                className="text-[#171717] hover:text-[#C6A66B] underline underline-offset-4 cursor-pointer font-medium"
              >
                Women's Line
              </button>
              <span>·</span>
              <button
                onClick={() => onExploreCollection('Automatic')}
                className="text-[#171717] hover:text-[#C6A66B] underline underline-offset-4 cursor-pointer font-medium"
              >
                Automatic Mechanical
              </button>
            </div>
          </div>

          {/* Right Column: Hero Watch Focal Showcase - Pure White Card in Ivory Canvas */}
          <div className="lg:col-span-6 relative flex flex-col h-full w-full">
            <div className="relative w-full h-full min-h-[400px] sm:min-h-[460px] lg:min-h-[520px] group">
              {/* Outer hairline framing - full width & height */}
              <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#E8E2D7] shadow-xl transition-all duration-500 hover:border-[#C6A66B]/60 hover:shadow-2xl">
                <img
                  src="/src/assets/images/aurra_hero_chronograph_1793347856312.jpg"
                  alt="AURRA Chrono Royale 42mm in Obsidian Black and Champagne Gold"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center block transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle scrim for product callout */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8 text-left">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold tracking-widest uppercase text-[#C6A66B]">
                      Flagship Chronograph
                    </div>
                    <div className="text-2xl sm:text-3xl font-serif text-[#FFFFFF]">
                      AURRA Chrono Royale 42mm
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl font-bold text-[#FFFFFF] tabular-nums">₹4,499</span>
                        <span className="text-xs text-[#BBBBBB] line-through tabular-nums">₹7,999</span>
                        <span className="text-xs text-[#111111] font-semibold bg-[#C6A66B] px-2 py-0.5 rounded">
                          Save 43%
                        </span>
                      </div>
                      <button
                        onClick={() => onExploreCollection('Chronograph')}
                        className="text-xs font-semibold tracking-wider text-[#FFFFFF] hover:text-[#C6A66B] flex items-center gap-1.5 cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-md border border-white/20"
                      >
                        <span>Specifications</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Quality Floating Badge */}
              <div className="absolute -bottom-3 -left-3 hidden sm:flex items-center gap-3 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E8E2D7] px-4 py-2.5 rounded-lg shadow-xl text-left">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C6A66B]"></div>
                <div>
                  <div className="text-[11px] font-semibold text-[#111111]">Miyota 60-Min Caliber</div>
                  <div className="text-[10px] text-[#777777]">Chronograph ±15s/mo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
