import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// LANGUAGE DICTIONARY (i18n)
// ============================================
const contentLocales = {
  id: {
    nav: { manifesto: 'Manifesto', layanan: 'Layanan', about: 'Tentang', partnership: 'Kemitraan', work: 'Karya', team: 'Tim', doktrin: 'Doktrin', faq: 'FAQ', kontak: 'Kontak', btnClose: 'Tutup', btnMenu: 'Menu' },
    hero: {
      badgePrefix: 'KONSULTASI TANPA BIAYA',
      badgeSuffix: 'SAMPAI PROBLEM TERPECAHKAN',
      sub1: 'Agency Manifesto',
      sub2: 'AI & Digital Transformation — From Bali to the World',
      title1: 'Berhenti terhambat oleh ',
      title1_i: 'pekerjaan repetitif.',
      title2: 'Skalakan bisnis Anda 10x lipat dengan ',
      title2_i: 'ekosistem AI otonom.',
      p1: 'Kami membangun infrastruktur kecerdasan buatan yang mengambil alih 98% beban operasional manual Anda. Saatnya beralih dari sistem yang lambat ke arsitektur cerdas yang memecahkan masalah bahkan saat Anda tidur.',
      boxTitle: 'Dibangun di Bali. Berstandar Global.',
      boxDesc: 'Menghadirkan teknologi level-korporasi untuk skala bisnis Anda.'
    },
    marquee: ['INTELLIGENCE AUGMENTED', 'OTOMASI BISNIS', 'ARSITEKTUR AI', 'SKALABILITAS DIGITAL'],
    stats: [
      { num: '98%', label: 'Tingkat Otomasi', desc: 'Mengurangi intervensi manual pada operasional repetitif bisnis Anda.' },
      { num: '24/7', label: 'Otonomi Sistem', desc: 'Arsitektur AI yang bekerja tanpa henti lintas zona waktu secara mandiri.' },
      { num: '10x', label: 'Potensi Skala', desc: 'Infrastruktur modern yang siap menampung lonjakan pertumbuhan instan.' }
    ],
    layanan: {
      t1: 'Metodologi ', t1_i: 'Cerdas.',
      d1: 'Pendekatan berbasis data dan kecerdasan buatan untuk memastikan skalabilitas tanpa batas.',
      list1: [
        { num: '01', title: 'Analisis Bottleneck', desc: 'Kami membedah operasional bisnis Anda untuk menemukan proses manual yang memperlambat pertumbuhan.' },
        { num: '02', title: 'Integrasi Agen AI', desc: 'Kami merancang dan menanamkan asisten virtual kustom yang secara spesifik mengambil alih beban kerja repetitif Anda.' },
        { num: '03', title: 'Skalabilitas Otonom', desc: 'Sistem Anda kini berjalan 24/7. Anda siap menangani lonjakan kapasitas 10x lipat tanpa menambah karyawan operasional.' }
      ],
      t2: 'Katalog ', t2_i: 'Modernisasi.',
      d2: 'Solusi deep-tech presisi untuk mengubah operasional manual menjadi ekosistem digital otonom.',
      list2: [
        { id: 'AI_01', title: 'Pengembangan Aplikasi AI', desc: 'Membangun perangkat lunak dan sistem web kustom yang ditenagai kecerdasan buatan untuk memproses data secara instan dan akurat.' },
        { id: 'AI_02', title: 'Otomasi Workflow', desc: 'Mengimplementasikan agen AI dan LLM untuk mengambil alih layanan pelanggan, manajemen CRM, dan tugas administratif 24/7.' },
        { id: 'AI_03', title: 'Modernisasi Sistem Legacy', desc: 'Membersihkan utang teknis dan meng-upgrade infrastruktur lama Anda agar siap terintegrasi dengan teknologi AI terbaru.' },
        { id: 'AI_04', title: 'UI/UX Konversi Tinggi', desc: 'Merancang antarmuka pengguna yang adaptif dan berbasis data untuk memaksimalkan kepuasan pelanggan.' },
        { id: 'AI_05', title: 'Infrastruktur & Keamanan', desc: 'Memastikan server cloud, aset web, dan data bisnis Anda selalu online, berkinerja tinggi, dan terlindungi.' },
        { id: '3D_01', title: '3D Modeling & Printing', desc: 'Digital pabrikasi tingkat tinggi. Kami mendesain dan mencetak objek 3D dengan tingkat presisi rekayasa (engineering-grade) serta finishing yang sempurna untuk maket dan miniatur estetik.' }
      ]
    },
    about: {
      t1: 'Tentang ', t1_i: 'Kami.',
      p1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      p2: 'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.'
    },
    partnership: {
      t1: 'Program ', t1_i: 'Kemitraan.',
      d1: 'Membangun ekosistem bersama untuk masa depan digital.',
      items: [
        { title: 'Aliansi Teknologi', desc: 'Berkolaborasi dengan penyedia infrastruktur untuk integrasi deep-tech.' },
        { title: 'Partner Strategis', desc: 'Menghubungkan inovasi Bali dengan jaringan bisnis global.' },
        { title: 'Inkubator Startup', desc: 'Memberdayakan pendiri baru dengan infrastruktur AI otonom.' }
      ]
    },
    work: {
      t1: 'Karya ', t1_i: 'Terpilih.',
      d1: 'Rekam jejak transformasi digital dan rekayasa fisik kami.',
      items: [
        { title: 'Sistem Logistik Otonom', tags: ['AI', 'Otomasi'], desc: 'Mengurangi intervensi manual sebesar 85% untuk distributor regional.' },
        { title: 'Prototipe Medis 3D', tags: ['3D Printing', 'Engineering'], desc: 'Rekayasa fisik tingkat tinggi dengan presisi mikron.' },
        { title: 'Dashboard Intelijen Bisnis', tags: ['Deep Learning', 'UI/UX'], desc: 'Visualisasi data real-time untuk pengambilan keputusan strategis.' }
      ]
    },
    team: {
      t1: 'Tim ', t1_i: 'Inti.',
      d1: 'Para arsitek di balik setiap baris kode dan setiap cetakan fisik.',
      members: [
        {
          name: 'Ari',
          role: 'Lead Architect / Founder',
          bio: 'Penggemar teknologi mendalam dengan lebih dari 10 tahun pengalaman dalam infrastruktur AI.',
          experience: {
            role: 'AI Solutions Architect',
            work: 'Mengembangkan agen perdagangan otonom dan sistem manajemen cloud.',
            achievements: 'Meningkatkan efisiensi operasional klien sebesar 500% melalui otomatisasi cerdas.'
          },
          portfolio: 'https://ari.dev',
          ig: '@ari_dgtlz'
        },
        {
          name: 'Made',
          role: '3D Fabrication Specialist',
          bio: 'Pakar transformasi dari dunia digital ke fisik melalui rekayasa presisi.',
          experience: {
            role: 'Lead 3D Engineer',
            work: 'Merancang dan mencetak prototipe medis tingkat tinggi.',
            achievements: 'Menerima Excellence Award pada Bali Tech Expo 2024.'
          },
          portfolio: 'https://made.design',
          ig: '@made_3d'
        },
        {
          name: 'Dwi',
          role: 'UI/UX Strategist',
          bio: 'Merancang pengalaman digital dengan fokus pada konversi tinggi dan estetika fungsional.',
          experience: {
            role: 'Senior Product Designer',
            work: 'Membangun ekosistem e-commerce untuk brand global.',
            achievements: 'Pemenang Redot Design Award 2025.'
          },
          portfolio: 'https://dwi.ui',
          ig: '@dwi_ux'
        },
        {
          name: 'Ganesh',
          role: 'Full-Stack Developer',
          bio: 'Menjembatani kesenjangan antara estetika front-end dan logika back-end yang kompleks.',
          experience: {
            role: 'Senior Software Engineer',
            work: 'Arsitektur SaaS yang skalabel dan integrasi LLM kustom.',
            achievements: 'Kontributor utama pada beberapa pustaka open-source AI populer.'
          },
          portfolio: 'https://ganesh.code',
          ig: '@ganesh_dev'
        }
      ]
    },
    doktrin: {
      t1: 'Doktrin ', t1_i: 'Agensi.',
      d1: 'Prinsip tak tergoyahkan yang memandu setiap keputusan desain dan arsitektur yang kami buat.',
      items: [
        'Standar Global, Eksekusi Presisi. Bisnis lokal Anda memiliki kapasitas untuk mendominasi pasar melalui efisiensi AI.',
        'AI Sebagai Mesin ROI. Kami tidak menjual hype. Kami mengukur keberhasilan dari jam kerja yang dihemat dan lonjakan produktivitas Anda.',
        'Solusi Kustom, Bukan Templat. Setiap agen AI kami rancang secara spesifik untuk memahami konteks dan masalah unik bisnis Anda.',
        'Otomasi yang Memanusiakan. Sistem kami mengambil alih pekerjaan robotik, sehingga tim Anda bisa kembali berinovasi.',
        'Rekayasa Masa Depan dari Bali. Kami membangun infrastruktur digital berstandar dunia untuk efisiensi tanpa batas.'
      ]
    },
    faq: {
      t1: 'Pertanyaan ', t1_i: 'Umum.',
      items: [
        { q: 'Apakah AI cocok untuk bisnis lokal yang masih berkembang?', a: 'Ya. Justru AI berfungsi meratakan lapangan bermain. Sistem cerdas kami mengambil alih pekerjaan operasional agar Anda bisa fokus pada strategi.' },
        { q: 'Apakah DGT_LZ juga mengurus operasional IT sehari-hari?', a: 'Tentu. Melalui layanan Manajemen Ekosistem Internet, kami mengelola server, menjaga keamanan aset digital, dan memastikan web Anda selalu optimal.' },
        { q: 'Berapa lama waktu implementasi MVP?', a: 'Audit dan diagnosa memakan waktu 1-2 minggu, sementara implementasi MVP berkisar antara 4 hingga 8 minggu tergantung kompleksitas legacy sistem.' }
      ]
    },
    kontak: {
      t1: 'Mulai ', t1_i: 'Transformasi.',
      d1: 'Berhenti membuang waktu dan biaya untuk masalah yang bisa diselesaikan oleh sistem. Mari bangun infrastruktur otonom untuk bisnis Anda.',
      f1: 'Nama / Entitas Bisnis', p1: 'Ketik nama Anda di sini...',
      f2: 'Jalur Transmisi', p2: 'Bagaimana kami bisa menghubungi Anda kembali?',
      f3: 'Objektif Transformasi', p3: 'Apa yang ingin Anda selesaikan dengan AI?',
      btn: 'Dapatkan Blueprint AI',
      h1: 'Markas Operasional', a1_1: 'Denpasar, Bali', a1_2: 'Indonesia 80111',
      h2: 'Transmisi Langsung'
    }
  },
  en: {
    nav: { manifesto: 'Manifesto', layanan: 'Services', about: 'About', partnership: 'Partnership', work: 'Work', team: 'Team', doktrin: 'Doctrine', faq: 'FAQ', kontak: 'Contact', btnClose: 'Close', btnMenu: 'Menu' },
    hero: {
      badgePrefix: 'ZERO-COST CONSULTATION',
      badgeSuffix: 'UNTIL YOUR PROBLEM IS SOLVED',
      sub1: 'Agency Manifesto',
      sub2: 'AI & Digital Transformation — From Bali to the World',
      title1: 'Stop being bottlenecked by ',
      title1_i: 'manual workflows.',
      title2: 'Scale your business 10x with ',
      title2_i: 'autonomous AI ecosystems.',
      p1: 'We build artificial intelligence infrastructure that takes over 98% of your manual operational load. It is time to transition from slow human-centric systems to intelligent architecture that solves problems even while you sleep.',
      boxTitle: 'Built in Bali. Global Standards.',
      boxDesc: 'Delivering enterprise-grade technology to scale your business unhindered.'
    },
    marquee: ['INTELLIGENCE AUGMENTED', 'BUSINESS AUTOMATION', 'AI ARCHITECTURE', 'DIGITAL SCALABILITY'],
    stats: [
      { num: '98%', label: 'Automation Rate', desc: 'Drastically reducing manual intervention across your repetitive business operations.' },
      { num: '24/7', label: 'System Autonomy', desc: 'AI architecture that works relentlessly across all timezones without friction.' },
      { num: '10x', label: 'Scaling Potential', desc: 'Modern infrastructure prepared to handle instant massive growth surges.' }
    ],
    layanan: {
      t1: 'Intelligent ', t1_i: 'Methodology.',
      d1: 'Data-driven and AI-powered approaches designed to ensure limitless scalability.',
      list1: [
        { num: '01', title: 'Bottleneck Analysis', desc: 'We dissect your business operations to find the exact manual choke-points slowing down your growth.' },
        { num: '02', title: 'AI Agent Integration', desc: 'We design and embed custom virtual assistants specifically crafted to take over your repetitive workloads.' },
        { num: '03', title: 'Autonomous Scalability', desc: 'Your system now runs 24/7. You are equipped to handle a 10x capacity surge without hiring new operational staff.' }
      ],
      t2: 'Modernization ', t2_i: 'Catalog.',
      d2: 'Precision deep-tech solutions to transform your manual operations into autonomous digital ecosystems.',
      list2: [
        { id: 'AI_01', title: 'AI Application Development', desc: 'Building custom software and web systems powered by artificial intelligence to process data instantly and accurately.' },
        { id: 'AI_02', title: 'Workflow Automation', desc: 'Deploying custom AI agents and LLMs to take over customer service, CRM management, and 24/7 administrative tasks.' },
        { id: 'AI_03', title: 'Legacy System Modernization', desc: 'Clearing technical debt and upgrading your outdated infrastructure so it is ready to integrate with the latest AI technology.' },
        { id: 'AI_04', title: 'High-Conversion UI/UX', desc: 'Designing adaptive, data-driven user interfaces to maximize customer satisfaction and conversion rates.' },
        { id: 'AI_05', title: 'Infrastructure & Security', desc: 'Ensuring your cloud servers, web assets, and business data are always online, high-performing, and protected.' },
        { id: '3D_01', title: '3D Modeling & Printing', desc: 'High-end digital fabrication. We design and print 3D objects with engineering-grade precision and flawless finishing for aesthetic mockups and miniatures.' }
      ]
    },
    about: {
      t1: 'About ', t1_i: 'Us.',
      p1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      p2: 'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.'
    },
    partnership: {
      t1: 'Partnership ', t1_i: 'Program.',
      d1: 'Building a shared ecosystem for the digital future.',
      items: [
        { title: 'Tech Alliance', desc: 'Collaborating with infrastructure providers for deep-tech integration.' },
        { title: 'Strategic Partners', desc: 'Connecting Bali innovation with global business networks.' },
        { title: 'Startup Incubator', desc: 'Empowering new founders with autonomous AI infrastructure.' }
      ]
    },
    work: {
      t1: 'Selected ', t1_i: 'Work.',
      d1: 'Our track record of digital transformation and physical engineering.',
      items: [
        { title: 'Autonomous Logistics System', tags: ['AI', 'Automation'], desc: 'Reduced manual intervention by 85% for regional distributors.' },
        { title: 'Medical 3D Prototypes', tags: ['3D Printing', 'Engineering'], desc: 'High-end physical engineering with micron-level precision.' },
        { title: 'Business Intelligence Dashboard', tags: ['Deep Learning', 'UI/UX'], desc: 'Real-time data visualization for strategic decision making.' }
      ]
    },
    team: {
      t1: 'Core ', t1_i: 'Team.',
      d1: 'The architects behind every line of code and every physical print.',
      members: [
        {
          name: 'Ari',
          role: 'Lead Architect / Founder',
          bio: 'Deep tech enthusiast with over 10 years of experience in AI infrastructure.',
          experience: {
            role: 'AI Solutions Architect',
            work: 'Developed autonomous trading agents and cloud management systems.',
            achievements: 'Increased client operational efficiency by 500% through intelligent automation.'
          },
          portfolio: 'https://ari.dev',
          ig: '@ari_dgtlz'
        },
        {
          name: 'Made',
          role: '3D Fabrication Specialist',
          bio: 'Expert in transforming the digital world to physical through precision engineering.',
          experience: {
            role: 'Lead 3D Engineer',
            work: 'Designed and printed high-end medical prototypes.',
            achievements: 'Received Excellence Award at Bali Tech Expo 2024.'
          },
          portfolio: 'https://made.design',
          ig: '@made_3d'
        },
        {
          name: 'Dwi',
          role: 'UI/UX Strategist',
          bio: 'Designing digital experiences with a focus on high conversion and functional aesthetics.',
          experience: {
            role: 'Senior Product Designer',
            work: 'Built e-commerce ecosystems for global brands.',
            achievements: 'Winner of Redot Design Award 2025.'
          },
          portfolio: 'https://dwi.ui',
          ig: '@dwi_ux'
        },
        {
          name: 'Ganesh',
          role: 'Full-Stack Developer',
          bio: 'Bridging the gap between front-end aesthetics and complex back-end logic.',
          experience: {
            role: 'Senior Software Engineer',
            work: 'Scalable SaaS architecture and custom LLM integrations.',
            achievements: 'Key contributor to several popular AI open-source libraries.'
          },
          portfolio: 'https://ganesh.code',
          ig: '@ganesh_dev'
        }
      ]
    },
    doktrin: {
      t1: 'Agency ', t1_i: 'Doctrine.',
      d1: 'The unbreakable principles guiding every design and architectural decision we make.',
      items: [
        'Global Standards, Precision Execution. Your local business has the capacity to dominate the market through AI efficiency.',
        'AI as an ROI Engine. We do not sell hype. We measure success entirely by the hours saved and the productivity surges you achieve.',
        'Custom Solutions, Not Templates. Every single AI agent we architect is tailored specifically to understand your unique context and bottlenecks.',
        'Humanizing Automation. Our systems take over the robotic work, allowing your human team to return to innovation and strategy.',
        'Engineering the Future from Bali. We process world-class digital infrastructure for limitless efficiency.'
      ]
    },
    faq: {
      t1: 'General ', t1_i: 'Questions.',
      items: [
        { q: 'Is AI suitable for local, growing businesses?', a: 'Yes. AI acts as the ultimate equalizer. Our intelligent systems take over operational work so you can focus entirely on executive strategy.' },
        { q: 'Does DGT_LZ also handle day-to-day IT operations?', a: 'Absolutely. Through our Internet Ecosystem Management service, we manage servers, maintain cybersecurity, and ensure your assets are always optimal.' },
        { q: 'How long does MVP implementation take?', a: 'Audits and diagnostics take 1-2 weeks, while Minimum Viable Product implementation ranges from 4 to 8 weeks depending on the complexity of your legacy systems.' }
      ]
    },
    kontak: {
      t1: 'Initiate ', t1_i: 'Transformation.',
      d1: 'Stop wasting time and overhead on problems that a system can solve. Let us architect an autonomous infrastructure for your business.',
      f1: 'Name / Business Entity', p1: 'Type your name here...',
      f2: 'Transmission Line', p2: 'How can we reach back out to you?',
      f3: 'Transformation Objective', p3: 'What do you want to solve using AI?',
      btn: 'Get AI Blueprint',
      h1: 'Operational Headquarters', a1_1: 'Denpasar, Bali', a1_2: 'Indonesia 80111',
      h2: 'Direct Transmission'
    }
  }
};


