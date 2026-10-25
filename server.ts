import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Increase body parser limits for base64 images and videos
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Setup folders for data persistence and uploads
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const DB_FILE = path.resolve(DATA_DIR, 'nihonflash.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve public static assets (including local vector illustrations) and uploads
app.use('/assets', express.static(path.resolve(PUBLIC_DIR, 'assets')));
app.use('/public', express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Data Interfaces
interface ExampleSentence {
  id: string;
  japanese: string;
  reading?: string;
  vietnamese: string;
}

interface Flashcard {
  id: string;
  deckId: string;
  title: string;
  japanese: string;
  reading: string;
  meaning: string;
  jlpt: string;
  category: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  examples: ExampleSentence[];
  status: 'new' | 'learning' | 'mastered';
  reviewCount: number;
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  createdAt: string;
}

interface DatabaseSchema {
  version: string;
  updatedAt: string;
  decks: Deck[];
  cards: Flashcard[];
}

// Default initial data
const INITIAL_DECKS: Deck[] = [
  {
    id: 'deck-n5-basic',
    name: 'Từ vựng N5 - Giao tiếp hàng ngày',
    description: 'Bộ thẻ từ vựng thiết yếu cho người mới bắt đầu học tiếng Nhật',
    color: '#ef4444',
    icon: '🌸',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'deck-kanji-starter',
    name: 'Kanji Hình tượng & Bộ thủ',
    description: 'Chữ Hán trực quan kèm ảnh minh họa và mẹo ghi nhớ sâu',
    color: '#0284c7',
    icon: '🗻',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'deck-culture-phrases',
    name: 'Cụm từ & Văn hóa Nhật Bản',
    description: 'Những câu giao tiếp chứa đựng chiều sâu văn hóa xứ sở hoa anh đào',
    color: '#10b981',
    icon: '🍵',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'card-buchou',
    deckId: 'deck-n5-basic',
    title: '部長 (Buchou) - Trưởng bộ phận, Trưởng phòng',
    japanese: '部長',
    reading: 'ぶちょう (Buchou)',
    meaning: 'Trưởng phòng, Trưởng bộ phận',
    jlpt: 'N4',
    category: 'Từ vựng',
    description: 'Chức vụ lãnh đạo quan trọng trong hệ thống cấp bậc công ty Nhật Bản (Japanese Corporate Hierarchy).\n\n• Cấu thành chữ Hán:\n- 部 (BỘ): Bộ phận, phòng ban, phân khu.\n- 長 (TRƯỞNG): Đứng đầu, trưởng bối, lớn tuổi, lãnh đạo.\n\n• Hệ thống cấp bậc công ty Nhật thường gặp:\n- 社長 (しゃちょう - Shachou): Giám đốc / Tổng giám đốc\n- 部長 (ぶちょう - Buchou): Trưởng phòng, Trưởng bộ phận\n- 課長 (かちょう - Kachou): Trưởng ban, Quản lý nhóm\n- 係長 (かかりちょう - Kakarichou): Tổ trưởng\n- 社員 (しゃいん - Shain): Nhân viên\n\n• Lưu ý văn hóa công sở: Khi nói chuyện trực tiếp với cấp trên, người Nhật gọi thẳng chức danh, ví dụ: "Tanaka-buchou" (田中部長) chứ không dùng "san".',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-in-a-boardroom-43403-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-buchou-1',
        japanese: '新しい企画書を部長に提出しました。',
        reading: 'Atarashii kikakusho o buchou ni teishutsu shimashita.',
        vietnamese: 'Tôi đã nộp bản đề xuất kế hoạch mới lên cho trưởng phòng.'
      },
      {
        id: 'ex-buchou-2',
        japanese: '田中部長はとても優しくて頼りになる上司です。',
        reading: 'Tanaka-buchou wa totemo yasashikute tayori ni naru joushi desu.',
        vietnamese: 'Trưởng phòng Tanaka là một cấp trên rất tốt bụng và đáng tin cậy.'
      }
    ],
    status: 'new',
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-negau',
    deckId: 'deck-n5-basic',
    title: '願う (Negau) - Cầu xin, mong muốn, nhờ vả',
    japanese: '願う',
    reading: 'ねがう (Negau)',
    meaning: 'Cầu xin, mong muốn, cầu chúc, nhờ vả',
    jlpt: 'N4',
    category: 'Từ vựng',
    description: 'Động từ nhóm 1 (Godan verb) biểu đạt sự mong mỏi, cầu chúc từ đáy lòng hoặc nhờ vả lịch sự.\n\n• Cấu thành chữ Hán:\n- 願 (NGUYỆN): Cầu nguyện, tâm nguyện, mong mỏi (chữ Nguyên 原 kết hợp bộ Hiệt 頁).\n\n• Các mẫu câu giao tiếp cửa miệng của người Nhật:\n- よろしくお願いします (Yoroshiku onegai shimasu): Rất mong được sự giúp đỡ của anh/chị.\n- ご健勝を心よりお祈り申し上げます (Lời chúc sức khỏe trang trọng trong thư từ).\n- 願い事 (ねがいごと - Negaigoto): Điều ước (khi viết thẻ gỗ Ema viếng đền thần Shinto vào năm mới).',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-japanese-wind-chime-in-the-wind-41982-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-negau-1',
        japanese: '世界平和を心から願っています。',
        reading: 'Sekai heiwa o kokoro kara negatte imasu.',
        vietnamese: 'Tôi chân thành cầu mong cho hòa bình của thế giới.'
      },
      {
        id: 'ex-negau-2',
        japanese: '明日晴れることを願っています。',
        reading: 'Ashita hareru koto o negatte imasu.',
        vietnamese: 'Tôi mong ngày mai thời tiết sẽ nắng đẹp.'
      },
      {
        id: 'ex-negau-3',
        japanese: 'どうぞよろしくお願いします。',
        reading: 'Douzo yoroshiku onegai shimasu.',
        vietnamese: 'Trăm sự xin nhờ anh chị giúp đỡ.'
      }
    ],
    status: 'new',
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-genzai',
    deckId: 'deck-n5-basic',
    title: '現在 (Genzai) - Hiện tại, hiện nay, bây giờ',
    japanese: '現在',
    reading: 'げんざい (Genzai)',
    meaning: 'Hiện tại, hiện nay, thời điểm này',
    jlpt: 'N3',
    category: 'Từ vựng',
    description: 'Từ vựng chỉ mốc thời gian phổ biến trong văn bản, công việc, tin tức và truyền thông.\n\n• Cấu thành chữ Hán:\n- 現 (HIỆN): Xuất hiện, hiện hữu, trước mắt (bộ Ngọc 玉/王 và chữ Kiến 見).\n- 在 (TẠI): Tồn tại, ở tại, có mặt (bộ Thổ 土).\n\n• So sánh với "今" (Ima):\n- 今 (Ima): Dùng trong đàm thoại hàng ngày mang nghĩa "bây giờ" (thời điểm ngay lúc nói).\n- 現在 (Genzai): Trang trọng hơn, dùng trong văn viết, báo cáo, thông số thống kê ("hiện nay", "tính đến nay").\n\n• Cụm từ hay gặp:\n- 過去・現在・未来 (Kako - Genzai - Mirai): Quá khứ - Hiện tại - Tương lai\n- 現在の状況 (Genzai no joukyou): Tình hình hiện tại\n- 2026年現在 (Nisen nijuurokunen genzai): Tính đến thời điểm năm 2026',
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-timelapse-of-tokyo-crossing-at-night-42416-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-genzai-1',
        japanese: '現在の時刻は午前10時です。',
        reading: 'Genzai no jikoku wa gozen juuji desu.',
        vietnamese: 'Giờ hiện tại đang là 10 giờ sáng.'
      },
      {
        id: 'ex-genzai-2',
        japanese: '彼は現在、東京の大学で日本語を勉強しています。',
        reading: 'Kare wa genzai, Toukyou no daigaku de Nihongo o benkyou shite imasu.',
        vietnamese: 'Hiện tại anh ấy đang học tiếng Nhật tại một trường đại học ở Tokyo.'
      },
      {
        id: 'ex-genzai-3',
        japanese: '過去にとらわれず、現在を大切に生きよう。',
        reading: 'Kako ni torawarezu, genzai o taisetsu ni ikiyou.',
        vietnamese: 'Đừng vướng bận quá khứ, hãy trân trọng và sống trọn vẹn ở hiện tại.'
      }
    ],
    status: 'new',
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-kaihatsu',
    deckId: 'deck-n5-basic',
    title: '開発 (Kaihatsu) - Phát triển (sản phẩm, phần mềm, công nghệ)',
    japanese: '開発',
    reading: 'かいはつ (Kaihatsu)',
    meaning: 'Phát triển (nghiên cứu, chế tạo sản phẩm, lập trình phần mềm)',
    jlpt: 'N3',
    category: 'Từ vựng',
    description: 'Thuật ngữ trọng yếu trong lĩnh vực IT, công nghệ thông tin, kỹ thuật và sản xuất chế tạo.\n\n• Cấu thành chữ Hán:\n- 開 (KHAI): Mở ra, bắt đầu, khai mở (bộ Môn 門 mở rộng hai cánh cửa).\n- 発 (PHÁT): Bắn ra, xuất phát, phát minh, phát sinh.\n\n• Cụm từ chuyên môn IT & Doanh nghiệp:\n- アプリ開発 (Apuri kaihatsu): Phát triển ứng dụng di động/web\n- ソフトウェア開発 (Sofutowea kaihatsu): Phát triển phần mềm\n- 開発者 (かいはつしゃ - Kaihatsusha): Developer / Lập trình viên / Nhà phát triển\n- 研究開発 (Kenkyuu kaihatsu / R&D): Nghiên cứu và phát triển sản phẩm\n- 開発中 (Kaihatsuchuu): Đang trong giai đoạn phát triển',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-typing-on-a-laptop-41642-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-kaihatsu-1',
        japanese: '新しいスマートフォンのアプリを開発しています。',
        reading: 'Atarashii sumaatofon no apuri o kaihatsu shite imasu.',
        vietnamese: 'Chúng tôi đang phát triển một ứng dụng mới cho điện thoại thông minh.'
      },
      {
        id: 'ex-kaihatsu-2',
        japanese: 'AI技術の開発が急速に進んでいます。',
        reading: 'Ei-ai gijutsu no kaihatsu ga kyuusoku ni susunde imasu.',
        vietnamese: 'Sự phát triển của công nghệ trí tuệ nhân tạo (AI) đang tiến bộ nhanh chóng.'
      },
      {
        id: 'ex-kaihatsu-3',
        japanese: '当社は環境に優しい新エネルギーの開発に注力しています。',
        reading: 'Tousha wa kankyou ni yasashii shin-enerugii no kaihatsu ni chuuryoku shite imasu.',
        vietnamese: 'Công ty chúng tôi đang tập trung phát triển nguồn năng lượng mới thân thiện với môi trường.'
      }
    ],
    status: 'new',
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-ureshii',
    deckId: 'deck-n5-basic',
    title: '嬉しい (Ureshii) - Vui mừng, sung sướng, hạnh phúc',
    japanese: '嬉しい',
    reading: 'うれしい (Ureshii)',
    meaning: 'Vui mừng, sung sướng, hạnh phúc',
    jlpt: 'N5',
    category: 'Từ vựng',
    description: 'Tính từ đuôi い (I-adjective) diễn tả cảm xúc vui sướng, hân hoan khi đón nhận tin vui, quà tặng, lời khen hoặc ước muốn thành hiện thực.\n\n• Cấu thành chữ Hán:\n- 嬉 (HI): Vui sướng, hoan hỷ (bộ Nữ 女 kết hợp chữ Hỷ 喜 mang lại điềm lành hạnh phúc).\n\n• Biến đổi ngữ pháp tính từ đuôi い:\n- Khẳng định: 嬉しい (Vui)\n- Phủ định: 嬉しくない (Không vui)\n- Quá khứ: 嬉しかった (Đã rất vui)\n- Phủ định quá khứ: 嬉しくなかった (Đã không vui)\n\n• Phân biệt với "楽しい" (Tanoshii):\n- 楽しい (Tanoshii): Vui vẻ do hoạt động khách quan (như đi picnic vui, xem phim hài vui nhộn).\n- 嬉しい (Ureshii): Niềm vui xuất phát từ nội tâm chủ quan (khi đỗ kỳ thi, được ai đó quan tâm giúp đỡ).',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-in-a-park-42289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-ureshii-1',
        japanese: 'JLPT試験に合格できて、本当に嬉しいです！',
        reading: 'JLPT shiken ni goukaku dekite, hontou ni ureshii desu!',
        vietnamese: 'Đỗ được kỳ thi JLPT khiến tôi thật sự vô cùng sung sướng!'
      },
      {
        id: 'ex-ureshii-2',
        japanese: 'お祝いのメッセージをいただいて、とても嬉しかったです。',
        reading: 'Oiwai no messeeji o itadaite, totemo ureshikatta desu.',
        vietnamese: 'Nhận được tin nhắn chúc mừng từ bạn, tôi cảm thấy rất đỗi vui mừng.'
      },
      {
        id: 'ex-ureshii-3',
        japanese: 'そう言ってもらえると嬉しいです。',
        reading: 'Sou itte moraeru to ureshii desu.',
        vietnamese: 'Được bạn khen và động viên như vậy tôi vui lắm.'
      }
    ],
    status: 'new',
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-kaisha',
    deckId: 'deck-n5-basic',
    title: '会社 (Kaisha) - Công ty',
    japanese: '会社',
    reading: 'かいしゃ (Kaisha)',
    meaning: 'Công ty, doanh nghiệp',
    jlpt: 'N5',
    category: 'Từ vựng',
    description: 'Từ vựng thiết yếu trong giao tiếp đời sống và công việc hàng ngày.\n\n• Chữ Hán cấu thành:\n- 会 (HỘI): Gặp gỡ, tụ họp, hội ngộ (bộ Nhân 人 kết hợp chữ Vân 云).\n- 社 (XÃ): Thần đất, đền thờ làng, đoàn thể, xã hội (bộ Thị 礻 và chữ Thổ 土).\n\n• Mẹo ghi nhớ & Điểm thú vị:\n- Ghép "Hội" + "Xã" = nơi mọi người tụ họp làm việc chung, tức là Công ty (会社).\n- Khi đảo ngược lại thành 社会 (しゃかい - Shakai) thì lại có nghĩa là Xã hội!\n\n• Các cụm từ thông dụng:\n- 会社員 (かいしゃいん - Kaishain): Nhân viên công ty\n- 会社に行く (かいしゃにいく - Kaisha ni iku): Đi làm / Đến công ty\n- 株式会社 (かぶしきがいしゃ - Kabushiki gaisha): Công ty cổ phần\n- 親会社 (おやがいしゃ - Oyagaisha): Công ty mẹ\n- 子会社 (こがいしゃ - Kogaisha): Công ty con',
    imageUrl: '/assets/kaisha-office.svg',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-and-traffic-time-lapse-40544-large.mp4',
    thumbnailUrl: '/assets/kaisha-office.svg',
    examples: [
      {
        id: 'ex-kaisha-1',
        japanese: '毎朝８時半に会社へ行きます。',
        reading: 'Maiasa hachijihan ni kaisha e ikimasu.',
        vietnamese: 'Mỗi buổi sáng tôi đến công ty lúc 8 giờ rưỡi.'
      },
      {
        id: 'ex-kaisha-2',
        japanese: '父は日本のIT会社で働いています。',
        reading: 'Chichi wa Nihon no aiti- kaisha de hataraite imasu.',
        vietnamese: 'Bố tôi đang làm việc ở một công ty công nghệ thông tin của Nhật.'
      },
      {
        id: 'ex-kaisha-3',
        japanese: '将来、自分の会社を作りたいです。',
        reading: 'Shourai, jibun no kaisha o tsukuritai desu.',
        vietnamese: 'Trong tương lai, tôi muốn tự thành lập công ty của riêng mình.'
      }
    ],
    status: 'new',
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-sakura',
    deckId: 'deck-n5-basic',
    title: '桜 (Sakura) - Hoa anh đào',
    japanese: '桜',
    reading: 'さくら (Sakura)',
    meaning: 'Hoa anh đào - Quốc hoa biểu tượng mùa xuân',
    jlpt: 'N5',
    category: 'Từ vựng',
    description: 'Hoa anh đào tượng trưng cho sự thuần khiết, tươi mới và tinh thần võ sĩ đạo Nhật Bản. Cây nở rộ vào cuối tháng 3 đầu tháng 4, thời điểm mở màn năm học và tài khóa mới. Người Nhật thường tụ họp cùng bạn bè, gia đình dưới tán cây để thưởng rượu và ngắm hoa (Lễ hội Hanami - 花見).',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-blooming-cherry-blossom-branches-42023-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-1',
        japanese: '春になると、桜が綺麗に咲きます。',
        reading: 'Haru ni naru to, sakura ga kirei ni sakimasu.',
        vietnamese: 'Khi mùa xuân đến, hoa anh đào nở rất đẹp.'
      },
      {
        id: 'ex-2',
        japanese: '週末に友だちと花見に行きましょう。',
        reading: 'Shuumatsu ni tomodachi to hanami ni ikimashou.',
        vietnamese: 'Cuối tuần này hãy cùng bạn bè đi ngắm hoa anh đào nhé.'
      }
    ],
    status: 'mastered',
    reviewCount: 5,
    lastReviewedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-taberu',
    deckId: 'deck-n5-basic',
    title: '食べる (Taberu) - Ăn uống',
    japanese: '食べる',
    reading: 'たべる (Taberu)',
    meaning: 'Ăn (Động từ nhóm 2)',
    jlpt: 'N5',
    category: 'Từ vựng',
    description: 'Một trong những động từ quan trọng nhất trong tiếng Nhật. Thuộc động từ nhóm 2 (Ichidan verb):\n- Thể lịch sự: 食べます (Tabemasu - Ăn)\n- Thể phủ định: 食べない (Tabenai - Không ăn)\n- Thể nối tiếp: 食べて (Tabete - Hãy ăn / Đang ăn)\n- Thể quá khứ: 食べた (Tabeta - Đã ăn)\nChữ Hán Thực (食) gồm bộ Nhân (人) và chữ Lương (良), thể hiện thức ăn lành mạnh nuôi dưỡng thân tâm.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-ramen-soup-bowl-with-chopsticks-43093-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-taberu-1',
        japanese: '朝ごはんは何を食べましたか。',
        reading: 'Asagohan wa nani o tabemashita ka.',
        vietnamese: 'Sáng nay bạn đã ăn gì thế?'
      },
      {
        id: 'ex-taberu-2',
        japanese: '日本料理をたくさん食べたいです。',
        reading: 'Nihon ryouri o takusan tabetai desu.',
        vietnamese: 'Tôi muốn thưởng thức thật nhiều món ăn Nhật Bản.'
      }
    ],
    status: 'learning',
    reviewCount: 2,
    lastReviewedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-fujisan',
    deckId: 'deck-kanji-starter',
    title: '富士山 (Fujisan) - Núi Phú Sĩ',
    japanese: '富士山',
    reading: 'ふじさん (Fujisan)',
    meaning: 'Núi Phú Sĩ (Ngọn núi thiêng cao 3.776m)',
    jlpt: 'N5',
    category: 'Kanji',
    description: 'Núi Phú Sĩ là biểu tượng thiêng liêng và di sản văn hóa thế giới UNESCO của Nhật Bản. Chữ Hán cấu thành:\n- 富 (Phú): giàu sang, sung túc\n- 士 (Sĩ): chiến sĩ, bậc trí dũng\n- 山 (Sơn): ngọn núi cao\n*Lưu ý ngữ âm*: Trong tiếng Nhật gọi là "Fujisan", chữ 山 ở đây đọc theo âm On là "San", không gọi là "Fujiyama".',
    imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-fuji-1',
        japanese: '新幹線の窓から富士山が見えました。',
        reading: 'Shinkansen no mado kara Fujisan ga miemashita.',
        vietnamese: 'Từ cửa sổ tàu Shinkansen, tôi đã ngắm nhìn được núi Phú Sĩ.'
      }
    ],
    status: 'learning',
    reviewCount: 3,
    lastReviewedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-ichigo-ichie',
    deckId: 'deck-culture-phrases',
    title: '一期一会 (Ichigo Ichie) - Nhất kỳ nhất hội',
    japanese: '一期一会',
    reading: 'いちごいちえ (Ichigo Ichie)',
    meaning: 'Trân quý từng cuộc gặp gỡ trong đời',
    jlpt: 'N3',
    category: 'Thành ngữ',
    description: 'Triết lý sâu sắc bắt nguồn từ Trà đạo (Chado) của thiền sư Sen no Rikyu. "Nhất kỳ" nghĩa là một đời người, "Nhất hội" nghĩa là một lần gặp gỡ. Dù là người quen hay người lạ, khoảnh khắc này sẽ không bao giờ diễn ra thêm lần nào nữa trong vũ trụ, vì vậy hãy đối đãi nhau trọn vẹn và chân tình.',
    imageUrl: 'https://images.unsplash.com/photo-1545048702-793607ce028b?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545048702-793607ce028b?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-ichigo-1',
        japanese: '旅の出会いは一期一会だから、大切にしたい。',
        reading: 'Tabi no deai wa ichigo ichie dakara, taisetsu ni shitai.',
        vietnamese: 'Gặp gỡ trên chuyến hành trình là nhất kỳ nhất hội, nên tôi muốn nâng niu trân trọng.'
      }
    ],
    status: 'learning',
    reviewCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-itadakimasu',
    deckId: 'deck-culture-phrases',
    title: 'いただきます (Itadakimasu) - Lời chào trước bữa ăn',
    japanese: 'いただきます',
    reading: 'いただきます (Itadakimasu)',
    meaning: 'Xin phép được dùng bữa (Tạ ơn thức ăn)',
    jlpt: 'N5',
    category: 'Giao tiếp',
    description: 'Cử chỉ nét đẹp văn hóa Nhật Bản. Trước khi ăn, người Nhật chắp hai tay trước ngực và nói "いただきます". Bắt nguồn từ khiêm nhường ngữ của nhận lãnh (頂く - đưa lên đỉnh đầu tôn kính). Mang hàm ý cảm tạ sinh mệnh của động thực vật đã tạo nên món ăn và công sức người nông dân, đầu bếp.',
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-ita-1',
        japanese: 'みんなで「いただきます」と言って食べ始めました。',
        reading: 'Minna de "itadakimasu" to itte tabehajimemashita.',
        vietnamese: 'Mọi người cùng nói "Itadakimasu" rồi bắt đầu dùng bữa.'
      }
    ],
    status: 'mastered',
    reviewCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-neko',
    deckId: 'deck-kanji-starter',
    title: '猫 (Neko) - Con mèo',
    japanese: '猫',
    reading: 'ねこ (Neko)',
    meaning: 'Con mèo',
    jlpt: 'N5',
    category: 'Kanji',
    description: 'Chữ Hán 猫 có bộ Khuyển (犭 - loài thú 4 chân) kết hợp với chữ Miêu (苗 - cây mạ non, vừa là tượng thanh tiếng mèo kêu meo meo). Mèo rất được yêu chuộng tại Nhật Bản, nổi tiếng với chú mèo may mắn Maneki-neko (招き猫) vẫy tay gọi tài lộc.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
    examples: [
      {
        id: 'ex-neko-1',
        japanese: '我が家には黒い猫が二匹います。',
        reading: 'Wagaya ni wa kuroi neko ga nihiki imasu.',
        vietnamese: 'Nhà tôi có hai chú mèo màu đen.'
      }
    ],
    status: 'new',
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Helper: Read database from disk
function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        version: '1.0',
        updatedAt: new Date().toISOString(),
        decks: INITIAL_DECKS,
        cards: INITIAL_CARDS,
      };
      writeDatabase(initialDb);
      return initialDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading database file, returning default:', error);
    return {
      version: '1.0',
      updatedAt: new Date().toISOString(),
      decks: INITIAL_DECKS,
      cards: INITIAL_CARDS,
    };
  }
}

