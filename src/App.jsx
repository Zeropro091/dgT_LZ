import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import AdminPortal from './AdminPortal';
import TeamPortal from './TeamPortal';
import ClientPortal from './ClientPortal';
import {
  INITIAL_PROJECTS,
  INITIAL_LEADS,
  INITIAL_TASKS,
  INITIAL_TRANSACTIONS,
  INITIAL_TEAM,
  INITIAL_TRANSPARENCY_LOG
} from './sharedData.js';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// LANGUAGE DICTIONARY (i18n)
// ============================================
const contentLocales = {
  id: {
    nav: { manifesto: 'Manifesto', layanan: 'Layanan', bundel: 'Bundel', about: 'Tentang', partnership: 'Kemitraan', work: 'Karya', team: 'Tim', doktrin: 'Doktrin', faq: 'FAQ', kontak: 'Kontak', btnClose: 'Tutup', btnMenu: 'Menu' },
    hero: {
      badgePrefix: 'KONSULTASI GRATIS',
      badgeSuffix: 'HINGGA MENDAPATKAN BLUEPRINT YANG PAS',
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
      t1: 'Profil ', t1_i: 'Agensi.',
      p1: 'DGT_LZ (Digital Landing Zone) adalah agensi transformasi digital dan infrastruktur kecerdasan buatan berbasis di Denpasar, Bali. Nama "Landing Zone" merepresentasikan wilayah aman berstandar rekayasa tinggi di mana infrastruktur lama (legacy system) milik klien mendarat untuk diperbarui dan diluncurkan kembali ke era otonomi digital.',
      p2: 'Kami berfokus sepenuhnya pada ROI (Return on Investment) dan efisiensi waktu, dengan target mengotomasi hingga 98% pekerjaan administratif berulang. Kami membantu bisnis lokal hingga skala global melipatgandakan kapasitas operasional mereka tanpa penambahan headcount secara linier.',
      t_skema: 'Skema ', t_skema_i: 'Bisnis & Alur Kerja.',
      skema_desc: 'Kami memadukan konsultasi tanpa biaya dengan pengembangan tangkas untuk menjamin nilai ekonomis nyata.',
      phases: [
        { title: 'Infiltration (Lead & Audit)', desc: 'Konsultasi awal 100% tanpa biaya untuk menganalisis alur kerja manual dan membuat "AI Blueprint" solusi otomatisasi.' },
        { title: 'MVP Implementation (4-8 Minggu)', desc: 'Membangun purwarupa fungsional untuk mengatasi bottleneck operasional terbesar dan langsung membuktikan ROI nyata.' },
        { title: 'Autonomous Scaling', desc: 'Integrasi sistem secara penuh—menghubungkan API, merapikan legacy code, dan mengaktifkan otonomi sistem 24/7.' },
        { title: 'Ecosystem Management (CTO)', desc: 'Skema retainer bulanan di mana kami bertindak sebagai CTO eksternal untuk mengelola server cloud, token API, keamanan, dan pembaruan AI.' }
      ]
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
        { 
          title: 'Lensa Insignia', 
          tags: ['AI', 'Web Media'], 
          desc: 'Media berita dengan desain profesional & dashboard management otonom. Dilengkapi Post Creator berita-ke-sosmed 5-klik (<10 detik) dan AI pencari fakta otomatis.',
          link: 'https://lensainsignia.com',
          image: '/lensa_insignia.jpg'
        },
        { 
          title: 'Command', 
          tags: ['SaaS', 'Agency OS'], 
          desc: 'Sistem operasi otonom agensi kreatif & developer. Menyatukan manajemen proyek, CRM pipeline, keuangan ledger, dan analitik kapasitas tim dalam dasbor real-time bertenaga AI.',
          image: '/command_logo.jpg'
        },
        { 
          title: 'Sapa Warga', 
          tags: ['AI', 'GovTech'], 
          desc: 'Sistem pelaporan publik cerdas bertenaga AI. Mengotomatisasi kategori & prioritas laporan, memahami dialek lokal (Bali & Indonesia), serta menyusun ringkasan instan untuk admin guna menghilangkan bottleneck birokrasi.',
          image: '/sapawarga_logo.jpg'
        }
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
          role: 'Head Server Division',
          bio: 'Mengarsiteki server backend berkinerja tinggi dan arsitektur database terdistribusi.',
          experience: {
            role: 'Lead Systems Engineer',
            work: 'Mengelola infrastruktur cloud multi-region untuk sistem otonom DGT.',
            achievements: 'Menjamin uptime sistem 99.99% di bawah beban puncak.'
          },
          portfolio: 'https://made.server',
          ig: '@made_server'
        },
        {
          name: 'Panji',
          role: 'Head 3D Division',
          bio: 'Spesialis rekayasa fisik dan cetak 3D dengan akurasi mikron.',
          experience: {
            role: 'Lead 3D Fabrication Engineer',
            work: 'Merancang suku cadang presisi tinggi dan prototipe arsitektur kompleks.',
            achievements: 'Menerima Penghargaan Inovasi Manufaktur Bali 2025.'
          },
          portfolio: 'https://panji.3d',
          ig: '@panji_3d'
        },
        {
          name: 'Ganesh',
          role: 'Designer',
          bio: 'Menciptakan identitas visual futuristik dan antarmuka pengguna yang memikat.',
          experience: {
            role: 'Lead Visual Designer',
            work: 'Merancang bahasa desain Neo-Brutalis dan skema interaksi 3D DGT.',
            achievements: 'Memenangkan Digital Design Award untuk antarmuka portal otonom.'
          },
          portfolio: 'https://ganesh.design',
          ig: '@ganesh_design'
        },
        {
          name: 'Aan',
          role: 'Full Stack',
          bio: 'Menyatukan logika backend yang andal dengan antarmuka frontend yang responsif.',
          experience: {
            role: 'Senior Full Stack Developer',
            work: 'Membangun dasbor operasional otonom dan integrasi API DGT.',
            achievements: 'Mengurangi latensi sinkronisasi data antar portal hingga 40%.'
          },
          portfolio: 'https://aan.dev',
          ig: '@aan_dev'
        },
        {
          name: 'Rifky',
          role: 'Media & Branding',
          bio: 'Menyampaikan visi teknologi DGT ke dunia luar melalui narasi media yang kuat.',
          experience: {
            role: 'Brand Architect',
            work: 'Memimpin strategi media sosial, kampanye visual, dan dokumentasi operasional.',
            achievements: 'Meningkatkan jangkauan organik brand DGT hingga 300% dalam 6 bulan.'
          },
          portfolio: 'https://rifky.media',
          ig: '@rifky_media'
        },
        {
          name: 'Bayu',
          role: 'Head Social Media & Marketing',
          bio: 'Spesialis pertumbuhan organik dan arsitek kampanye pemasaran digital terukur.',
          experience: {
            role: 'Growth Marketer',
            work: 'Mengoptimalkan akuisisi klien DGT melalui corong pemasaran otomatis.',
            achievements: 'Meningkatkan ROI pemasaran sebesar 350% dalam satu kuartal.'
          },
          portfolio: 'https://bayu.growth',
          ig: '@bayu_marketing'
        },
        {
          name: 'Rama',
          role: 'Head Robotic',
          bio: 'Insinyur robotik yang mengintegrasikan agen AI otonom dengan aktuator fisik.',
          experience: {
            role: 'Robotics System Engineer',
            work: 'Merancang lengan robotik otonom dan sistem otomasi lini perakitan.',
            achievements: 'Mendeploy 15+ sistem robotik otonom di manufaktur lokal.'
          },
          portfolio: 'https://rama.robotics',
          ig: '@rama_robotics'
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
    bundel: {
      t1: 'Pilihan ', t1_i: 'Bundel Otonom.',
      d1: 'Paket sistem siap pakai yang dirancang untuk mengatasi bottleneck operasional Anda secara instan dengan efisiensi tinggi.',
      cta: 'Dapatkan Blueprint AI',
      pesan: 'Pesan Bundel',
      categories: {
        pos: 'Kasir & Inventaris',
        crm: 'Agen AI & CRM',
        office: 'Otomasi Admin'
      },
      packages: {
        pos: [
          {
            name: 'Lite Launch',
            desc: 'Sistem kasir digital terintegrasi analitik stok dasar untuk UMKM.',
            features: [
              'Point of Sale (POS) Adaptif',
              'Analitik Stok & Penjualan Dasar',
              'Notifikasi Stok Rendah Otomatis',
              'Laporan Penjualan Harian via WhatsApp',
              'Kecepatan & Respons Khas Brutalis'
            ],
            duration: '4 Minggu',
            impact: 'Menghemat 15 jam/minggu pekerjaan admin'
          },
          {
            name: 'Pro Scale',
            desc: 'Ekosistem kasir dan rantai pasok otonom untuk multi-outlet.',
            features: [
              'Seluruh fitur paket Lite Launch',
              'Prediksi Kebutuhan Stok Berbasis AI',
              'Pembuatan Purchase Order (PO) Otomatis',
              'Pencocokan Faktur & Tanda Terima AI',
              'WhatsApp Agent untuk Cek Stok Real-Time'
            ],
            duration: '6 Minggu',
            impact: 'Akurasi stok 99.8% tanpa audit manual harian'
          },
          {
            name: 'Enterprise Edge',
            desc: 'Arsitektur pergudangan dan POS kustom berskala enterprise.',
            features: [
              'Seluruh fitur paket Pro Scale',
              'Integrasi ERP & Sistem Logistik Kustom',
              'Prediksi & Mitigasi Limbah/Kerusakan AI',
              'AI Kamera untuk Deteksi Barcode & Visual Audit',
              'Dudukan & Casing Fisik Kustom (Cetak 3D)',
              'Dukungan Teknis CTO-Grade 24/7'
            ],
            duration: '8-12 Minggu',
            impact: '10x Scaling potensial kapasitas tanpa tambah admin'
          }
        ],
        crm: [
          {
            name: 'Agent Basic',
            desc: 'Asisten obrolan WhatsApp 24/7 untuk menjawab FAQ dan mengumpulkan lead.',
            features: [
              'Respon Chat Instan & Akurat 24/7',
              'Integrasi Database FAQ Kustom',
              'Pengumpulan Data Lead Otomatis',
              'Tindakan Eskalasi ke CS Manusia',
              'Dashboard Lead Sederhana'
            ],
            duration: '3 Minggu',
            impact: 'Merespon 100% pertanyaan pelanggan secara instan'
          },
          {
            name: 'Agent Pro',
            desc: 'Sistem multi-agen AI kolaboratif untuk penjualan dan dukungan pelanggan.',
            features: [
              'Seluruh fitur paket Agent Basic',
              'Multi-Agent System (Agen Penjawab + Agen Penutup Sales)',
              'Sinkronisasi Langsung ke CRM (Hubspot/Notion/Dll)',
              'Follow-up Pelanggan Otomatis Terjadwal',
              'Analisis Sentimen Obrolan Real-Time'
            ],
            duration: '5 Minggu',
            impact: 'Meningkatkan konversi penjualan hingga 40%'
          },
          {
            name: 'Agent Enterprise',
            desc: 'Infrastruktur agen suara dan teks kustom yang terintegrasi penuh.',
            features: [
              'Seluruh fitur paket Agent Pro',
              'Agen Suara Telepon Kustom (AI Voice Call)',
              'Fine-tuning Model AI dengan Data Perusahaan',
              'Keamanan Tingkat Tinggi (On-Premise Deployment)',
              'Analitik Perilaku Pelanggan Mendalam'
            ],
            duration: '8+ Minggu',
            impact: 'Mengambil alih 95% beban kerja pusat kontak pelanggan'
          }
        ],
        office: [
          {
            name: 'Admin Lite',
            desc: 'Otomasi pembacaan dokumen dan pengarsipan data masuk.',
            features: [
              'Pembaca PDF & Gambar Cerdas (AI OCR)',
              'Ekstraksi Informasi Kunci Kontrak/Faktur',
              'Pengarsipan Dokumen Otomatis',
              'Klasifikasi Email Masuk Berbasis AI',
              'Integrasi Google Sheets/Drive'
            ],
            duration: '3 Minggu',
            impact: 'Memangkas waktu entri data dokumen sebesar 80%'
          },
          {
            name: 'Admin Pro',
            desc: 'Pipeline pemrosesan dokumen dan sinkronisasi database otonom.',
            features: [
              'Seluruh fitur paket Admin Lite',
              'Pipeline Ekstraksi Multi-Dokumen Kompleks',
              'Penyisipan Data Otomatis ke Database Utama/ERP',
              'Notifikasi Otomatis di Slack/Telegram/Discord',
              'Pencocokan Rekonsiliasi Keuangan Cerdas'
            ],
            duration: '5 Minggu',
            impact: 'Zero-human-error untuk entri data faktur bulanan'
          },
          {
            name: 'Admin Enterprise',
            desc: 'Sistem manajemen pengetahuan internal dan asisten kerja otonom.',
            features: [
              'Seluruh fitur paket Admin Pro',
              'Pencarian Pengetahuan Perusahaan AI (RAG)',
              'Audit Dokumen Hukum & Kepatuhan Otomatis',
              'Pembuatan Draf Kontrak & Dokumen Kustom AI',
              'Dasbor Analitik Efisiensi Operasional'
            ],
            duration: '8+ Minggu',
            impact: 'Menghemat waktu pencarian info karyawan hingga 90%'
          }
        ]
      }
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
    nav: { manifesto: 'Manifesto', layanan: 'Services', bundel: 'Bundel', about: 'About', partnership: 'Partnership', work: 'Work', team: 'Team', doktrin: 'Doctrine', faq: 'FAQ', kontak: 'Contact', btnClose: 'Close', btnMenu: 'Menu' },
    hero: {
      badgePrefix: 'FREE CONSULTATION',
      badgeSuffix: 'UNTIL THE RIGHT BLUEPRINT IS FOUND',
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
      t1: 'Agency ', t1_i: 'Profile.',
      p1: 'DGT_LZ (Digital Landing Zone) is an AI automation and digital architecture agency operating from Denpasar, Bali. The name "Landing Zone" represents a highly engineered secure area where outdated legacy systems land to be modernized and relaunched into the autonomous digital era.',
      p2: 'We focus strictly on ROI and time-saving metrics, aiming to automate up to 98% of manual administrative tasks. We help businesses scale their capacities up to 10x without proportional overhead or linear headcount growth.',
      t_skema: 'Business ', t_skema_i: 'Scheme & Workflow.',
      skema_desc: 'We combine risk-free consultations with agile engineering to guarantee actual economic value.',
      phases: [
        { title: 'Infiltration (Lead & Audit)', desc: '100% zero-cost initial consultation to dissect manual bottlenecks and deliver an actionable "AI Blueprint".' },
        { title: 'MVP Implementation (4-8 Weeks)', desc: 'Building a working prototype targeting your single largest choke-point to immediately prove real-world ROI.' },
        { title: 'Autonomous Scaling', desc: 'Deploying the full intelligent architecture—connecting APIs, clearing legacy debt, and establishing 24/7 system autonomy.' },
        { title: 'Ecosystem Management (CTO)', desc: 'Transitioning to a retainer partnership where we manage cloud servers, token limits, cybersecurity, and model updates.' }
      ]
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
        { 
          title: 'Lensa Insignia', 
          tags: ['AI', 'Web Media'], 
          desc: 'News media with professional design & autonomous management dashboard. Features a 5-click news-to-social post creator (<10s) and fact-checking AI team.',
          link: 'https://lensainsignia.com',
          image: '/lensa_insignia.jpg'
        },
        { 
          title: 'Command', 
          tags: ['SaaS', 'Agency OS'], 
          desc: 'An autonomous operating system for creative & developer agencies. Unifies project tracking, CRM pipeline, global ledger, and team analytics in a real-time, AI-powered environment.',
          image: '/command_logo.jpg'
        },
        { 
          title: 'Sapa Warga', 
          tags: ['AI', 'GovTech'], 
          desc: 'An AI-first public complaint reporting system. Automates triage and routing, understands local dialects (Balinese & Indonesian), and generates quick admin summaries to eliminate government backlog.',
          image: '/sapawarga_logo.jpg'
        }
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
          role: 'Head Server Division',
          bio: 'Architecting high-performance backend servers and distributed database structures.',
          experience: {
            role: 'Lead Systems Engineer',
            work: 'Managing multi-region cloud infrastructures for DGT\'s autonomous systems.',
            achievements: 'Guarantees 99.99% system uptime under peak traffic load.'
          },
          portfolio: 'https://made.server',
          ig: '@made_server'
        },
        {
          name: 'Panji',
          role: 'Head 3D Division',
          bio: 'Specialist in physical engineering and 3D fabrication with micron accuracy.',
          experience: {
            role: 'Lead 3D Fabrication Engineer',
            work: 'Designing high-precision parts and complex architectural prototypes.',
            achievements: 'Received the Bali Manufacturing Innovation Award 2025.'
          },
          portfolio: 'https://panji.3d',
          ig: '@panji_3d'
        },
        {
          name: 'Ganesh',
          role: 'Designer',
          bio: 'Creating futuristic visual identities and highly immersive user interfaces.',
          experience: {
            role: 'Lead Visual Designer',
            work: 'Designing DGT\'s Neo-Brutalist design language and 3D interaction schemes.',
            achievements: 'Won the Digital Design Award for autonomous portal interfaces.'
          },
          portfolio: 'https://ganesh.design',
          ig: '@ganesh_design'
        },
        {
          name: 'Aan',
          role: 'Full Stack',
          bio: 'Unifying bulletproof backend logic with highly responsive frontend interfaces.',
          experience: {
            role: 'Senior Full Stack Developer',
            work: 'Building DGT\'s autonomous operational dashboards and API integrations.',
            achievements: 'Reduced data synchronization latency between portals by 40%.'
          },
          portfolio: 'https://aan.dev',
          ig: '@aan_dev'
        },
        {
          name: 'Rifky',
          role: 'Media & Branding',
          bio: 'Communicating DGT\'s technological vision to the world through strong media narratives.',
          experience: {
            role: 'Brand Architect',
            work: 'Leading social media strategy, visual campaigns, and operational documentations.',
            achievements: 'Boosted DGT organic brand reach by 300% within 6 months.'
          },
          portfolio: 'https://rifky.media',
          ig: '@rifky_media'
        },
        {
          name: 'Bayu',
          role: 'Head Social Media & Marketing',
          bio: 'Organic growth specialist and architect of measurable digital marketing campaigns.',
          experience: {
            role: 'Growth Marketer',
            work: 'Optimizing DGT\'s client acquisition funnel through automated marketing systems.',
            achievements: 'Boosted marketing ROI by 350% within a single quarter.'
          },
          portfolio: 'https://bayu.growth',
          ig: '@bayu_marketing'
        },
        {
          name: 'Rama',
          role: 'Head Robotic',
          bio: 'Robotics engineer integrating autonomous AI agents with physical actuators.',
          experience: {
            role: 'Robotics System Engineer',
            work: 'Designing autonomous robotic arms and assembly line automation systems.',
            achievements: 'Deployed 15+ autonomous robotic systems in local manufacturing.'
          },
          portfolio: 'https://rama.robotics',
          ig: '@rama_robotics'
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
    bundel: {
      t1: 'Autonomous ', t1_i: 'Bundles Catalog.',
      d1: 'Ready-to-deploy system packages engineered to resolve your operational bottlenecks instantly with extreme efficiency.',
      cta: 'Get AI Blueprint',
      pesan: 'Order Bundle',
      categories: {
        pos: 'POS & Inventory',
        crm: 'AI Agents & CRM',
        office: 'Office Automation'
      },
      packages: {
        pos: [
          {
            name: 'Lite Launch',
            desc: 'Digital cash register system integrated with basic stock analytics for small businesses.',
            features: [
              'Adaptive Point of Sale (POS)',
              'Basic Stock & Sales Analytics',
              'Automatic Low Stock Alerts',
              'Daily Sales Reports via WhatsApp',
              'Fast & Responsive Brutalist UI'
            ],
            duration: '4 Weeks',
            impact: 'Saves 15 hours/week of administrative tasks'
          },
          {
            name: 'Pro Scale',
            desc: 'Autonomous checkout and supply chain ecosystem for multi-outlet retailers.',
            features: [
              'All features in Lite Launch package',
              'AI-Driven Demand Forecasting',
              'Automated Purchase Order (PO) Creation',
              'AI Invoice & Receipt Matching',
              'WhatsApp Agent for Real-Time Stock Checks'
            ],
            duration: '6 Weeks',
            impact: '99.8% stock accuracy without daily manual audits'
          },
          {
            name: 'Enterprise Edge',
            desc: 'Bespoke warehouse architecture and enterprise-scale cash register networks.',
            features: [
              'All features in Pro Scale package',
              'ERP & Custom Logistics Integration',
              'AI Waste & Damage Mitigation/Prediction',
              'AI Camera for Barcode & Visual Audit',
              'Custom Physical Stand/Enclosure (3D Printed)',
              '24/7 CTO-Grade Dedicated Technical Support'
            ],
            duration: '8-12 Weeks',
            impact: '10x scaling potential without hiring ops staff'
          }
        ],
        crm: [
          {
            name: 'Agent Basic',
            desc: '24/7 WhatsApp chat assistant to resolve FAQs and capture leads.',
            features: [
              'Instant & Accurate Chat Responses 24/7',
              'Custom FAQ Database Integration',
              'Automated Lead Information Capture',
              'Escalation Paths to Human Support',
              'Simple Leads Dashboard'
            ],
            duration: '3 Weeks',
            impact: 'Responds to 100% of customer questions instantly'
          },
          {
            name: 'Agent Pro',
            desc: 'Collaborative multi-agent AI system for sales and support pipelines.',
            features: [
              'All features in Agent Basic package',
              'Multi-Agent System (Answering Agent + Sales Closer)',
              'Direct Sync with CRM (Hubspot/Notion/etc.)',
              'Scheduled Automated Customer Follow-Ups',
              'Real-Time Chat Sentiment Analysis'
            ],
            duration: '5 Weeks',
            impact: 'Increases sales conversion rates by up to 40%'
          },
          {
            name: 'Agent Enterprise',
            desc: 'Fully integrated custom text and voice telephony agent infrastructure.',
            features: [
              'All features in Agent Pro package',
              'Bespoke Voice Telephony Agent (AI Phone Calls)',
              'AI Model Fine-Tuning on Proprietary Company Data',
              'Enterprise-Grade Security (On-Premise Deployment)',
              'Deep Customer Behavior Analytics'
            ],
            duration: '8+ Weeks',
            impact: 'Takes over 95% of customer contact center workloads'
          }
        ],
        office: [
          {
            name: 'Admin Lite',
            desc: 'Automated document reading and incoming data ingestion.',
            features: [
              'Intelligent PDF & Image Reader (AI OCR)',
              'Key Contract/Invoice Information Extraction',
              'Automated File Archiving',
              'AI-Based Incoming Email Classification',
              'Google Sheets & Google Drive Integration'
            ],
            duration: '3 Weeks',
            impact: 'Cuts document data entry time by 80%'
          },
          {
            name: 'Admin Pro',
            desc: 'Autonomous document processing pipeline and database sync.',
            features: [
              'All features in Admin Lite package',
              'Complex Multi-Document Extraction Pipeline',
              'Automatic Ingestion to Main DB / ERP',
              'Automatic Slack/Telegram/Discord Notifications',
              'Intelligent Financial Reconciliation Matching'
            ],
            duration: '5 Weeks',
            impact: 'Zero human errors in monthly invoice entry'
          },
          {
            name: 'Admin Enterprise',
            desc: 'Internal corporate knowledge management and autonomous work assistants.',
            features: [
              'All features in Admin Pro package',
              'AI Company Knowledge Base Search (RAG)',
              'Automated Compliance & Legal Document Audit',
              'AI-Generated Custom Contracts & Drafts',
              'Operational Efficiency Analytics Dashboard'
            ],
            duration: '8+ Weeks',
            impact: 'Saves up to 90% of employee internal lookup time'
          }
        ]
      }
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
    <section id="manifesto" ref={heroRef} className="min-h-[90vh] flex flex-col justify-center gap-24 scroll-mt-32 relative z-10 overflow-hidden">
      
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

        <div className="flex items-center gap-8">
          <span>{t.hero.sub1}</span>
          <span className="h-[1px] w-24 bg-[#D46B4A]"></span>
          <span className="text-[#D46B4A] font-maroni text-sm tracking-widest">DGT_LZ</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-maroni tracking-tighter text-[#FAFAFA] mt-6 flex items-baseline leading-none">
          DGT_LZ
          <span className="inline-block w-3 h-3 md:w-4 md:h-4 bg-[#D46B4A] rounded-full ml-1 md:ml-2"></span>
        </h1>
        <span className="mt-3 text-[#737373] tracking-widest font-mono text-[10px] md:text-xs">{t.hero.sub2}</span>
      </div>

      <div className="max-w-4xl mt-4 hero-elem invisible">
        <h2 className="text-4xl md:text-6xl font-clash font-normal leading-[1.2] tracking-tight text-[#FAFAFA]">
          {t.hero.title1}<i className="text-[#D46B4A]">{t.hero.title1_i}</i><br />
          {t.hero.title2}<i className="text-[#D46B4A]">{t.hero.title2_i}</i>
        </h2>
      </div>

      <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-[#A3A3A3] font-light mt-4 hero-elem invisible">
        {t.hero.p1}
      </p>

      <div className="mt-8 hero-elem invisible">
        <div className="relative pl-8 py-2 border-l border-[#D46B4A]">
          <h3 className="text-2xl md:text-3xl font-clash text-[#FAFAFA] mb-3 font-bold">
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
          <div key={idx} className="flex flex-col pt-8 md:pt-0 md:px-6 lg:px-12 first:md:pl-0 last:md:pr-0 group">
            <div className="text-5xl md:text-5xl lg:text-6xl font-syne font-extrabold text-[#FAFAFA] mb-4 tracking-tighter group-hover:text-[#D46B4A] transition-colors duration-500">{stat.num}</div>
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
  return (
    <section id="layanan" className="flex flex-col gap-32 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        <div className="lg:w-1/3 relative">
          <AnimatedSection className="sticky top-32">
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
              {t.layanan.t1}<i className="text-[#D46B4A] italic">{t.layanan.t1_i}</i>
            </h2>
            <p className="text-[#A3A3A3] font-light text-lg">
              {t.layanan.d1}
            </p>
          </AnimatedSection>
        </div>

        <div className="lg:w-2/3">
          <AnimatedSection stagger={true} className="flex flex-col gap-12">
            {t.layanan.list1.map((item, idx) => (
              <div 
                key={idx} 
                className="flex gap-8 items-start pb-8 border-b border-[#2A2A2A]/40 last:border-0 last:pb-0"
              >
                <div className="text-2xl font-mono text-[#D46B4A] font-bold shrink-0">{item.num}</div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-lg font-clash font-bold text-[#FAFAFA] tracking-wide">{item.title}</h4>
                  <p className="text-[#A3A3A3] leading-relaxed font-light text-sm">
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
            <h2 className="text-3xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
              {t.layanan.t2}<i className="text-[#D46B4A]">{t.layanan.t2_i}</i>
            </h2>
            <p className="text-[#A3A3A3] font-light text-lg">
              {t.layanan.d2}
            </p>
            <div className="flex items-center gap-3 mt-8 text-[9px] md:text-[10px] font-mono text-[#D46B4A]/80 uppercase tracking-[0.25em] font-bold">
              <span className="w-6 h-[1px] bg-[#D46B4A]/50"></span>
              <span className="inline md:hidden animate-pulse">Swipe to explore →</span>
              <span className="hidden md:inline animate-pulse">Scroll to explore →</span>
            </div>
          </AnimatedSection>
        </div>

        <div className="lg:w-2/3 w-full overflow-hidden">
          <AnimatedSection stagger={true} className="flex overflow-x-auto gap-6 pb-6 pt-2 custom-scrollbar snap-x snap-mandatory no-scrollbar lg:custom-scrollbar">
            {t.layanan.list2.map((svc, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col p-10 bg-[#111111]/30 backdrop-blur-sm border border-[#2A2A2A] hover:border-[#D46B4A] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(212,107,74,0.08)] transition-all duration-500 w-[290px] md:w-[340px] shrink-0 snap-start"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#D46B4A] font-mono font-bold">{svc.id}</div>
                  <div className="w-8 h-[1px] bg-[#2A2A2A] group-hover:bg-[#D46B4A] transition-colors duration-500 group-hover:w-12"></div>
                </div>
                <h3 className="text-2xl font-clash font-bold text-[#FAFAFA] mb-4">{svc.title}</h3>
                <p className="text-[#A3A3A3] leading-relaxed font-light">{svc.desc}</p>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

// --- BAGIAN 2.1: ABOUT US & SKEMA BISNIS ---
const AboutUs = ({ t }) => (
  <section id="about" className="flex flex-col gap-24 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
      <div className="lg:w-1/3">
        <AnimatedSection className="sticky top-32">
          <h2 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
            {t.about.t1}<i className="text-[#D46B4A] italic">{t.about.t1_i}</i>
          </h2>
        </AnimatedSection>
      </div>
      <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
        <AnimatedSection>
          <p className="text-[#A3A3A3] font-light text-lg leading-relaxed">
            {t.about.p1}
          </p>
        </AnimatedSection>
        <AnimatedSection>
          <p className="text-[#A3A3A3] font-light text-lg leading-relaxed">
            {t.about.p2}
          </p>
        </AnimatedSection>
      </div>
    </div>

    {/* BUSINESS SCHEME FLOW */}
    <div className="flex flex-col gap-12 border-t border-[#2A2A2A] pt-16">
      <AnimatedSection className="max-w-2xl">
        <h3 className="text-3xl md:text-4xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
          {t.about.t_skema}<i className="text-[#D46B4A]">{t.about.t_skema_i}</i>
        </h3>
        <p className="text-[#A3A3A3] font-light text-base">
          {t.about.skema_desc}
        </p>
      </AnimatedSection>

      <AnimatedSection stagger={true} className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {t.about.phases.map((phase, idx) => (
          <div key={idx} className="p-8 bg-[#111111]/30 backdrop-blur-sm border border-[#2A2A2A] hover:border-[#D46B4A] hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(212,107,74,0.06)] transition-all duration-500 flex flex-col justify-between min-h-[220px] group">
            <div>
              <div className="text-xs font-mono font-bold text-[#D46B4A] uppercase tracking-[0.2em] mb-4">
                0{idx + 1} // Phase
              </div>
              <h4 className="text-lg font-clash font-bold text-[#FAFAFA] mb-3 group-hover:text-[#D46B4A] transition-colors">
                {phase.title}
              </h4>
            </div>
            <p className="text-[#737373] group-hover:text-[#A3A3A3] text-sm font-light leading-relaxed transition-colors">
              {phase.desc}
            </p>
          </div>
        ))}
      </AnimatedSection>
    </div>
  </section>
);

// --- BAGIAN 2.2: PARTNERSHIP ---
const Partnership = ({ t, partnerships, lang }) => (
  <section id="partnership" className="flex flex-col gap-16 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
    <AnimatedSection>
      <h2 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
        {t.partnership.t1}<i className="text-[#D46B4A]">{t.partnership.t1_i}</i>
      </h2>
      <p className="max-w-2xl text-[#A3A3A3] font-light text-lg">
        {t.partnership.d1}
      </p>
    </AnimatedSection>
    <AnimatedSection stagger={true} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {partnerships.map((item, idx) => (
        <div key={item.id || idx} className="p-10 bg-[#111111]/30 backdrop-blur-sm border border-[#2A2A2A] hover:border-[#D46B4A] hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(212,107,74,0.06)] transition-all duration-500">
          <h3 className="text-xl font-clash font-bold text-[#FAFAFA] mb-4">
            {lang === 'id' ? (item.title_id || item.title) : (item.title_en || item.title || item.title_id)}
          </h3>
          <p className="text-[#A3A3A3] font-light leading-relaxed">
            {lang === 'id' ? (item.desc_id || item.desc) : (item.desc_en || item.desc || item.desc_id)}
          </p>
        </div>
      ))}
    </AnimatedSection>
  </section>
);

// --- BAGIAN 2.3: OUR WORK ---
const OurWork = ({ t, publicWorks, lang, onOpenCaseStudy }) => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'client' | 'concept'

  const filteredWorks = activeFilter === 'all' 
    ? publicWorks 
    : publicWorks.filter(item => item.type === activeFilter);

  return (
    <section id="work" className="flex flex-col gap-16 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
      <AnimatedSection>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
              {t.work.t1}<i className="text-[#D46B4A]">{t.work.t1_i}</i>
            </h2>
            <p className="max-w-2xl text-[#A3A3A3] font-light text-lg">
              {t.work.d1}
            </p>
          </div>
          
          {/* Portfolio Filter Tabs */}
          <div className="flex gap-2 bg-[#0a0a0a] p-1 border border-[#151515] rounded font-mono text-[8px] font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded transition-all duration-300 ${activeFilter === 'all' ? 'bg-[#D46B4A] text-white font-bold' : 'text-[#737373] hover:text-white font-bold'}`}
            >
              {lang === 'id' ? 'Semua' : 'All Works'}
            </button>
            <button
              onClick={() => setActiveFilter('client')}
              className={`px-3 py-1.5 rounded transition-all duration-300 ${activeFilter === 'client' ? 'bg-[#D46B4A] text-white font-bold' : 'text-[#737373] hover:text-white font-bold'}`}
            >
              {lang === 'id' ? 'Proyek Klien' : 'Client Projects'}
            </button>
            <button
              onClick={() => setActiveFilter('concept')}
              className={`px-3 py-1.5 rounded transition-all duration-300 ${activeFilter === 'concept' ? 'bg-[#D46B4A] text-white font-bold' : 'text-[#737373] hover:text-white font-bold'}`}
            >
              {lang === 'id' ? 'Konsep & Blueprint' : 'Concepts'}
            </button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection stagger={true} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredWorks.map((item, idx) => (
          <div key={item.id || idx} className="group flex flex-col gap-6 hover:-translate-y-2 transition-all duration-500">
            <div className="aspect-video w-full bg-[#111111]/30 backdrop-blur-sm border border-[#2A2A2A] overflow-hidden relative group-hover:border-[#D46B4A] transition-all duration-500 flex items-center justify-center">
              {item.image ? (
                <img src={item.image} alt={item.title} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-85 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 bg-[#111]/80 flex items-center justify-center text-[10px] font-mono text-[#D46B4A] tracking-widest uppercase">
                  {item.title}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60 pointer-events-none"></div>
              
              {/* Type Badge & Tags */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`text-[7px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${item.type === 'concept' ? 'bg-[#D46B4A]/10 border-[#D46B4A]/30 text-[#D46B4A]' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
                  {item.type === 'concept' ? (lang === 'id' ? 'Konsep' : 'Concept') : (lang === 'id' ? 'Proyek' : 'Active Project')}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                {(item.tags || []).map((tag, tidx) => (
                  <span key={tidx} className="text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-1 bg-[#111] border border-[#222] text-[#A3A3A3] rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-clash font-bold text-[#FAFAFA] group-hover:text-[#D46B4A] transition-colors">
                {item.title}
              </h3>
              <p className="text-[#737373] text-sm font-light leading-relaxed">
                {lang === 'id' ? (item.desc_id || item.desc) : (item.desc_en || item.desc || item.desc_id)}
              </p>
              <button
                onClick={() => onOpenCaseStudy(item)}
                className="text-[10px] font-mono font-bold text-[#D46B4A] uppercase tracking-widest hover:underline text-left mt-2 flex items-center gap-1.5"
              >
                {lang === 'id' ? 'Baca Case Study' : 'Read Case Study'} <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </AnimatedSection>
    </section>
  );
};

// --- BAGIAN 2.4: OUR TEAM ---
const OurTeam = ({ t }) => {
  const [wheelIndex, setWheelIndex] = useState(0);
  const [dragAngle, setDragAngle] = useState(null);
  const wheelRef = useRef(null);
  const isScrolling = useRef(false);
  const startY = useRef(0);
  const startAngle = useRef(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);

  const members = t.team.members;
  const total = members.length;

  const currentAngle = dragAngle !== null ? dragAngle : -wheelIndex * (360 / total);
  const virtualWheelIndex = -currentAngle / (360 / total);
  const activeIdx = ((Math.round(virtualWheelIndex) % total) + total) % total;
  const activeMember = members[activeIdx];

  const playClick = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);
      
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  };

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    playClick();
  }, [activeIdx]);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling.current) return;
      isScrolling.current = true;

      if (e.deltaY > 0) {
        setWheelIndex((prev) => prev + 1);
      } else {
        setWheelIndex((prev) => prev - 1);
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [total]);

  const handleStart = (clientY) => {
    isDragging.current = true;
    hasDragged.current = false;
    startY.current = clientY;
    startAngle.current = dragAngle !== null ? dragAngle : -wheelIndex * (360 / total);
    setDragAngle(startAngle.current);
  };

  useEffect(() => {
    if (dragAngle === null) return;

    const handleWindowMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaY = e.clientY - startY.current;
      if (Math.abs(deltaY) > 5) {
        hasDragged.current = true;
      }
      const angle = startAngle.current + deltaY * 0.4;
      setDragAngle(angle);
    };

    const handleWindowTouchMove = (e) => {
      if (!isDragging.current || !e.touches[0]) return;
      const deltaY = e.touches[0].clientY - startY.current;
      if (Math.abs(deltaY) > 5) {
        hasDragged.current = true;
      }
      const angle = startAngle.current + deltaY * 0.4;
      setDragAngle(angle);
    };

    const handleWindowEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const finalAngle = dragAngle;
      const closestIndex = Math.round(-finalAngle / (360 / total));
      setWheelIndex(closestIndex);
      setDragAngle(null);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowEnd);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
    window.addEventListener('touchend', handleWindowEnd);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowEnd);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowEnd);
    };
  }, [dragAngle, total]);

  const handleCardClick = (idx) => {
    if (hasDragged.current) return;
    const currentActive = ((wheelIndex % total) + total) % total;
    let diff = idx - currentActive;
    
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    
    setWheelIndex((prev) => prev + diff);
  };

  return (
    <section id="team" className="flex flex-col gap-16 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
      <AnimatedSection>
        <h2 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
          {t.team.t1}<i className="text-[#D46B4A]">{t.team.t1_i}</i>
        </h2>
        <p className="max-w-2xl text-[#A3A3A3] font-light text-lg">
          {t.team.d1}
        </p>
      </AnimatedSection>

      {/* Desktop Wheel UI */}
      <div className="hidden lg:flex gap-12 items-center">
        {/* Left Side: Detailed Dossier Panel */}
        <div className="w-1/2 flex flex-col gap-6 min-h-[480px] relative justify-center">
          <div key={activeIdx} className="flex flex-col gap-6 p-10 bg-[#111111]/30 backdrop-blur-sm border border-[#2A2A2A]/60 rounded-xl relative overflow-hidden animate-fade-in shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D46B4A]" />
            
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 bg-[#111111] border border-[#2A2A2A] relative flex items-center justify-center overflow-hidden rounded-xl shrink-0 shadow-inner">
                <span className="text-[#D46B4A] font-maroni text-5xl font-bold select-none">{activeMember?.name[0]}</span>
              </div>
              <div>
                <h3 className="text-3xl font-clash font-bold text-[#FAFAFA] mb-1">{activeMember?.name}</h3>
                <div className="text-xs font-mono text-[#D46B4A] uppercase tracking-[0.2em] font-bold">{activeMember?.role}</div>
              </div>
            </div>

            <p className="text-[#A3A3A3] text-base font-light leading-relaxed min-h-[4.5rem]">
              {activeMember?.bio}
            </p>

            <div className="pt-6 border-t border-[#2A2A2A] flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#737373] uppercase tracking-widest font-bold">Experience</span>
                  <span className="text-sm text-[#FAFAFA] font-clash leading-snug">{activeMember?.experience.role}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#737373] uppercase tracking-widest font-bold">Key Work</span>
                  <span className="text-sm text-[#A3A3A3] font-light leading-snug">{activeMember?.experience.work}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <span className="text-[10px] font-mono text-[#737373] uppercase tracking-widest font-bold">Achievements</span>
                <span className="text-sm text-[#D46B4A] italic font-light">{activeMember?.experience.achievements}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center pt-4 border-t border-[#2A2A2A]/40">
              <div className="flex gap-6">
                <a href={activeMember?.portfolio} target="_blank" rel="noreferrer" className="text-[10px] font-mono font-bold text-[#D46B4A] uppercase tracking-widest hover:underline">Portfolio ↗</a>
                <a href={`https://instagram.com/${activeMember?.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-[10px] font-mono font-bold text-[#737373] uppercase tracking-widest hover:text-[#FAFAFA] transition-colors">Instagram</a>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setWheelIndex(prev => prev - 1)}
                  className="w-5 h-5 rounded border border-[#2A2A2A] hover:border-[#D46B4A] text-[#737373] hover:text-[#FAFAFA] flex items-center justify-center transition-all font-mono text-[8px] select-none bg-transparent active:scale-90"
                  title="Rotate Up"
                >
                  ▲
                </button>
                <button
                  onClick={() => setWheelIndex(prev => prev + 1)}
                  className="w-5 h-5 rounded border border-[#2A2A2A] hover:border-[#D46B4A] text-[#737373] hover:text-[#FAFAFA] flex items-center justify-center transition-all font-mono text-[8px] select-none bg-transparent active:scale-90"
                  title="Rotate Down"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Circular Orbiting Wheel */}
        <div 
          className="w-1/2 flex items-center justify-center h-[520px] relative overflow-hidden select-none"
          onMouseDown={(e) => handleStart(e.clientY)}
          onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        >
          {/* Circular Orbit Track */}
          <div 
            className="absolute rounded-full border border-dashed border-[#2A2A2A]/60 bg-black/10 pointer-events-none"
            style={{
              width: '400px',
              height: '400px',
              left: '340px',
              top: '250px',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Core Hub Glow */}
          <div 
            className="absolute rounded-full bg-[#D46B4A]/5 blur-[60px] pointer-events-none"
            style={{
              width: '280px',
              height: '280px',
              left: '340px',
              top: '250px',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Central Logo Hub Frame */}
          <div 
            className="absolute rounded-full border border-[#2A2A2A] bg-[#0A0A0A]/85 backdrop-blur-md shadow-[0_0_50px_rgba(212,107,74,0.15)] flex items-center justify-center overflow-hidden z-10"
            style={{
              width: '200px',
              height: '200px',
              left: '340px',
              top: '250px',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img 
              src="/dgt_lz_logo.svg" 
              alt="DGT_LZ Logo" 
              className="w-28 h-28 object-cover rounded-full border border-[#2A2A2A] overflow-hidden shadow-md" 
            />
          </div>

          {/* Mouse Wheel Scroll Indicator */}
          <div className="absolute top-4 right-12 z-30 flex flex-col items-center gap-1.5 animate-pulse pointer-events-none opacity-40">
            <div className="text-[8px] font-mono text-[#737373] uppercase tracking-[0.3em]">Drag or Scroll</div>
            <svg width="10" height="16" viewBox="0 0 12 20" fill="none">
              <rect x="1" y="1" width="10" height="18" rx="5" stroke="#737373" strokeWidth="1.5"/>
              <circle cx="6" cy="6" r="1.5" fill="#D46B4A">
                <animate attributeName="cy" values="6;14;6" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>

          {/* Rotating Wheel Container */}
          <div 
            ref={wheelRef} 
            className="absolute cursor-ns-resize z-20"
            style={{
              left: '340px',
              top: '250px',
              width: '0px',
              height: '0px',
              transform: `rotate(${currentAngle}deg)`,
              transition: dragAngle !== null ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d',
            }}
          >
            {members.map((member, idx) => {
              const isActive = idx === activeIdx;
              const cardFixedAngle = idx * (360 / total) + 180;
              
              const diff = idx - virtualWheelIndex;
              let shortestDiff = diff;
              if (shortestDiff > total / 2) shortestDiff -= total;
              if (shortestDiff < -total / 2) shortestDiff += total;
              const absDiff = Math.abs(shortestDiff);

              const scale = 1.05 - Math.min(absDiff, 1.5) * 0.15;
              const opacity = Math.max(0.2, 1 - Math.min(absDiff, 1.5) * 0.5);
              const zIndex = 10 - Math.round(absDiff * 2);

              return (
                <div
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  style={{
                    position: 'absolute',
                    width: '240px',
                    transform: `translate(-50%, -50%) rotate(${cardFixedAngle}deg) translate(200px) rotate(-180deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: dragAngle !== null ? 'opacity 0.1s ease, transform 0.1s ease' : 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl border backdrop-blur-md transition-all duration-500 group select-none ${
                    isActive
                      ? 'bg-[#D46B4A]/10 border-[#D46B4A] shadow-[0_4px_24px_rgba(212,107,74,0.15)]'
                      : 'bg-[#111111]/80 border-[#2A2A2A]/80 hover:border-[#D46B4A]/50 hover:bg-[#111111]/90'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-maroni text-base font-bold transition-all shrink-0 ${
                    isActive ? 'bg-[#D46B4A] text-white' : 'bg-[#2A2A2A] text-[#FAFAFA]'
                  }`}>
                    {member.name[0]}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-clash font-bold text-[#FAFAFA] truncate group-hover:text-[#D46B4A] transition-colors">{member.name}</span>
                    <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider truncate">{member.role}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orbit Navigation Indicator Ring */}
          <div 
            className="absolute rounded-full border-2 border-[#D46B4A] pointer-events-none z-10"
            style={{
              width: '24px',
              height: '24px',
              left: '140px', 
              top: '250px',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 12px rgba(212, 107, 74, 0.4)',
            }}
          />
        </div>
      </div>

      {/* Mobile/Tablet Fallback UI */}
      <div className="flex lg:hidden flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {members.map((member, idx) => (
            <div key={idx} className="flex flex-col gap-6 p-8 bg-[#111111]/30 backdrop-blur-sm border border-[#2A2A2A] rounded-xl hover:border-[#D46B4A] transition-all duration-500">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-[#111111] border border-[#2A2A2A] flex items-center justify-center rounded-xl shrink-0">
                  <span className="text-[#D46B4A] font-maroni text-3xl font-bold">{member.name[0]}</span>
                </div>
                <div>
                  <h3 className="text-xl font-clash font-bold text-[#FAFAFA] mb-1">{member.name}</h3>
                  <div className="text-[10px] font-mono text-[#D46B4A] uppercase tracking-[0.15em] font-bold">{member.role}</div>
                </div>
              </div>
              
              <p className="text-[#A3A3A3] text-sm font-light leading-relaxed">
                {member.bio}
              </p>

              <div className="pt-4 border-t border-[#2A2A2A]/40 flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider font-bold">Experience</span>
                  <span className="text-xs text-[#FAFAFA] font-clash">{member.experience.role}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider font-bold">Key Work</span>
                  <span className="text-xs text-[#A3A3A3] font-light">{member.experience.work}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider font-bold">Achievements</span>
                  <span className="text-xs text-[#D46B4A] italic font-light">{member.experience.achievements}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A2A2A]/40 flex gap-4">
                <a href={member.portfolio} target="_blank" rel="noreferrer" className="text-[10px] font-mono font-bold text-[#D46B4A] uppercase tracking-widest hover:underline">Portfolio ↗</a>
                <a href={`https://instagram.com/${member.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-[10px] font-mono font-bold text-[#737373] uppercase tracking-widest hover:text-[#FAFAFA] transition-colors">Instagram</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- BAGIAN 3: DOKTRIN ---
const Doktrin = ({ t }) => (
  <section id="doktrin" className="flex flex-col lg:flex-row gap-12 lg:gap-24 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
    <div className="lg:w-1/3 relative">
      <AnimatedSection className="sticky top-32">
        <h2 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
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
            <div className="font-syne font-extrabold text-2xl text-[#2A2A2A] group-hover:text-[#D46B4A] shrink-0 mt-[-4px] transition-colors">
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
        <h2 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
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
              <span className="text-2xl font-clash font-normal text-[#D46B4A] shrink-0 transition-transform duration-300">
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

// --- BAGIAN 4.5: KATALOG BUNDEL ---
const KatalogBundel = ({ t, onSelectBundle }) => {
  const [activeCategory, setActiveCategory] = useState('pos');
  const [activeIndex, setActiveIndex] = useState(1);
  const wheelRef = useRef(null);
  const isScrolling = useRef(false);

  const packages = t.bundel.packages[activeCategory];
  const total = packages.length;

  // Handle wheel scroll to rotate through cards
  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling.current) return;
      isScrolling.current = true;
      if (e.deltaY > 0) {
        setActiveIndex(prev => Math.min(prev + 1, total - 1));
      } else {
        setActiveIndex(prev => Math.max(prev - 1, 0));
      }
      setTimeout(() => { isScrolling.current = false; }, 600);
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [total]);

  // Reset to middle card when category changes
  useEffect(() => {
    setActiveIndex(1);
  }, [activeCategory]);

  const getCardStyle = (idx) => {
    const offset = idx - activeIndex;
    const absOffset = Math.abs(offset);
    
    // 3D water-wheel rotation
    const rotateX = offset * -35;
    const translateY = offset * 220;
    const translateZ = -absOffset * 180;
    const scale = 1 - absOffset * 0.15;
    const opacity = absOffset > 1 ? 0.15 : absOffset === 1 ? 0.5 : 1;
    const zIndex = 10 - absOffset;
    const blur = absOffset > 0 ? absOffset * 2 : 0;

    return {
      transform: `perspective(1200px) rotateX(${rotateX}deg) translateY(${translateY}px) translateZ(${translateZ}px) scale(${scale})`,
      opacity,
      zIndex,
      filter: blur > 0 ? `blur(${blur}px)` : 'none',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: '-240px',
      marginTop: '-220px',
      width: '480px',
      pointerEvents: absOffset === 0 ? 'auto' : 'none',
    };
  };

  return (
    <section id="bundel" className="flex flex-col gap-16 pt-24 pb-12 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <AnimatedSection className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
            {t.bundel.t1}<i className="text-[#D46B4A] italic">{t.bundel.t1_i}</i>
          </h2>
          <p className="text-[#A3A3A3] font-light text-lg">
            {t.bundel.d1}
          </p>
        </AnimatedSection>
        
        <AnimatedSection className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto font-mono text-[10px] md:text-xs uppercase tracking-widest font-bold z-20">
          {Object.entries(t.bundel.categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-3 border transition-all duration-300 ${
                activeCategory === key
                  ? 'bg-[#D46B4A] text-white border-[#D46B4A]'
                  : 'bg-transparent text-[#737373] border-[#2A2A2A] hover:border-[#FAFAFA]/30 hover:text-[#FAFAFA]'
              }`}
            >
              {label}
            </button>
          ))}
        </AnimatedSection>
      </div>

      {/* Scroll wheel carousel */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 3D Wheel Container */}
        <div 
          ref={wheelRef}
          className="relative w-full lg:w-[520px] flex-shrink-0 overflow-hidden cursor-ns-resize"
          style={{ height: '560px', perspective: '1200px' }}
        >
          {/* Scroll hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 animate-pulse pointer-events-none">
            <div className="text-[8px] font-mono text-[#737373] uppercase tracking-[0.3em]">Scroll</div>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="opacity-40">
              <rect x="1" y="1" width="10" height="18" rx="5" stroke="#737373" strokeWidth="1.5"/>
              <circle cx="6" cy="6" r="1.5" fill="#D46B4A">
                <animate attributeName="cy" values="6;14;6" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>

          {packages.map((pkg, idx) => (
            <div
              key={`${activeCategory}-${idx}`}
              style={getCardStyle(idx)}
              className={`flex flex-col p-8 md:p-10 bg-[#111111]/60 backdrop-blur-md border transition-all duration-500 relative group ${
                idx === activeIndex
                  ? 'border-[#D46B4A] shadow-[0_10px_50px_rgba(212,107,74,0.2)]'
                  : 'border-[#2A2A2A]'
              }`}
            >
              {idx === 1 && (
                <div className="absolute -top-3.5 right-6 bg-[#D46B4A] text-white font-mono text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 border border-[#D46B4A]">
                  Recommended
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#737373] font-mono font-bold">
                  0{idx + 1} // {t.bundel.categories[activeCategory]}
                </div>
                <div className="text-[10px] font-mono text-[#D46B4A] uppercase tracking-[0.2em] font-bold">
                  {pkg.duration}
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-clash font-bold text-[#FAFAFA] mb-3 group-hover:text-[#D46B4A] transition-colors">
                {pkg.name}
              </h3>
              
              <p className="text-[#A3A3A3] text-sm font-light leading-relaxed mb-6">
                {pkg.desc}
              </p>

              <div className="border-t border-[#2A2A2A] py-4 mb-4">
                <div className="text-[9px] font-mono text-[#737373] uppercase tracking-[0.2em] font-bold mb-2">
                  Target Impact
                </div>
                <div className="text-sm font-clash italic text-[#FAFAFA] pl-4 border-l border-[#D46B4A]">
                  "{pkg.impact}"
                </div>
              </div>

              <button
                onClick={() => onSelectBundle(pkg.name, t.bundel.categories[activeCategory])}
                className={`w-full py-3 text-center font-mono font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 border ${
                  idx === 1
                    ? 'bg-[#FAFAFA] text-[#0A0A0A] border-[#FAFAFA] hover:bg-[#D46B4A] hover:text-white hover:border-[#D46B4A]'
                    : 'bg-transparent text-[#FAFAFA] border-[#2A2A2A] hover:border-[#D46B4A] hover:text-[#D46B4A]'
                }`}
              >
                {t.bundel.pesan}
              </button>
            </div>
          ))}

          {/* Progress dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {packages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-400 rounded-full ${
                  idx === activeIndex
                    ? 'w-8 h-2 bg-[#D46B4A]'
                    : 'w-2 h-2 bg-[#2A2A2A] hover:bg-[#737373]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Side detail panel - shows features of the active card */}
        <div className="flex-grow hidden lg:flex flex-col gap-6 pt-8">
          <div className="text-[9px] font-mono text-[#D46B4A] uppercase tracking-[0.3em] font-bold">
            ▪ Key Features — {packages[activeIndex]?.name}
          </div>
          <ul className="flex flex-col gap-4">
            {packages[activeIndex]?.features.map((feature, fIdx) => (
              <li 
                key={fIdx} 
                className="flex items-start gap-3 text-sm text-[#A3A3A3] font-light leading-relaxed"
                style={{
                  animation: `fadeSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${fIdx * 0.08}s both`
                }}
              >
                <span className="text-[#D46B4A] font-mono select-none mt-0.5">✦</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSelectBundle(packages[activeIndex]?.name, t.bundel.categories[activeCategory])}
            className="mt-4 w-fit px-8 py-4 text-center font-mono font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 border bg-[#D46B4A] text-white border-[#D46B4A] hover:bg-[#c25a3a] hover:shadow-[0_6px_24px_rgba(212,107,74,0.4)]"
          >
            {t.bundel.pesan}
          </button>
        </div>
      </div>
    </section>
  );
};


// --- BAGIAN 5: KONTAK ---
const Kontak = ({ t, objective, setObjective }) => {
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('whatsapp'); // 'whatsapp' | 'instagram'

  return (
    <section id="kontak" className="flex flex-col gap-16 pt-24 pb-24 scroll-mt-24 border-t border-[#2A2A2A] relative z-10">
      <AnimatedSection>
        <h2 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-[#FAFAFA] mb-6">
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
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-b border-[#2A2A2A] focus:border-[#D46B4A] focus:shadow-[0_1px_0_0_#D46B4A] outline-none py-3 text-[#FAFAFA] font-clash transition-all duration-300" 
                placeholder={t.kontak.p1} 
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <label className="text-[10px] text-[#A3A3A3] uppercase tracking-[0.2em] font-mono font-bold">{t.kontak.f2}</label>
              <div className="flex gap-4 font-mono text-[10px] uppercase font-bold tracking-wider">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`flex-1 py-3 border text-center transition-all ${
                    channel === 'whatsapp'
                      ? 'border-[#D46B4A] bg-[#D46B4A]/10 text-[#FAFAFA]'
                      : 'border-[#2A2A2A] text-[#737373] hover:text-[#FAFAFA]'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('instagram')}
                  className={`flex-1 py-3 border text-center transition-all ${
                    channel === 'instagram'
                      ? 'border-[#D46B4A] bg-[#D46B4A]/10 text-[#FAFAFA]'
                      : 'border-[#2A2A2A] text-[#737373] hover:text-[#FAFAFA]'
                  }`}
                >
                  Instagram DM
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] text-[#A3A3A3] uppercase tracking-[0.2em] font-mono font-bold">{t.kontak.f3}</label>
              <textarea 
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="bg-transparent border-b border-[#2A2A2A] focus:border-[#D46B4A] focus:shadow-[0_1px_0_0_#D46B4A] outline-none py-3 text-[#FAFAFA] font-clash transition-all duration-300 resize-none h-28" 
                placeholder={t.kontak.p3}
              ></textarea>
            </div>
            <button 
              className="group mt-6 bg-[#FAFAFA] text-[#0A0A0A] font-mono font-bold py-4 px-8 uppercase tracking-[0.2em] text-xs hover:bg-[#D46B4A] hover:text-[#FAFAFA] hover:shadow-[0_10px_20px_rgba(212,107,74,0.25)] hover:-translate-y-0.5 transition-all duration-300 w-fit self-start flex items-center gap-3 overflow-hidden border border-transparent"
              onClick={() => {
                const isIndo = t.kontak.btn === 'Dapatkan Blueprint AI';
                if (!name.trim()) {
                  alert(isIndo ? 'Mohon isi Nama Anda.' : 'Please fill in your Name.');
                  return;
                }
                const baseText = isIndo
                  ? `Halo DGT_LZ, saya ingin konsultasi gratis / Blueprint AI:\n\n*Nama:* ${name}\n*Objektif:* ${objective}`
                  : `Hello DGT_LZ, I would like to request a free consultation / AI Blueprint:\n\n*Name:* ${name}\n*Objective:* ${objective}`;
                
                if (channel === 'whatsapp') {
                  const waUrl = `https://wa.me/6281237729115?text=${encodeURIComponent(baseText)}`;
                  window.open(waUrl, '_blank');
                } else {
                  navigator.clipboard.writeText(baseText).then(() => {
                    alert(isIndo 
                      ? 'Pesan konsultasi Anda telah disalin ke clipboard! Mengarahkan ke DM Instagram...' 
                      : 'Your consultation message has been copied to clipboard! Redirecting to Instagram DM...');
                    window.open('https://ig.me/m/dgt_lz', '_blank');
                  }).catch(() => {
                    window.open('https://ig.me/m/dgt_lz', '_blank');
                  });
                }
              }}
            >
              <span>{t.kontak.btn}</span>
              <span className="transform translate-x-[-20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">→</span>
            </button>
          </div>

          <div className="md:col-span-2 flex flex-col justify-between">
            <div className="flex flex-col gap-10">
              <div>
                <h4 className="text-[10px] text-[#737373] uppercase tracking-[0.2em] mb-3 font-mono font-bold">{t.kontak.h1}</h4>
                <p className="text-[#FAFAFA] text-lg font-clash">{t.kontak.a1_1}<br/>{t.kontak.a1_2}</p>
              </div>
              <div>
                <h4 className="text-[10px] text-[#737373] uppercase tracking-[0.2em] mb-3 font-mono font-bold">{t.kontak.h2}</h4>
                <div className="flex flex-col gap-3">
                  <a 
                    href="https://wa.me/6281237729115" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#FAFAFA] text-lg font-clash hover:text-[#D46B4A] transition-colors w-fit inline-flex items-center gap-1.5"
                  >
                    +62 812-3772-9115 <span className="text-xs text-[#D46B4A] font-sans">↗</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/dgt_lz?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#FAFAFA] text-lg font-clash hover:text-[#D46B4A] transition-colors w-fit inline-flex items-center gap-1.5"
                  >
                    @dgt_lz <span className="text-xs text-[#D46B4A] font-sans">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};


// --- KOMPONEN UTAMA (APP) ---
const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Shared Operational States across Portals
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [transparencyLog, setTransparencyLog] = useState(INITIAL_TRANSPARENCY_LOG);

  // Dynamic Portfolio & Partnerships for Public Page
  const [publicWorks, setPublicWorks] = useState([
    { 
      id: 'work-1',
      title: 'Lensa Insignia', 
      type: 'client',
      tags: ['AI', 'Web Media'], 
      desc_id: 'Media berita dengan desain profesional & dashboard management otonom. Dilengkapi Post Creator berita-ke-sosmed 5-klik (<10 detik) dan AI pencari fakta otomatis.',
      desc_en: 'News media with professional design & autonomous management dashboard. Features a 5-click news-to-social post creator (<10s) and fact-checking AI team.',
      link: 'https://lensainsignia.com',
      image: '/lensa_insignia.jpg',
      problem_id: 'Optimasi SEO maksimal (indeksasi bot lambat pada SPA biasa), ancaman mismatch hidrasi SSR React, dan penegakan hak akses edit artikel yang aman bagi ratusan penulis independen.',
      problem_en: 'Achieving perfect SEO indexing (SPA clients are crawled slowly), resolving React SSR hydration mismatches, and securing dynamic database tables across multiple independent authors.',
      solution_id: 'Express.js SSR Engine dengan routing dinamis React Helmet, validasi window/document DOM aman, dan penulisan PostgreSQL RLS Policies menggunakan auth.uid() pada Supabase.',
      solution_en: 'Engineered an Express.js SSR Engine with React Helmet tag injection, browser API execution guards (SSR safe), and enterprise Postgres Row Level Security (RLS) policies linking author_id.',
      result_id: 'Skor Lighthouse SEO 100/100, waktu respon server awal di bawah 120ms, First Contentful Paint di bawah 0.8 detik, serta perlindungan database 100% aman terenkripsi.',
      result_en: 'Attained Lighthouse SEO score of 100/100, initial server response under 120ms, First Contentful Paint (FCP) under 0.8s, and 100% database write/read compliance.'
    },
    { 
      id: 'work-2',
      title: 'Command', 
      type: 'client',
      tags: ['SaaS', 'Agency OS'], 
      desc_id: 'Sistem operasi otonom agensi kreatif & developer. Menyatukan manajemen proyek, CRM pipeline, keuangan ledger, dan analitik kapasitas tim dalam dasbor real-time bertenaga AI.',
      desc_en: 'An autonomous operating system for creative & developer agencies. Unifies project tracking, CRM pipeline, global ledger, and team analytics in a real-time, AI-powered environment.',
      image: '/command_logo.jpg',
      problem_id: 'Tim agensi kehilangan sinkronisasi internal, pencatatan transaksi manual yang rawan human-error, serta kesulitan memperkirakan kapasitas utilisasi pekerja.',
      problem_en: 'Agency teams lacked project alignment, relying on manual error-prone financial ledgers, with zero visibility into team capacity metrics.',
      solution_id: 'Pemasangan operating system khusus agensi dengan modul CRM dinamis, general ledger keuangan, dan visualisasi status kapasitas tim berbasis status waktu riil.',
      solution_en: 'Deployed a custom Agency OS uniting CRM pipelines, a financial ledger, and real-time visual tracking of team capacity metrics.',
      result_id: 'Tingkat kesalahan laporan keuangan berkurang hingga 0% (zero leak) dan efisiensi alokasi pengerjaan proyek meningkat sebesar 90%.',
      result_en: 'Eliminated accounting leaks (0% ledger errors) and optimized developer allocation capacity by over 90% across the board.'
    },
    { 
      id: 'work-3',
      title: 'Sapa Warga', 
      type: 'client',
      tags: ['AI', 'GovTech', 'Firebase'], 
      desc_id: 'Infrastruktur digital aspirasi & keluhan rakyat berbasis AI Google Gemini. Menghilangkan pendaftaran berbelit dengan sidik jari perangkat, serta mengotomatisasi pemilahan aduan.',
      desc_en: 'An AI-first public complaint infrastructure powered by Google Gemini. Removes complex sign-ups using device fingerprinting, and automates triage and classification.',
      image: '/sapawarga_logo.jpg',
      problem_id: 'Birokrasi pelayanan publik lambat, penumpukan berkas laporan manual, hambatan login pendaftaran konvensional, serta nol transparansi penanganan aduan warga.',
      problem_en: 'Slow manual bureaucracy triage backlogs, complex registration/login barriers for citizens, and zero status transparency on complaint handling.',
      solution_id: 'Integrasi asinkron model Gemini 2.5 Flash untuk ekstraksi JSON kategori & prioritas aduan, database real-time Firebase Firestore, dan chatbox admin-pelapor aman.',
      solution_en: 'Deployed Google Gemini 2.5 Flash structural JSON extraction for real-time priority sorting, combined with a Firebase Firestore chatbox securing citizen anonymity.',
      result_id: 'Pemilahan laporan instan (<5 detik), memotong latency respons aduan dari harian ke hitungan jam, transparansi publik 100%, dan keamanan akses Firestore Rules.',
      result_en: 'Delivered instant report categorizations (<5s), cut complaint latency to hours, ensured 100% public accountability, and secured chat channels via Firestore Rules.'
    },
    { 
      id: 'work-4',
      title: 'Restaurant Operations', 
      type: 'concept',
      tags: ['AI', 'SaaS', 'Blueprint'], 
      desc_id: 'Konsep Restaurant Operating System terintegrasi yang menyatukan pesanan pelanggan QR, alur kerja dapur, inventaris bahan baku real-time, dan analitik cabang.',
      desc_en: 'A unified Restaurant Operating System architecture connecting customer QR ordering, live kitchen flow, real-time stock ingredients, and multi-branch analytics.',
      problem_id: 'Operasional restoran terfragmentasi menggunakan banyak aplikasi terpisah (POS, WhatsApp, Excel) yang memicu inefisiensi, salah saji stok, dan antrean aduan pelanggan.',
      problem_en: 'Disconnected tools (POS, WhatsApp, spreadsheets) create manual reconciliations, kitchen priority confusion, raw ingredient stockouts, and poor multi-branch performance visibility.',
      solution_id: 'Membangun blueprint arsitektur Restaurant OS terpusat yang menghubungkan dasbor Owner, Manager, Kitchen queue, Waiter notifications, QR Customer portal, dan Finance ledger.',
      solution_en: 'Engineered a centralized restaurant operating ecosystem connecting Owner KPIs, Manager shift workflows, Live Kitchen queues, Waiter serving alarms, QR digital menus, and SQL Ledger accounting.',
      result_id: 'Memangkas pekerjaan administrasi manual, mengotomatisasi pembaruan stok bahan baku, melacak sisa limbah makanan, dan mempercepat respons reservasi pelanggan.',
      result_en: 'Eliminated manual accounting reconciliations, automated raw ingredient alerts, optimized chef cooking speed, and delivered real-time executive summaries.'
    }
  ]);

  const [activeCaseStudy, setActiveCaseStudy] = useState(null);

  const [partnerships, setPartnerships] = useState([
    { 
      id: 'part-1',
      title_id: 'Aliansi Teknologi', 
      title_en: 'Technology Alliance',
      desc_id: 'Berkolaborasi dengan penyedia infrastruktur untuk integrasi deep-tech.',
      desc_en: 'Collaborate with infrastructure providers for deep-tech integration.'
    },
    { 
      id: 'part-2',
      title_id: 'Partner Strategis', 
      title_en: 'Strategic Partners',
      desc_id: 'Menghubungkan inovasi Bali dengan jaringan bisnis global.',
      desc_en: 'Connecting Balinese innovation with global business networks.'
    },
    { 
      id: 'part-3',
      title_id: 'Inkubator Startup', 
      title_en: 'Startup Incubator',
      desc_id: 'Memberdayakan pendiri baru dengan infrastruktur AI otonom.',
      desc_en: 'Empowering new founders with autonomous AI infrastructure.'
    }
  ]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lang, setLang] = useState(() => {
    if (typeof navigator !== 'undefined') {
      const userLang = navigator.language || navigator.userLanguage || '';
      return userLang.toLowerCase().includes('id') ? 'id' : 'en';
    }
    return 'en';
  });
  const lastScrollY = useRef(0);
  const [objective, setObjective] = useState('');
  const [activeSection, setActiveSection] = useState('manifesto');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleBackHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  const handleSelectBundle = (bundleName, categoryName) => {
    setObjective(lang === 'id' 
      ? `Tertarik dengan bundel siap pakai: [${categoryName} - ${bundleName}]` 
      : `Inquiry for ready-to-purchase bundle: [${categoryName} - ${bundleName}]`
    );
    scrollToSection('kontak');
  };

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

    const loadFrame = requestAnimationFrame(() => setIsLoaded(true));

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
      cancelAnimationFrame(loadFrame);
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

  const navItems = useMemo(() => [
    { id: 'manifesto', label: t.nav.manifesto },
    { id: 'layanan', label: t.nav.layanan },
    { id: 'bundel', label: t.nav.bundel },
    { id: 'about', label: t.nav.about },
    { id: 'partnership', label: t.nav.partnership },
    { id: 'work', label: t.nav.work },
    { id: 'team', label: t.nav.team },
    { id: 'doktrin', label: t.nav.doktrin },
    { id: 'faq', label: t.nav.faq },
    { id: 'kontak',  label: t.nav.kontak }
  ], [t]);

  useEffect(() => {
    if (!isLoaded) return;
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -55% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoaded, navItems]);

  if (currentPath === '/admin' || currentPath === '/admin/') {
    return (
      <AdminPortal
        projects={projects}
        setProjects={setProjects}
        leads={leads}
        setLeads={setLeads}
        transactions={transactions}
        setTransactions={setTransactions}
        team={team}
        setTeam={setTeam}
        transparencyLog={transparencyLog}
        setTransparencyLog={setTransparencyLog}
        onBackHome={handleBackHome}
        publicWorks={publicWorks}
        setPublicWorks={setPublicWorks}
        partnerships={partnerships}
        setPartnerships={setPartnerships}
      />
    );
  }

  if (currentPath === '/team' || currentPath === '/team/') {
    return (
      <TeamPortal
        tasks={tasks}
        setTasks={setTasks}
        projects={projects}
        leads={leads}
        onBackHome={handleBackHome}
      />
    );
  }

  if (currentPath === '/client' || currentPath === '/client/') {
    return (
      <ClientPortal
        projects={projects}
        setProjects={setProjects}
        transparencyLog={transparencyLog}
        setTransparencyLog={setTransparencyLog}
        onBackHome={handleBackHome}
      />
    );
  }

  if (currentPath === '/dashboard' || currentPath === '/dashboard/') {
    window.history.replaceState({}, '', '/admin');
    return (
      <AdminPortal
        projects={projects}
        setProjects={setProjects}
        leads={leads}
        setLeads={setLeads}
        transactions={transactions}
        setTransactions={setTransactions}
        team={team}
        setTeam={setTeam}
        transparencyLog={transparencyLog}
        setTransparencyLog={setTransparencyLog}
        onBackHome={handleBackHome}
        publicWorks={publicWorks}
        setPublicWorks={setPublicWorks}
        partnerships={partnerships}
        setPartnerships={setPartnerships}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-sans overflow-x-hidden selection:bg-[#D46B4A] selection:text-white flex flex-col relative uppercase-lines">

      {/* Import Custom Fonts & Styling */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@300,400,500,700&display=swap');

        html, body {
          max-width: 100%;
          overflow-x: hidden;
        }
        html { scroll-behavior: auto; } /* Lenis handles smooth */
        body {
          font-family: 'Cabinet Grotesk', sans-serif;
          background-color: #0A0A0A;
          color: #FAFAFA;
        }
        
        /* Premium Typography Helper Classes */
        .font-syne { 
          font-family: 'Syne', sans-serif; 
        }
        .font-clash { 
          font-family: 'Clash Display', sans-serif; 
        }
        .font-cabinet {
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        .font-mono { 
          font-family: 'Space Mono', monospace; 
        }
        
        .font-maroni { 
          font-family: 'Syne', sans-serif; 
          font-weight: 800;
          letter-spacing: -0.04em;
        }
        h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        h3, h4, .font-serif { 
          font-family: 'Clash Display', sans-serif; 
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 107, 74, 0.25);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 107, 74, 0.7);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(212, 107, 74, 0.25) rgba(255, 255, 255, 0.02);
        }

        /* SOFT PREMIUM DESIGN OVERRIDES - COMFORTABLE & HIGH-END AESTHETIC */
        
        /* Softer, rounded corners for all structural containers, buttons, forms, and cards */
        div.border,
        [class*="border"],
        button,
        input,
        select,
        textarea,
        [class*="rounded"] {
          border-radius: 14px !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        /* Maintain full rounding for pill shapes / tags */
        .rounded-full, [class*="rounded-full"],
        span.w-3.h-3.rounded-full, span.w-4.h-4.rounded-full,
        .rounded-sm, [class*="rounded-sm"] {
          /* Small badges get a slightly smaller radius to avoid looking cartoonish */
          border-radius: 6px !important;
        }
        
        .rounded-full, [class*="rounded-full"],
        [class*="bg-[#D46B4A]"].rounded-full {
          border-radius: 9999px !important;
        }

        /* Softer border styling and premium semi-translucent backdrop blurs */
        div.border, [class*="border"] {
          border-color: rgba(255, 255, 255, 0.06) !important;
        }
        
        /* Special accent hover borders */
        [class*="hover:border-[#D46B4A]"]:hover,
        .hover\:border-\[\#D46B4A\]:hover {
          border-color: rgba(212, 107, 74, 0.8) !important;
          box-shadow: 0 8px 30px rgba(212, 107, 74, 0.08) !important;
        }

        /* Smooth glass cards instead of flat sharp boxes */
        .grid div.bg-\\[\\#111111\\/30\\],
        .flex div.bg-\\[\\#111111\\/30\\],
        #team div.bg-\\[\\#111111\\/30\\],
        #work div.bg-\\[\\#111111\\/30\\],
        #about div.bg-\\[\\#111111\\/30\\],
        #bundel div.bg-\\[\\#111111\\/30\\] {
          background-color: rgba(255, 255, 255, 0.02) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 16px !important;
        }

        /* Softer input styling */
        input, select, textarea {
          background-color: rgba(255, 255, 255, 0.02) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
        
        input:focus, select:focus, textarea:focus {
          border-color: #D46B4A !important;
          box-shadow: 0 0 15px rgba(212, 107, 74, 0.15) !important;
        }

        /* Soft glowing active buttons */
        button[class*="bg-[#D46B4A]"],
        .bg-\[\#D46B4A\] {
          box-shadow: 0 4px 20px rgba(212, 107, 74, 0.25) !important;
        }
        button[class*="bg-[#D46B4A]"]:hover,
        .bg-\[\#D46B4A\]:hover {
          box-shadow: 0 6px 24px rgba(212, 107, 74, 0.45) !important;
          transform: translateY(-1px);
        }

        /* Dim the giant background watermark further for zero clutter */
        div.text-\\[18vw\\] {
          opacity: 0.003 !important;
        }
      `}} />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 z-50 w-full border-b border-[#2A2A2A] bg-[#0A0A0A]/80 backdrop-blur-lg transition-transform duration-500 ease-in-out ${showNav ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="w-full max-w-7xl ml-0 mr-auto px-6 md:px-12 lg:px-16 h-24 flex items-center justify-between">
          <div 
            className="text-[#FAFAFA] font-maroni text-2xl tracking-tight flex items-baseline cursor-pointer mr-8"
            onClick={() => scrollToSection('manifesto')}
          >
            DGT_LZ <span className="inline-block w-2 h-2 bg-[#D46B4A] rounded-full ml-1"></span>
          </div>
          
          <div className="hidden lg:flex gap-4 xl:gap-6 items-center">
            {navItems.map((item) => {
              const isActive = item.id === activeSection;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-[10px] xl:text-[11px] uppercase tracking-[0.15em] xl:tracking-[0.2em] transition-all duration-300 font-mono font-bold relative ${
                    item.id === 'bundel'
                      ? `text-[#D46B4A] border ${isActive ? 'border-[#D46B4A] bg-[#D46B4A]/10' : 'border-[#D46B4A]/40'} px-2 py-0.5 xl:px-3 xl:py-1 rounded hover:bg-[#D46B4A]/25 hover:border-[#D46B4A] transition-all duration-300`
                      : `${isActive ? 'text-[#D46B4A]' : 'text-[#737373]'} hover:text-[#D46B4A] after:content-[""] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#D46B4A] after:rounded-full after:transition-all after:duration-300 ${isActive ? 'after:scale-100 after:opacity-100' : 'after:scale-0 after:opacity-0'}`
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {/* Lang Switcher (Desktop) */}
            <div className="flex items-center gap-2 pl-4 border-l border-[#2A2A2A] text-[10px] uppercase font-mono font-bold tracking-widest">
              <button onClick={() => setLang('en')} className={`transition-colors hover:text-[#D46B4A] ${lang === 'en' ? 'text-[#FAFAFA]' : 'text-[#737373]'}`}>EN</button>
              <span className="text-[#2A2A2A]">|</span>
              <button onClick={() => setLang('id')} className={`transition-colors hover:text-[#D46B4A] ${lang === 'id' ? 'text-[#FAFAFA]' : 'text-[#737373]'}`}>ID</button>
            </div>

            {/* Consult for Free CTA Button (Desktop) */}
            <button
              onClick={() => scrollToSection('kontak')}
              className="ml-4 text-[10px] xl:text-[11px] uppercase tracking-[0.15em] font-mono font-bold bg-[#D46B4A] text-white px-4 py-2 rounded hover:bg-[#c25a3a] transition-all duration-300 shadow-[0_4px_15px_rgba(212,107,74,0.2)] hover:shadow-[0_6px_20px_rgba(212,107,74,0.4)] hover:-translate-y-0.5"
            >
              {lang === 'en' ? 'Consult for Free' : 'Konsultasi Gratis'}
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-4 sm:gap-6">
            {/* Consult for Free CTA Button (Mobile) */}
            <button
              onClick={() => scrollToSection('kontak')}
              className="text-[9px] uppercase tracking-wider font-mono font-bold bg-[#D46B4A] text-white px-2.5 py-1.5 rounded hover:bg-[#c25a3a] transition-all"
            >
              {lang === 'en' ? 'Consult' : 'Konsultasi'}
            </button>

            {/* Lang Switcher (Mobile) */}
            <div className="flex items-center gap-2 text-[10px] uppercase font-mono font-bold tracking-widest border-r border-[#2A2A2A] pr-4 sm:pr-6">
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

        <div className={`lg:hidden absolute top-24 left-0 w-full bg-[#0A0A0A] border-b border-[#2A2A2A] flex flex-col p-8 gap-8 shadow-sm z-40 transition-all duration-500 ease-in-out ${isNavOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          {navItems.filter(item => item.id !== 'bundel' && item.id !== 'doktrin').map((item) => {
            const isActive = item.id === activeSection;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-[11px] uppercase tracking-[0.2em] text-left transition-colors font-mono font-bold ${isActive ? 'text-[#D46B4A]' : 'text-[#737373]'} hover:text-[#D46B4A]`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-7xl ml-0 mr-auto px-6 md:px-12 lg:px-16 flex-grow relative z-10 pt-24 flex flex-col">
        <div className="order-1 lg:order-none"><Beranda isLoaded={isLoaded} t={t} /></div>
        <div className="order-2 lg:order-none"><Marquee t={t} /></div>
        <div className="order-3 lg:order-none"><Statistik t={t} /></div>
        <div className="order-4 lg:order-none"><Layanan t={t} /></div>
        {/* Hidden on mobile */}
        <div className="hidden lg:block lg:order-none"><KatalogBundel t={t} onSelectBundle={handleSelectBundle} /></div>
        <div className="order-5 lg:order-none"><Kontak t={t} objective={objective} setObjective={setObjective} /></div>
        <div className="order-6 lg:order-none"><FAQ t={t} /></div>
        <div className="order-7 lg:order-none"><AboutUs t={t} /></div>
        {/* Hidden on mobile */}
        <div className="hidden lg:block lg:order-none"><Doktrin t={t} /></div>
        <div className="order-8 lg:order-none"><OurWork t={t} publicWorks={publicWorks} lang={lang} onOpenCaseStudy={(work) => setActiveCaseStudy(work)} /></div>
        <div className="order-9 lg:order-none"><OurTeam t={t} /></div>
        <div className="order-10 lg:order-none"><Partnership t={t} partnerships={partnerships} lang={lang} /></div>
      </main>

      {/* CASE STUDY DETAIL MODAL */}
      {activeCaseStudy && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-2xl border border-[#151515] bg-[#070707] p-8 flex flex-col gap-6 rounded relative max-h-[85vh] overflow-y-auto custom-scrollbar animate-fade-in">
            <button
              onClick={() => setActiveCaseStudy(null)}
              className="absolute top-6 right-6 text-[#737373] hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
            >
              ✕ Close
            </button>

            <div>
              <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">
                Case Study // DGT_LZ Impact
              </span>
              <h3 className="text-3xl font-clash font-bold text-white mt-1">
                {activeCaseStudy.title}
              </h3>
              <div className="flex gap-2 mt-3">
                {(activeCaseStudy.tags || []).map((tag, i) => (
                  <span key={i} className="text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-[#D46B4A]/10 border border-[#D46B4A]/30 text-[#D46B4A] rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 border-t border-[#151515] pt-6 text-[11px] font-mono">
              <div className="flex flex-col gap-2">
                <span className="text-[#737373] uppercase font-bold tracking-wider">▪ THE PROBLEM</span>
                <p className="text-[#A3A3A3] leading-relaxed pl-3 border-l border-[#151515]">
                  {lang === 'id' 
                    ? (activeCaseStudy.problem_id || 'Klien mengalami hambatan operasional karena proses manual yang tidak efisien.') 
                    : (activeCaseStudy.problem_en || 'Client faced operational bottlenecks due to heavy manual processing dependencies.')}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[#D46B4A] uppercase font-bold tracking-wider">▪ THE SOLUTION</span>
                <p className="text-[#FAFAFA] leading-relaxed pl-3 border-l border-[#D46B4A]/40">
                  {lang === 'id' 
                    ? (activeCaseStudy.solution_id || 'Kami mengintegrasikan agen AI otonom untuk menangani alur kerja secara instan.') 
                    : (activeCaseStudy.solution_en || 'We deployed custom autonomous AI agents to automate the pipeline end-to-end.')}
                </p>
              </div>

              <div className="flex flex-col gap-2 bg-[#0C0C0C] border border-[#151515] p-4 rounded">
                <span className="text-green-400 uppercase font-bold tracking-wider">▪ THE IMPACT & ROI</span>
                <p className="text-[#FAFAFA] leading-relaxed mt-1">
                  {lang === 'id' 
                    ? (activeCaseStudy.result_id || 'Penghematan waktu hingga 95% dan peningkatan kapasitas skala bisnis 10x lipat.') 
                    : (activeCaseStudy.result_en || 'Achieved 95% operational time reduction and 10x capacity scaling without hiring additions.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL FOOTER */}
      <footer className="border-t border-[#2A2A2A] mt-auto bg-[#0A0A0A] relative z-10">
        <div className="w-full max-w-7xl ml-0 mr-auto px-6 md:px-12 lg:px-16 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
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