// --- KOMPONEN BANTUAN UNTUK ANIMASI SCROLL (GSAP) ---
const AnimatedSection = ({ children, className = '', stagger = false }) => {
  const domRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const elements = stagger ? domRef.current.children : domRef.current;
      gsap.fromTo(elements, 
        { autoAlpha: 0, y: 50 }, 
        { 
          autoAlpha: 1, 
          y: 0, 
          duration: 1.5, 
          ease: "expo.out",
          stagger: stagger ? 0.1 : 0,
          scrollTrigger: {
            trigger: domRef.current,
            start: "top 85%",
            once: true
          }
        }
      );
    }, domRef);
    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={domRef} className={className}>
      {children}
    </div>
  );
};

// --- BAGIAN 1: BERANDA (HERO) ---
const Beranda = ({ isLoaded, t }) => {
  const heroRef = useRef();

  useLayoutEffect(() => {
    if (!isLoaded) return;
    let ctx = gsap.context(() => {
      gsap.fromTo(".hero-elem", 
        { autoAlpha: 0, y: 60 }, 
        { autoAlpha: 1, y: 0, duration: 1.8, ease: "expo.out", stagger: 0.1, delay: 0.2 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section id="manifesto" ref={heroRef} className="min-h-[90vh] flex flex-col justify-center gap-16 scroll-mt-32 relative z-10 overflow-hidden">
      
      {/* Giant Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-maroni text-[#FAFAFA]/[0.02] whitespace-nowrap pointer-events-none z-[-1] select-none tracking-tighter">
        DGT_LZ
      </div>

      <div className="flex flex-col gap-4 uppercase text-[10px] md:text-xs tracking-[0.2em] text-[#A3A3A3] font-mono hero-elem invisible">
        <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#2A2A2A] rounded-full w-fit mb-2 bg-[#111111]/80 backdrop-blur-sm cursor-pointer hover:border-[#D46B4A]/50 transition-colors" onClick={() => document.getElementById('kontak').scrollIntoView({ behavior: 'smooth' })}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D46B4A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D46B4A]"></span>
          </span>
          <span className="text-[9px] md:text-[10px] tracking-[0.15em] font-bold text-[#A3A3A3]">
            {t.hero.badgePrefix} <span className="text-[#D46B4A] font-normal mx-2">✦</span> {t.hero.badgeSuffix}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span>{t.hero.sub1}</span>
          <span className="h-[1px] w-8 bg-[#D46B4A]"></span>
          <span className="text-[#D46B4A] font-maroni text-sm tracking-normal">DGT_LZ</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-maroni tracking-tighter text-[#FAFAFA] mt-6 flex items-baseline leading-none">
          DGT_LZ
          <span className="inline-block w-3 h-3 md:w-4 md:h-4 bg-[#D46B4A] rounded-full ml-1 md:ml-2"></span>
        </h1>
        <span className="mt-3 text-[#737373] tracking-widest font-mono text-[10px] md:text-xs">{t.hero.sub2}</span>
      </div>

      <div className="max-w-4xl mt-4 hero-elem invisible">
        <h2 className="text-4xl md:text-6xl font-serif font-normal leading-[1.2] tracking-tight text-[#FAFAFA]">
          {t.hero.title1}<i className="text-[#D46B4A]">{t.hero.title1_i}</i><br />
          {t.hero.title2}<i className="text-[#D46B4A]">{t.hero.title2_i}</i>
        </h2>
      </div>

      <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-[#A3A3A3] font-light mt-4 hero-elem invisible">
        {t.hero.p1}
      </p>

      <div className="mt-8 hero-elem invisible">
        <div className="relative pl-8 py-2 border-l border-[#D46B4A]">
          <h3 className="text-2xl md:text-3xl font-serif text-[#FAFAFA] mb-3 font-bold">
            {t.hero.boxTitle}
          </h3>
          <p className="text-[#737373] text-lg font-light">{t.hero.boxDesc}</p>
        </div>
      </div>
    </section>
  );
};

// --- BAGIAN EXTRA 1: MARQUEE (RUNNING TEXT) ---
const Marquee = ({ t }) => (
  <div className="w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden border-y border-[#2A2A2A] bg-[#111111]/80 backdrop-blur-sm py-5 whitespace-nowrap flex items-center mb-16 md:mb-32 z-10 pt-6">
    <div className="animate-marquee inline-block text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#737373] font-mono font-bold">
      {t.marquee.map((word, idx) => (
        <React.Fragment key={idx}>
          <span className="mx-8">{word}</span> <span className="text-[#D46B4A]">✦</span>
        </React.Fragment>
      ))}
      {t.marquee.map((word, idx) => (
        <React.Fragment key={`repeat-${idx}`}>
          <span className="mx-8">{word}</span> <span className="text-[#D46B4A]">✦</span>
        </React.Fragment>
      ))}
      {t.marquee.map((word, idx) => (
        <React.Fragment key={`repeat2-${idx}`}>
          <span className="mx-8">{word}</span> <span className="text-[#D46B4A]">✦</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

// --- BAGIAN EXTRA 2: STATISTIK & DAMPAK ---
const Statistik = ({ t }) => (
  <section className="flex flex-col gap-12 pb-24 md:pb-32 relative z-10">
    <AnimatedSection stagger={true}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#2A2A2A]">
        {t.stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col pt-8 md:pt-0 md:px-12 first:md:pl-0 last:md:pr-0 group">
            <div className="text-6xl md:text-7xl font-serif font-bold text-[#FAFAFA] mb-4 tracking-tighter group-hover:text-[#D46B4A] transition-colors duration-500">{stat.num}</div>
            <div className="text-sm font-mono font-bold text-[#D46B4A] uppercase tracking-[0.2em] mb-3">{stat.label}</div>
            <p className="text-[#A3A3A3] font-light leading-relaxed">{stat.desc}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  </section>
);

// --- BAGIAN 2: LAYANAN (Pilar Kerja) ---
const Layanan = ({ t }) => {
  const paralaxRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(".parallax-img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: paralaxRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, paralaxRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="layanan" ref={paralaxRef} className="flex flex-col gap-32 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        <div className="lg:w-1/3 relative">
          <AnimatedSection className="sticky top-32">
            <h2 className="text-4xl md:text-5xl font-serif text-[#FAFAFA] mb-6 font-bold">
              {t.layanan.t1}<i className="text-[#D46B4A] italic">{t.layanan.t1_i}</i>
            </h2>
            <p className="text-[#A3A3A3] font-light text-lg">
              {t.layanan.d1}
            </p>
            <div className="mt-12 aspect-[3/4] w-full relative overflow-hidden border border-[#2A2A2A] hidden lg:block group bg-[#111111]">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" alt="Metodologi Arsitektur" className="parallax-img object-cover w-full h-[120%] -top-[10%] absolute grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60" />
            </div>
          </AnimatedSection>
        </div>

        <div className="lg:w-2/3">
          <AnimatedSection stagger={true} className="flex flex-col gap-8">
            {t.layanan.list1.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative p-10 bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#D46B4A] transition-all duration-500 flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="text-4xl font-serif italic font-bold text-[#2A2A2A] group-hover:text-[#D46B4A] transition-colors duration-500 shrink-0">{item.num}</div>
                <div className="relative z-10 mt-2 md:mt-0">
                  <h4 className="text-xl font-serif font-bold text-[#FAFAFA] mb-4 tracking-wide">{item.title}</h4>
                  <p className="text-[#A3A3A3] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 border-t border-[#2A2A2A] pt-24 relative">
        <div className="lg:w-1/3 relative">
          <AnimatedSection className="sticky top-32">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#FAFAFA] mb-6">
              {t.layanan.t2}<i className="text-[#D46B4A]">{t.layanan.t2_i}</i>
            </h2>
            <p className="text-[#A3A3A3] font-light text-lg">
              {t.layanan.d2}
            </p>
          </AnimatedSection>
        </div>

        <div className="lg:w-2/3">
          <AnimatedSection stagger={true} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.layanan.list2.map((svc, idx) => (
              <div 
                key={idx} 
                className={`group flex flex-col p-10 bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#D46B4A]/50 hover:-translate-y-1 transition-all duration-500`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#D46B4A] font-mono font-bold">{svc.id}</div>
                  <div className="w-8 h-[1px] bg-[#2A2A2A] group-hover:bg-[#D46B4A] transition-colors duration-500 group-hover:w-12"></div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#FAFAFA] mb-4">{svc.title}</h3>
                <p className="text-[#A3A3A3] leading-relaxed font-light">{svc.desc}</p>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

// --- BAGIAN 2.1: ABOUT US ---
const AboutUs = ({ t }) => (
  <section id="about" className="flex flex-col gap-16 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
    <AnimatedSection>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FAFAFA] mb-6">
        {t.about.t1}<i className="text-[#D46B4A]">{t.about.t1_i}</i>
      </h2>
    </AnimatedSection>
    <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <p className="text-[#A3A3A3] font-light text-lg leading-relaxed">
        {t.about.p1}
      </p>
      <p className="text-[#A3A3A3] font-light text-lg leading-relaxed">
        {t.about.p2}
      </p>
    </AnimatedSection>
  </section>
);

// --- BAGIAN 2.2: PARTNERSHIP ---
const Partnership = ({ t }) => (
  <section id="partnership" className="flex flex-col gap-16 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
    <AnimatedSection>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FAFAFA] mb-6">
        {t.partnership.t1}<i className="text-[#D46B4A]">{t.partnership.t1_i}</i>
      </h2>
      <p className="max-w-2xl text-[#A3A3A3] font-light text-lg">
        {t.partnership.d1}
      </p>
    </AnimatedSection>
    <AnimatedSection stagger={true} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {t.partnership.items.map((item, idx) => (
        <div key={idx} className="p-10 bg-[#111111] border border-[#2A2A2A] hover:border-[#D46B4A]/50 transition-all duration-500">
          <h3 className="text-xl font-serif font-bold text-[#FAFAFA] mb-4">{item.title}</h3>
          <p className="text-[#A3A3A3] font-light leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </AnimatedSection>
  </section>
);

// --- BAGIAN 2.3: OUR WORK ---
const OurWork = ({ t }) => (
  <section id="work" className="flex flex-col gap-16 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
    <AnimatedSection>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FAFAFA] mb-6">
        {t.work.t1}<i className="text-[#D46B4A]">{t.work.t1_i}</i>
      </h2>
      <p className="max-w-2xl text-[#A3A3A3] font-light text-lg">
        {t.work.d1}
      </p>
    </AnimatedSection>
    <AnimatedSection stagger={true} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {t.work.items.map((item, idx) => (
        <div key={idx} className="group flex flex-col gap-6">
          <div className="aspect-video w-full bg-[#111111] border border-[#2A2A2A] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4 flex gap-2">
              {item.tags.map((tag, tidx) => (
                <span key={tidx} className="text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-1 bg-[#D46B4A] text-white rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-serif font-bold text-[#FAFAFA] group-hover:text-[#D46B4A] transition-colors">{item.title}</h3>
            <p className="text-[#737373] text-sm font-light leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </AnimatedSection>
  </section>
);

// --- BAGIAN 2.4: OUR TEAM ---
const OurTeam = ({ t }) => (
  <section id="team" className="flex flex-col gap-16 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
    <AnimatedSection>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FAFAFA] mb-6">
        {t.team.t1}<i className="text-[#D46B4A]">{t.team.t1_i}</i>
      </h2>
      <p className="max-w-2xl text-[#A3A3A3] font-light text-lg">
        {t.team.d1}
      </p>
    </AnimatedSection>
    <AnimatedSection stagger={true} className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {t.team.members.map((member, idx) => (
        <div key={idx} className="flex flex-col md:flex-row gap-8 p-8 bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#D46B4A]/30 transition-all duration-500 group">
          <div className="w-full md:w-40 shrink-0">
            <div className="aspect-square w-full bg-[#111111] border border-[#2A2A2A] relative grayscale group-hover:grayscale-0 transition-all duration-700 flex items-center justify-center overflow-hidden">
               <span className="text-[#2A2A2A] font-maroni text-4xl">{member.name[0]}</span>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <a href={member.portfolio} target="_blank" rel="noreferrer" className="text-[10px] font-mono font-bold text-[#D46B4A] uppercase tracking-widest hover:underline">Portfolio</a>
              <a href={`https://instagram.com/${member.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-[10px] font-mono font-bold text-[#737373] uppercase tracking-widest hover:text-[#FAFAFA]">Instagram</a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#FAFAFA] mb-1">{member.name}</h3>
              <div className="text-xs font-mono text-[#D46B4A] uppercase tracking-[0.2em] font-bold">{member.role}</div>
            </div>
            <p className="text-[#A3A3A3] text-sm font-light leading-relaxed">
              {member.bio}
            </p>
            <div className="pt-6 border-t border-[#2A2A2A] flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#737373] uppercase tracking-widest font-bold">Experience</span>
                <span className="text-sm text-[#FAFAFA] font-serif">{member.experience.role}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#737373] uppercase tracking-widest font-bold">Key Work</span>
                <span className="text-sm text-[#A3A3A3] font-light">{member.experience.work}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#737373] uppercase tracking-widest font-bold">Achievements</span>
                <span className="text-sm text-[#D46B4A] italic font-light">{member.experience.achievements}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </AnimatedSection>
  </section>
);

// --- BAGIAN 3: DOKTRIN ---
const Doktrin = ({ t }) => (
  <section id="doktrin" className="flex flex-col lg:flex-row gap-12 lg:gap-24 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
    <div className="lg:w-1/3 relative">
      <AnimatedSection className="sticky top-32">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FAFAFA] mb-6">
          {t.doktrin.t1}<i className="text-[#D46B4A]">{t.doktrin.t1_i}</i>
        </h2>
        <p className="text-[#A3A3A3] font-light text-lg">
          {t.doktrin.d1}
        </p>
      </AnimatedSection>
    </div>

    <div className="lg:w-2/3">
      <AnimatedSection stagger={true} className="flex flex-col mt-8 lg:mt-0 border-t border-[#2A2A2A]">
        {t.doktrin.items.map((text, index) => (
          <div 
            key={index}
            className="flex flex-col md:flex-row gap-6 md:gap-12 py-10 border-b border-[#2A2A2A] transition-all duration-500 px-6 -mx-6 group hover:bg-[#111111]"
          >
            <div className="font-serif italic font-bold text-2xl text-[#2A2A2A] group-hover:text-[#D46B4A] shrink-0 mt-[-4px] transition-colors">
              0{index + 1}
            </div>
            <p className="text-[#A3A3A3] group-hover:text-[#FAFAFA] text-base md:text-lg leading-relaxed font-light transition-colors">
              {text}
            </p>
          </div>
        ))}
      </AnimatedSection>
    </div>
  </section>
);

// --- BAGIAN 4: FAQ ---
const FAQ = ({ t }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="flex flex-col gap-16 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
      <AnimatedSection>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FAFAFA] mb-6">
          {t.faq.t1}<i className="text-[#D46B4A]">{t.faq.t1_i}</i>
        </h2>
      </AnimatedSection>

      <AnimatedSection stagger={true} className="flex flex-col border-t border-[#2A2A2A]">
        {t.faq.items.map((faq, index) => (
          <div key={index} className="border-b border-[#2A2A2A]">
            <button 
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full py-8 flex justify-between items-center text-left hover:bg-[#111111] transition-colors px-6 -mx-6 group"
            >
              <span className="text-lg md:text-xl font-medium text-[#FAFAFA] group-hover:text-[#D46B4A] transition-colors pr-8">
                {faq.q}
              </span>
              <span className="text-2xl font-serif font-light text-[#D46B4A] shrink-0 transition-transform duration-300">
                {activeIndex === index ? '−' : '+'}
              </span>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out px-6 -mx-6 ${activeIndex === index ? 'max-h-96 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-[#A3A3A3] font-light leading-relaxed max-w-3xl">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </AnimatedSection>
    </section>
  );
};

// --- BAGIAN 5: KONTAK ---
const Kontak = ({ t }) => (
  <section id="kontak" className="flex flex-col gap-16 pt-24 pb-24 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
    <AnimatedSection>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FAFAFA] mb-6">
        {t.kontak.t1}<i className="text-[#D46B4A]">{t.kontak.t1_i}</i>
      </h2>
      <p className="max-w-2xl text-[#A3A3A3] font-light text-lg">
        {t.kontak.d1}
      </p>
    </AnimatedSection>

    <AnimatedSection className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-3 flex flex-col gap-8 bg-[#111111] p-10 md:p-12 border border-[#2A2A2A]">
          <div className="flex flex-col gap-3">
            <label className="text-[10px] text-[#A3A3A3] uppercase tracking-[0.2em] font-mono font-bold">{t.kontak.f1}</label>
            <input type="text" className="bg-transparent border-b border-[#2A2A2A] focus:border-[#D46B4A] outline-none py-3 text-[#FAFAFA] font-serif transition-colors" placeholder={t.kontak.p1} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[10px] text-[#A3A3A3] uppercase tracking-[0.2em] font-mono font-bold">{t.kontak.f2}</label>
            <input type="text" className="bg-transparent border-b border-[#2A2A2A] focus:border-[#D46B4A] outline-none py-3 text-[#FAFAFA] font-serif transition-colors" placeholder={t.kontak.p2} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[10px] text-[#A3A3A3] uppercase tracking-[0.2em] font-mono font-bold">{t.kontak.f3}</label>
            <textarea className="bg-transparent border-b border-[#2A2A2A] focus:border-[#D46B4A] outline-none py-3 text-[#FAFAFA] font-serif transition-colors resize-none h-28" placeholder={t.kontak.p3}></textarea>
          </div>
          <button 
            className="group mt-6 bg-[#FAFAFA] text-[#0A0A0A] font-mono font-bold py-4 px-8 uppercase tracking-[0.2em] text-xs hover:bg-[#D46B4A] hover:text-[#FAFAFA] transition-all duration-300 w-fit self-start flex items-center gap-3 overflow-hidden border border-transparent"
          >
            <span>{t.kontak.btn}</span>
            <span className="transform translate-x-[-20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">→</span>
          </button>
        </div>

        <div className="md:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col gap-10">
            <div>
              <h4 className="text-[10px] text-[#737373] uppercase tracking-[0.2em] mb-3 font-mono font-bold">{t.kontak.h1}</h4>
              <p className="text-[#FAFAFA] text-lg font-serif">{t.kontak.a1_1}<br/>{t.kontak.a1_2}</p>
            </div>
            <div>
              <h4 className="text-[10px] text-[#737373] uppercase tracking-[0.2em] mb-3 font-mono font-bold">{t.kontak.h2}</h4>
              <p className="text-[#FAFAFA] text-lg font-serif hover:text-[#D46B4A] cursor-pointer transition-colors w-fit">
                DGT_lz on ig
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  </section>
);


// --- KOMPONEN UTAMA (APP) ---
const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lang, setLang] = useState('en'); // Default to global EN until detected
  const lastScrollY = useRef(0);

  // Auto-Detect Language on Mount
  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.toLowerCase().includes('id')) {
      setLang('id');
    } else {
      setLang('en');
    }
  }, []);

  useEffect(() => {
    // Inisialisasi Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    setIsLoaded(true);

    let ticking = false;
    const controlNavbar = () => {
      if (typeof window !== 'undefined' && !ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            setShowNav(false);
          } else {
            setShowNav(true);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => {
      window.removeEventListener('scroll', controlNavbar);
      lenis.destroy();
    }
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsNavOpen(false);
  };

  const t = contentLocales[lang];

  const navItems = [
    { id: 'manifesto', label: t.nav.manifesto },
    { id: 'layanan', label: t.nav.layanan },
    { id: 'about', label: t.nav.about },
    { id: 'partnership', label: t.nav.partnership },
    { id: 'work', label: t.nav.work },
    { id: 'team', label: t.nav.team },
    { id: 'doktrin', label: t.nav.doktrin },
    { id: 'faq', label: t.nav.faq },
    { id: 'kontak',  label: t.nav.kontak }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-sans overflow-x-hidden selection:bg-[#D46B4A] selection:text-white flex flex-col relative uppercase-lines">

      {/* Import Custom Fonts & Styling */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@300,400,500,700&display=swap');

        html { scroll-behavior: auto; } /* Lenis handles smooth */
        body {
          font-family: 'Cabinet Grotesk', sans-serif;
          background-color: #0A0A0A;
          color: #FAFAFA;
        }
        
        .font-maroni { 
          font-family: 'Syne', sans-serif; 
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        h1, h2, h3, .font-serif { 
          font-family: 'Clash Display', sans-serif; 
        }
        .font-mono { font-family: 'Space Mono', monospace; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}} />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 z-50 w-full border-b border-[#2A2A2A] bg-[#0A0A0A]/80 backdrop-blur-lg transition-transform duration-500 ease-in-out ${showNav ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-5xl mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
          <div 
            className="text-[#FAFAFA] font-maroni text-2xl tracking-tight flex items-baseline cursor-pointer"
            onClick={() => scrollToSection('manifesto')}
          >
            DGT_LZ <span className="inline-block w-2 h-2 bg-[#D46B4A] rounded-full ml-1"></span>
          </div>
          
          <div className="hidden md:flex gap-10 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[11px] uppercase tracking-[0.2em] transition-all duration-300 font-mono font-bold text-[#737373] hover:text-[#D46B4A]"
              >
                {item.label}
              </button>
            ))}
            
            {/* Lang Switcher (Desktop) */}
            <div className="flex items-center gap-2 pl-4 border-l border-[#2A2A2A] text-[10px] uppercase font-mono font-bold tracking-widest">
              <button onClick={() => setLang('en')} className={`transition-colors hover:text-[#D46B4A] ${lang === 'en' ? 'text-[#FAFAFA]' : 'text-[#737373]'}`}>EN</button>
              <span className="text-[#2A2A2A]">|</span>
              <button onClick={() => setLang('id')} className={`transition-colors hover:text-[#D46B4A] ${lang === 'id' ? 'text-[#FAFAFA]' : 'text-[#737373]'}`}>ID</button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-6">
            {/* Lang Switcher (Mobile) */}
            <div className="flex items-center gap-2 text-[10px] uppercase font-mono font-bold tracking-widest border-r border-[#2A2A2A] pr-6">
              <button onClick={() => setLang('en')} className={`transition-colors hover:text-[#D46B4A] ${lang === 'en' ? 'text-[#FAFAFA]' : 'text-[#737373]'}`}>EN</button>
              <span className="text-[#2A2A2A]">|</span>
              <button onClick={() => setLang('id')} className={`transition-colors hover:text-[#D46B4A] ${lang === 'id' ? 'text-[#FAFAFA]' : 'text-[#737373]'}`}>ID</button>
            </div>
            
            <button 
              className="text-[#FAFAFA] text-[11px] uppercase tracking-[0.2em] font-mono font-bold"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? t.nav.btnClose : t.nav.btnMenu}
            </button>
          </div>
        </div>

        <div className={`md:hidden absolute top-24 left-0 w-full bg-[#0A0A0A] border-b border-[#2A2A2A] flex flex-col p-8 gap-8 shadow-sm z-40 transition-all duration-500 ease-in-out ${isNavOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-[11px] uppercase tracking-[0.2em] text-left transition-colors font-mono font-bold text-[#737373] hover:text-[#D46B4A]"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 w-full flex-grow relative z-10 pt-24">
        <Beranda isLoaded={isLoaded} t={t} />
        <Marquee t={t} />
        <Statistik t={t} />
        <Layanan t={t} />
        <AboutUs t={t} />
        <Partnership t={t} />
        <OurWork t={t} />
        <OurTeam t={t} />
        <Doktrin t={t} />
        <FAQ t={t} />
        <Kontak t={t} />
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="border-t border-[#2A2A2A] mt-auto bg-[#0A0A0A] relative z-10">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="text-[#FAFAFA] font-maroni text-xl tracking-tight">
            DGT_LZ <span className="text-[#737373] text-xs ml-2 font-mono font-normal tracking-widest">© 2026</span>
          </div>
          <div className="flex flex-col text-left md:text-right text-[10px] text-[#737373] uppercase tracking-[0.2em] font-mono font-bold gap-2">
            <span>Denpasar, Bali — Indonesia</span>
            <span className="text-[#D46B4A]">{lang === 'id' ? 'Intelligence Augmented.' : 'Intelligence Augmented.'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
