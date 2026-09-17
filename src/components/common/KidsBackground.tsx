'use client';

import React from 'react';

export default function KidsBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Matahari Tersenyum di Pojok Kanan Atas */}
      <div className="absolute -top-6 -right-6 w-36 h-36 sm:w-48 sm:h-48 opacity-85 animate-float-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Sinar Matahari */}
          <g className="animate-spin-slow origin-center">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="12"
                x2="50"
                y2="4"
                stroke="#FBBF24"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
          </g>
          {/* Lingkaran Wajah Matahari */}
          <circle cx="50" cy="50" r="32" fill="#FCD34D" />
          <circle cx="50" cy="50" r="28" fill="#FBBF24" />
          {/* Pipi Merona */}
          <circle cx="38" cy="55" r="4.5" fill="#F87171" opacity="0.6" />
          <circle cx="62" cy="55" r="4.5" fill="#F87171" opacity="0.6" />
          {/* Mata Ceria */}
          <circle cx="41" cy="46" r="3.2" fill="#1E293B" />
          <circle cx="59" cy="46" r="3.2" fill="#1E293B" />
          <circle cx="42" cy="45" r="1.2" fill="#FFFFFF" />
          <circle cx="60" cy="45" r="1.2" fill="#FFFFFF" />
          {/* Senyum Ramah */}
          <path
            d="M42 54 Q50 63 58 54"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2. Pelangi Manis di Pojok Kiri Atas */}
      <div className="absolute -top-4 -left-8 w-44 h-44 sm:w-56 sm:h-56 opacity-45">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="20" cy="20" r="75" fill="none" stroke="#FCA5A5" strokeWidth="6" opacity="0.8" />
          <circle cx="20" cy="20" r="69" fill="none" stroke="#FDE68A" strokeWidth="6" opacity="0.8" />
          <circle cx="20" cy="20" r="63" fill="none" stroke="#A7F3D0" strokeWidth="6" opacity="0.8" />
          <circle cx="20" cy="20" r="57" fill="none" stroke="#BAE6FD" strokeWidth="6" opacity="0.8" />
          <circle cx="20" cy="20" r="51" fill="none" stroke="#DDD6FE" strokeWidth="6" opacity="0.8" />
        </svg>
      </div>

      {/* 3. Awan Kartun Melayang 1 (Kiri Atas) */}
      <div className="absolute top-12 left-10 sm:left-24 w-32 sm:w-44 opacity-75 animate-float-gentle">
        <svg viewBox="0 0 100 50" className="w-full drop-shadow-sm">
          <path
            d="M20 40 Q10 40 10 30 Q10 20 22 20 Q26 8 40 10 Q54 6 64 16 Q78 14 80 26 Q92 28 88 40 Z"
            fill="#FFFFFF"
          />
          {/* Mata Awan Kecil Lucu */}
          <circle cx="42" cy="25" r="1.8" fill="#94A3B8" />
          <circle cx="56" cy="25" r="1.8" fill="#94A3B8" />
          <path d="M46 29 Q49 33 52 29" fill="none" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 4. Awan Kartun Melayang 2 (Tengah Kanan) */}
      <div className="absolute top-28 right-16 sm:right-40 w-28 sm:w-36 opacity-65 animate-float-slow">
        <svg viewBox="0 0 100 50" className="w-full drop-shadow-sm">
          <path
            d="M18 38 Q10 38 10 28 Q10 18 22 18 Q26 8 38 10 Q50 6 60 15 Q72 13 76 24 Q86 26 84 38 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* 5. Balon Udara Lucu di Sisi Kanan Tengah */}
      <div className="hidden md:block absolute top-64 right-8 w-20 opacity-60 animate-float-gentle">
        <svg viewBox="0 0 60 90" className="w-full drop-shadow-sm">
          {/* Balon belang-belang */}
          <ellipse cx="30" cy="32" rx="24" ry="28" fill="#F472B6" />
          <path d="M18 10 C24 20 24 44 18 54 C16 44 16 20 18 10 Z" fill="#FBBF24" />
          <path d="M42 10 C36 20 36 44 42 54 C44 44 44 20 42 10 Z" fill="#38BDF8" />
          {/* Tali & Keranjang */}
          <line x1="22" y1="58" x2="25" y2="70" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="38" y1="58" x2="35" y2="70" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="23" y="70" width="14" height="10" rx="2" fill="#D97706" />
        </svg>
      </div>

      {/* 6. Pesawat Kertas Ceria di Kiri Tengah */}
      <div className="hidden sm:block absolute top-96 left-6 w-14 opacity-40 animate-float-slow transform -rotate-12">
        <svg viewBox="0 0 50 40" className="w-full">
          <polygon points="5,35 45,20 15,15" fill="#38BDF8" />
          <polygon points="15,15 45,20 25,25" fill="#0284C7" />
          <polygon points="25,25 45,20 22,33" fill="#BAE6FD" />
        </svg>
      </div>

      {/* 7. Bintang-Bintang Pastel Berkilau di Latar Belakang */}
      {/* Bintang 1 (Kiri) */}
      <div className="absolute top-44 left-1/4 text-amber-300 opacity-60 animate-twinkle text-xl">
        ⭐
      </div>
      {/* Bintang 2 (Kanan) */}
      <div className="absolute top-72 right-1/4 text-yellow-300 opacity-55 animate-twinkle-delay text-base">
        ✨
      </div>
      {/* Bintang 3 (Tengah) */}
      <div className="absolute top-[480px] left-12 text-pink-300 opacity-50 animate-twinkle text-lg">
        ⭐
      </div>
      {/* Bintang 4 (Kanan Bawah) */}
      <div className="absolute top-[600px] right-16 text-sky-300 opacity-55 animate-twinkle-delay text-xl">
        ✨
      </div>
      {/* Bintang 5 */}
      <div className="absolute top-[780px] left-1/3 text-amber-200 opacity-45 animate-twinkle text-sm">
        ⭐
      </div>

      {/* 8. Ikon Edukasi Doodle Halus (Buku, Pensil, Balok) */}
      <div className="hidden lg:block absolute top-[380px] right-10 text-3xl opacity-25 transform rotate-12">
        📖
      </div>
      <div className="hidden lg:block absolute top-[520px] left-8 text-3xl opacity-25 transform -rotate-12">
        ✏️
      </div>
      <div className="hidden lg:block absolute top-[700px] right-8 text-3xl opacity-20 transform rotate-6">
        🎨
      </div>
      <div className="hidden lg:block absolute top-[850px] left-10 text-3xl opacity-20 transform -rotate-6">
        🧩
      </div>

      {/* 9. Bukit Hijau Bergelombang Lembut di Bagian Bawah */}
      <div className="absolute -bottom-1 left-0 right-0 h-32 sm:h-44 opacity-25">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
          {/* Bukit Belakang */}
          <path
            d="M0,100 C150,40 350,140 500,80 C650,20 850,120 1000,60 C1100,20 1180,60 1200,80 L1200,200 L0,200 Z"
            fill="#86EFAC"
          />
          {/* Bukit Depan */}
          <path
            d="M0,130 C200,80 400,160 600,110 C800,60 1000,140 1200,90 L1200,200 L0,200 Z"
            fill="#4ADE80"
          />
          {/* Bunga-Bunga Kecil di Bukit */}
          <circle cx="120" cy="150" r="4" fill="#F43F5E" />
          <circle cx="340" cy="165" r="4" fill="#F59E0B" />
          <circle cx="580" cy="140" r="4" fill="#EC4899" />
          <circle cx="820" cy="155" r="4" fill="#6366F1" />
          <circle cx="1040" cy="135" r="4" fill="#F59E0B" />
        </svg>
      </div>
    </div>
  );
}