// Helper: Write database to disk safely (atomic write)
function writeDatabase(db: DatabaseSchema): void {
  db.updatedAt = new Date().toISOString();
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Helper: Convert base64 data to file on disk to save server memory
function saveBase64MediaToFile(base64Data: string, prefix: string): string {
  if (!base64Data || !base64Data.startsWith('data:')) {
    return base64Data;
  }
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Data;
    }
    const mimeType = matches[1];
    const dataBuffer = Buffer.from(matches[2], 'base64');
    let ext = '.bin';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
    else if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('webp')) ext = '.webp';
    else if (mimeType.includes('gif')) ext = '.gif';
    else if (mimeType.includes('mp4')) ext = '.mp4';
    else if (mimeType.includes('webm')) ext = '.webm';

    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.resolve(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, dataBuffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to convert base64 to file:', err);
    return base64Data;
  }
}

// Helper: Safely delete a file from uploads directory
function deleteUploadedFile(fileUrl?: string): void {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[Storage] Deleted physical uploaded file: ${filename}`);
    }
  } catch (err) {
    console.error('Error deleting uploaded file:', err);
  }
}

// Helper: Delete all physical files in uploads directory
function cleanUploadsDir(): void {
  try {
    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      for (const file of files) {
        try {
          const filePath = path.join(UPLOADS_DIR, file);
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('Failed to unlink file:', file, e);
        }
      }
      console.log(`[Storage] Cleaned ${files.length} uploaded files from disk.`);
    }
  } catch (err) {
    console.error('Failed to clean uploads directory:', err);
  }
}

// ==========================================
// BACKEND API ROUTES
// ==========================================

// Server Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    cardsCount: db.cards.length,
    decksCount: db.decks.length,
    storageType: 'Server Filesystem JSON + Media Uploads',
    serverTime: new Date().toISOString(),
  });
});

// Server Storage Stats Endpoint (Used for the Storage Modal UI)
app.get('/api/storage/stats', (_req: Request, res: Response) => {
  try {
    let totalBytes = 0;
    let fileCount = 0;

    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      fileCount = files.length;
      for (const file of files) {
        const filePath = path.join(UPLOADS_DIR, file);
        try {
          const stats = fs.statSync(filePath);
          totalBytes += stats.size;
        } catch {
          // ignore stat errors on deleted temp files
        }
      }
    }

    if (fs.existsSync(DB_FILE)) {
      const dbStats = fs.statSync(DB_FILE);
      totalBytes += dbStats.size;
    }

    const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

    res.json({
      totalBytes,
      totalMB: Number(totalMB) > 0 ? `${totalMB} MB` : '0 MB',
      fileCount,
      freeDisk: '> 180 GB',
      maxFileSize: '100 MB / tệp',
    });
  } catch (err) {
    console.error('Error fetching storage stats:', err);
    res.json({
      totalBytes: 0,
      totalMB: '0 MB',
      fileCount: 0,
      freeDisk: '> 180 GB',
      maxFileSize: '100 MB / tệp',
    });
  }
});

// File Upload Endpoint (Images & Videos)
app.post('/api/upload', upload.single('file'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'Không tìm thấy tệp tải lên' });
    return;
  }
  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: publicUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

// GET /api/data - Full bootstrap (Decks + Cards)
app.get('/api/data', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json({
    decks: db.decks,
    cards: db.cards,
  });
});

// GET /api/decks - List all decks
app.get('/api/decks', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json(db.decks);
});

// POST /api/decks - Create new deck
app.post('/api/decks', (req: Request, res: Response): void => {
  const { name, description, color, icon } = req.body;
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Tên bộ thẻ là bắt buộc' });
    return;
  }
  const db = readDatabase();
  const newDeck: Deck = {
    id: req.body.id || `deck-${Date.now()}`,
    name: name.trim(),
    description: description ? description.trim() : '',
    color: color || '#ef4444',
    icon: icon || '🌸',
    createdAt: new Date().toISOString(),
  };
  db.decks.push(newDeck);
  writeDatabase(db);
  res.status(201).json(newDeck);
});

// PUT /api/decks/:id - Update deck
app.put('/api/decks/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = readDatabase();
  const index = db.decks.findIndex((d) => d.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Không tìm thấy bộ thẻ' });
    return;
  }
  db.decks[index] = {
    ...db.decks[index],
    ...req.body,
    id, // ensure ID stays intact
  };
  writeDatabase(db);
  res.json(db.decks[index]);
});

// DELETE /api/decks/:id - Delete deck & reassign cards
app.delete('/api/decks/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = readDatabase();
  if (db.decks.length <= 1) {
    res.status(400).json({ error: 'Không thể xoá bộ thẻ duy nhất còn lại' });
    return;
  }
  const remainingDecks = db.decks.filter((d) => d.id !== id);
  const fallbackDeckId = remainingDecks[0].id;

  // Reassign cards
  db.cards = db.cards.map((c) => (c.deckId === id ? { ...c, deckId: fallbackDeckId } : c));
  db.decks = remainingDecks;

  writeDatabase(db);
  res.json({ success: true, fallbackDeckId });
});

// GET /api/flashcards - List cards with optional filters
app.get('/api/flashcards', (req: Request, res: Response) => {
  const db = readDatabase();
  const { deckId, jlpt, status, search } = req.query;

  let result = db.cards;
  if (deckId && deckId !== 'all') {
    result = result.filter((c) => c.deckId === deckId);
  }
  if (jlpt && jlpt !== 'all') {
    result = result.filter((c) => c.jlpt === jlpt);
  }
  if (status && status !== 'all') {
    result = result.filter((c) => c.status === status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.japanese?.toLowerCase().includes(q) ||
        c.reading?.toLowerCase().includes(q) ||
        c.meaning?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }
  res.json(result);
});

// GET /api/flashcards/:id - Get single card
app.get('/api/flashcards/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = readDatabase();
  const card = db.cards.find((c) => c.id === id);
  if (!card) {
    res.status(404).json({ error: 'Không tìm thấy thẻ' });
    return;
  }
  res.json(card);
});

// POST /api/flashcards - Create flashcard (saves base64 media to disk)
app.post('/api/flashcards', (req: Request, res: Response): void => {
  const cardData = req.body;
  if (!cardData.title && !cardData.japanese) {
    res.status(400).json({ error: 'Thiếu thông tin tiêu đề hoặc chữ Hán' });
    return;
  }

  // Convert any base64 media to server files in /uploads
  if (cardData.imageUrl && cardData.imageUrl.startsWith('data:')) {
    cardData.imageUrl = saveBase64MediaToFile(cardData.imageUrl, 'img');
  }
  if (cardData.videoUrl && cardData.videoUrl.startsWith('data:')) {
    cardData.videoUrl = saveBase64MediaToFile(cardData.videoUrl, 'vid');
  }
  if (cardData.thumbnailUrl && cardData.thumbnailUrl.startsWith('data:')) {
    cardData.thumbnailUrl = saveBase64MediaToFile(cardData.thumbnailUrl, 'thumb');
  }

  const db = readDatabase();
  const newCard: Flashcard = {
    id: cardData.id || `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    deckId: cardData.deckId || db.decks[0]?.id || 'deck-n5-basic',
    title: cardData.title || cardData.japanese,
    japanese: cardData.japanese || cardData.title,
    reading: cardData.reading || '',
    meaning: cardData.meaning || '',
    jlpt: cardData.jlpt || 'N5',
    category: cardData.category || 'Từ vựng',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || undefined,
    videoUrl: cardData.videoUrl || undefined,
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || undefined,
    examples: Array.isArray(cardData.examples) ? cardData.examples : [],
    status: cardData.status || 'new',
    reviewCount: cardData.reviewCount || 0,
    lastReviewedAt: cardData.lastReviewedAt,
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.cards.unshift(newCard);
  writeDatabase(db);
  res.status(201).json(newCard);
});

