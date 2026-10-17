import React from 'react';

interface AuthIllustrationProps { mode: 'login' | 'register'; }

export const AuthIllustration: React.FC<AuthIllustrationProps> = ({ mode }) => {
  const login = mode === 'login';
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#06452C] via-[#0B5D3B] to-[#063A28]" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#B9D8A6]/10 blur-3xl" />
      <svg viewBox="0 0 720 760" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M0 0H720V430C560 390 380 410 0 470Z" fill="#E8E2D1" opacity=".10" />
        <g opacity=".65">
          <path d="M610 365C620 255 645 195 680 145" stroke="#B9D8A6" strokeWidth="5" fill="none" />
          <ellipse cx="665" cy="175" rx="32" ry="15" fill="#78A66A" transform="rotate(-35 665 175)" />
          <ellipse cx="635" cy="225" rx="34" ry="16" fill="#86B878" transform="rotate(28 635 225)" />
          <ellipse cx="680" cy="265" rx="35" ry="16" fill="#5D915B" transform="rotate(-25 680 265)" />
        </g>
        <text x="58" y="150" fill="#FFF" fontSize="44" fontWeight="700">{login ? 'Hello again!' : 'Welcome!'}</text>
        <text x="60" y="190" fill="#DDEDE4" fontSize="17">{login ? 'Good to see you back.' : 'A fresh start for your finances.'}</text>
        <text x="60" y="216" fill="#DDEDE4" fontSize="17">{login ? 'Let’s continue your journey.' : 'Let’s build better money habits.'}</text>

        <g transform="translate(170 265)">
          <path d="M65 235C72 165 95 135 170 135C245 135 274 173 280 235Z" fill="#0A4D34" />
          <circle cx="178" cy="78" r="61" fill="#E7A77D" />
          <path d="M120 72C119 21 160 5 198 20C229 31 242 55 229 83C213 61 197 55 175 59C155 62 140 74 120 72Z" fill="#302A29" />
          <circle cx="156" cy="84" r="5" fill="#262322" />
          <circle cx="199" cy="84" r="5" fill="#262322" />
          <path d="M168 105C177 111 188 111 196 104" stroke="#8B4E45" strokeWidth="4" fill="none" strokeLinecap="round" />
          {login ? (
            <path d="M86 184C45 170 18 187 5 215" stroke="#E7A77D" strokeWidth="25" strokeLinecap="round" />
          ) : (
            <path d="M226 178C267 162 300 150 322 123" stroke="#E7A77D" strokeWidth="24" strokeLinecap="round" />
          )}
        </g>

        <path d="M0 565H720V760H0Z" fill="#805333" />
        <path d="M0 565H720" stroke="#D6A878" strokeWidth="7" opacity=".45" />

        <g transform="translate(205 500)">
          <rect width="260" height="145" rx="10" fill="#252B29" />
          <rect x="12" y="12" width="236" height="118" rx="5" fill="#183D30" />
          <path d="M55 75H205" stroke="#8FC79B" strokeWidth="8" strokeLinecap="round" opacity=".7" />
          <path d="M80 52H180" stroke="#D9EAD7" strokeWidth="6" strokeLinecap="round" opacity=".7" />
          <path d="M105 98H175" stroke="#E8D7A8" strokeWidth="6" strokeLinecap="round" opacity=".65" />
          <path d="M-35 145H295L270 165H-10Z" fill="#3B403D" />
        </g>

        <g transform="translate(485 390) rotate(5)">
          <rect width="160" height="92" rx="14" fill="#F5F0E2" />
          <text x="18" y="29" fill="#53645B" fontSize="12">FINORA</text>
          <text x="18" y="56" fill="#0B5D3B" fontSize="17" fontWeight="700">{login ? 'Good to see you' : 'Start today'}</text>
          <path d="M18 72H96" stroke="#79A96D" strokeWidth="5" strokeLinecap="round" />
        </g>

        <g transform="translate(38 620) rotate(-4)">
          <rect width="145" height="82" rx="7" fill="#EFE7D4" />
          <path d="M22 24H120M22 42H110M22 60H92" stroke="#65776B" strokeWidth="4" strokeLinecap="round" />
        </g>

        <g transform="translate(545 635)">
          <rect width="70" height="58" rx="12" fill="#EDE5D3" />
          <path d="M70 15C101 13 101 45 70 43" fill="none" stroke="#EDE5D3" strokeWidth="10" />
        </g>
      </svg>

      <div className="absolute bottom-8 left-10 right-10 flex justify-between text-xs text-white/55">
        <span>{login ? 'Your money, already organized.' : 'Small steps. Better financial habits.'}</span>
        <span>Finora</span>
      </div>
    </div>
  );
};