// PUT /api/flashcards/:id - Update flashcard
app.put('/api/flashcards/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const cardData = req.body;

  if (cardData.imageUrl && cardData.imageUrl.startsWith('data:')) {
    cardData.imageUrl = saveBase64MediaToFile(cardData.imageUrl, 'img');
  }
  if (cardData.videoUrl && cardData.videoUrl.startsWith('data:')) {
    cardData.videoUrl = saveBase64MediaToFile(cardData.videoUrl, 'vid');
  }
  if (cardData.thumbnailUrl && cardData.thumbnailUrl.startsWith('data:')) {
    cardData.thumbnailUrl = saveBase64MediaToFile(cardData.thumbnailUrl, 'thumb');
  }

  const db = readDatabase();
  const index = db.cards.findIndex((c) => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Không tìm thấy thẻ cần cập nhật' });
    return;
  }

  db.cards[index] = {
    ...db.cards[index],
    ...cardData,
    id,
    updatedAt: new Date().toISOString(),
  };

  writeDatabase(db);
  res.json(db.cards[index]);
});

// PATCH /api/flashcards/:id/status - Update card status
app.patch('/api/flashcards/:id/status', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['new', 'learning', 'mastered'].includes(status)) {
    res.status(400).json({ error: 'Trạng thái học không hợp lệ' });
    return;
  }

  const db = readDatabase();
  const index = db.cards.findIndex((c) => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Không tìm thấy thẻ' });
    return;
  }

  db.cards[index].status = status;
  db.cards[index].reviewCount = (db.cards[index].reviewCount || 0) + 1;
  db.cards[index].lastReviewedAt = new Date().toISOString();
  db.cards[index].updatedAt = new Date().toISOString();

  writeDatabase(db);
  res.json(db.cards[index]);
});

// DELETE /api/flashcards/:id - Delete flashcard and its physical uploaded files
app.delete('/api/flashcards/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = readDatabase();
  const cardToDelete = db.cards.find((c) => c.id === id);

  if (!cardToDelete) {
    res.status(404).json({ error: 'Không tìm thấy thẻ để xoá' });
    return;
  }

  // Delete physical uploaded media files from disk
  deleteUploadedFile(cardToDelete.imageUrl);
  deleteUploadedFile(cardToDelete.videoUrl);
  deleteUploadedFile(cardToDelete.thumbnailUrl);

  db.cards = db.cards.filter((c) => c.id !== id);
  writeDatabase(db);
  res.json({ success: true, message: 'Đã xoá thẻ và tệp đính kèm thành công' });
});

// POST /api/backup/export - Export all database
app.get('/api/backup/export', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=nihonflash-server-backup-${Date.now()}.json`);
  res.send(JSON.stringify(db, null, 2));
});

// POST /api/backup/import - Import database
app.post('/api/backup/import', (req: Request, res: Response): void => {
  const { decks, cards } = req.body;
  if (!Array.isArray(decks) || !Array.isArray(cards)) {
    res.status(400).json({ error: 'Dữ liệu sao lưu không hợp lệ. Cần có mảng decks và cards.' });
    return;
  }

  const newDb: DatabaseSchema = {
    version: '1.0',
    updatedAt: new Date().toISOString(),
    decks,
    cards,
  };

  writeDatabase(newDb);
  res.json({ success: true, decksCount: decks.length, cardsCount: cards.length });
});

// POST /api/backup/reset - Reset database to sample AND delete all uploaded files
app.post('/api/backup/reset', (_req: Request, res: Response) => {
  // Wipe all physical uploaded files from disk
  cleanUploadsDir();

  const defaultDb: DatabaseSchema = {
    version: '1.0',
    updatedAt: new Date().toISOString(),
    decks: INITIAL_DECKS,
    cards: INITIAL_CARDS,
  };
  writeDatabase(defaultDb);
  res.json(defaultDb);
});

// POST /api/sync - Smart 2-way sync to protect user customizations across deploys
app.post('/api/sync', (req: Request, res: Response) => {
  const clientData = req.body;
  const db = readDatabase();

  if (Array.isArray(clientData.cards) && clientData.cards.length > 0) {
    let hasChanges = false;
    for (const clientCard of clientData.cards) {
      // If clientCard has base64 data, convert to physical server file in /uploads
      if (clientCard.imageUrl && clientCard.imageUrl.startsWith('data:')) {
        clientCard.imageUrl = saveBase64MediaToFile(clientCard.imageUrl, 'img');
      }
      if (clientCard.videoUrl && clientCard.videoUrl.startsWith('data:')) {
        clientCard.videoUrl = saveBase64MediaToFile(clientCard.videoUrl, 'vid');
      }
      if (clientCard.thumbnailUrl && clientCard.thumbnailUrl.startsWith('data:')) {
        clientCard.thumbnailUrl = saveBase64MediaToFile(clientCard.thumbnailUrl, 'thumb');
      }

      const serverIndex = db.cards.findIndex((c) => c.id === clientCard.id);
      if (serverIndex === -1) {
        // New card created by client that server didn't have -> keep it!
        db.cards.unshift(clientCard);
        hasChanges = true;
      } else {
        const serverCard = db.cards[serverIndex];
        const clientTime = new Date(clientCard.updatedAt || 0).getTime();
        const serverTime = new Date(serverCard.updatedAt || 0).getTime();

        // Check if client has custom media or newer edits (e.g. user uploaded custom image for Kaisha)
        const clientHasCustomImage = Boolean(
          clientCard.imageUrl && 
          clientCard.imageUrl !== serverCard.imageUrl &&
          !clientCard.imageUrl.includes('unsplash.com/photo-1486406146926')
        );
        const clientHasCustomVideo = Boolean(clientCard.videoUrl && clientCard.videoUrl !== serverCard.videoUrl);
        const clientHasCustomDesc = Boolean(clientCard.description && clientCard.description !== serverCard.description);

        if (clientTime >= serverTime || clientHasCustomImage || clientHasCustomVideo || clientHasCustomDesc) {
          // Client has newer user customizations -> PROTECT IT!
          db.cards[serverIndex] = {
            ...serverCard,
            ...clientCard,
            imageUrl: clientCard.imageUrl || serverCard.imageUrl,
            videoUrl: clientCard.videoUrl || serverCard.videoUrl,
            thumbnailUrl: clientCard.thumbnailUrl || clientCard.imageUrl || serverCard.thumbnailUrl,
            updatedAt: clientCard.updatedAt || new Date().toISOString(),
          };
          hasChanges = true;
        }
      }
    }
    if (hasChanges) {
      writeDatabase(db);
      console.log('[Sync Engine] Successfully preserved and synced user customizations to server.');
    }
  }

  res.json({
    cards: db.cards,
    decks: db.decks,
    syncedAt: new Date().toISOString(),
  });
});

// ==========================================
// VITE SPA INTEGRATION
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NihonFlash Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Storage] Server persistence active at ${DB_FILE}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
