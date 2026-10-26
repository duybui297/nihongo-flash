import type { AppData, Deck, Flashcard } from './types';

/**
 * Sample decks & cards used for a fresh install and for "Khôi phục mẫu".
 * Timestamps are generated at call time so every reset gets fresh dates.
 */
export function createSeedData(now: string = new Date().toISOString()): AppData {
  const DECKS: Deck[] = [
    {
        "id": "deck-n5-basic",
        "name": "Từ vựng N5 - Giao tiếp hàng ngày",
        "description": "Bộ thẻ từ vựng thiết yếu cho người mới bắt đầu học tiếng Nhật",
        "color": "#ef4444",
        "icon": "🌸",
        "createdAt": now
    },
    {
        "id": "deck-kanji-starter",
        "name": "Kanji Hình tượng & Bộ thủ",
        "description": "Chữ Hán trực quan kèm ảnh minh họa và mẹo ghi nhớ sâu",
        "color": "#0284c7",
        "icon": "🗻",
        "createdAt": now
    },
    {
        "id": "deck-culture-phrases",
        "name": "Cụm từ & Văn hóa Nhật Bản",
        "description": "Những câu giao tiếp chứa đựng chiều sâu văn hóa xứ sở hoa anh đào",
        "color": "#10b981",
        "icon": "🍵",
        "createdAt": now
    },
    {
        "id": "deck-kanji-n5-jlpt",
        "name": "Kanji JLPT N5 - Tổng hợp đề thi (90 từ)",
        "description": "Tổng hợp trọn bộ 90 chữ Hán và từ vựng cốt lõi từng xuất hiện trong đề thi JLPT N5, kèm âm Hán Việt, cách đọc, mẹo nhớ và câu ví dụ.",
        "color": "#8b5cf6",
        "icon": "💮",
        "createdAt": now
    }
];

  const CARDS: Flashcard[] = [
    {
        "id": "card-buchou",
        "deckId": "deck-n5-basic",
        "title": "部長 (Buchou) - Trưởng bộ phận, Trưởng phòng",
        "japanese": "部長",
        "reading": "ぶちょう (Buchou)",
        "meaning": "Trưởng phòng, Trưởng bộ phận",
        "jlpt": "N4",
        "category": "Từ vựng",
        "description": "Chức vụ lãnh đạo quan trọng trong hệ thống cấp bậc công ty Nhật Bản (Japanese Corporate Hierarchy).\n\n• Cấu thành chữ Hán:\n- 部 (BỘ): Bộ phận, phòng ban, phân khu.\n- 長 (TRƯỞNG): Đứng đầu, trưởng bối, lớn tuổi, lãnh đạo.\n\n• Hệ thống cấp bậc công ty Nhật thường gặp:\n- 社長 (しゃちょう - Shachou): Giám đốc / Tổng giám đốc\n- 部長 (ぶちょう - Buchou): Trưởng phòng, Trưởng bộ phận\n- 課長 (かちょう - Kachou): Trưởng ban, Quản lý nhóm\n- 係長 (かかりちょう - Kakarichou): Tổ trưởng\n- 社員 (しゃいん - Shain): Nhân viên\n\n• Lưu ý văn hóa công sở: Khi nói chuyện trực tiếp với cấp trên, người Nhật gọi thẳng chức danh, ví dụ: \"Tanaka-buchou\" (田中部長) chứ không dùng \"san\".",
        "imageUrl": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-in-a-boardroom-43403-large.mp4",
        "thumbnailUrl": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-buchou-1",
                "japanese": "新しい企画書を部長に提出しました。",
                "reading": "Atarashii kikakusho o buchou ni teishutsu shimashita.",
                "vietnamese": "Tôi đã nộp bản đề xuất kế hoạch mới lên cho trưởng phòng."
            },
            {
                "id": "ex-buchou-2",
                "japanese": "田中部長はとても優しくて頼りになる上司です。",
                "reading": "Tanaka-buchou wa totemo yasashikute tayori ni naru joushi desu.",
                "vietnamese": "Trưởng phòng Tanaka là một cấp trên rất tốt bụng và đáng tin cậy."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-negau",
        "deckId": "deck-n5-basic",
        "title": "願う (Negau) - Cầu xin, mong muốn, nhờ vả",
        "japanese": "願う",
        "reading": "ねがう (Negau)",
        "meaning": "Cầu xin, mong muốn, cầu chúc, nhờ vả",
        "jlpt": "N4",
        "category": "Từ vựng",
        "description": "Động từ nhóm 1 (Godan verb) biểu đạt sự mong mỏi, cầu chúc từ đáy lòng hoặc nhờ vả lịch sự.\n\n• Cấu thành chữ Hán:\n- 願 (NGUYỆN): Cầu nguyện, tâm nguyện, mong mỏi (chữ Nguyên 原 kết hợp bộ Hiệt 頁).\n\n• Các mẫu câu giao tiếp cửa miệng của người Nhật:\n- よろしくお願いします (Yoroshiku onegai shimasu): Rất mong được sự giúp đỡ của anh/chị.\n- ご健勝を心よりお祈り申し上げます (Lời chúc sức khỏe trang trọng trong thư từ).\n- 願い事 (ねがいごと - Negaigoto): Điều ước (khi viết thẻ gỗ Ema viếng đền thần Shinto vào năm mới).",
        "imageUrl": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-japanese-wind-chime-in-the-wind-41982-large.mp4",
        "thumbnailUrl": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-negau-1",
                "japanese": "世界平和を心から願っています。",
                "reading": "Sekai heiwa o kokoro kara negatte imasu.",
                "vietnamese": "Tôi chân thành cầu mong cho hòa bình của thế giới."
            },
            {
                "id": "ex-negau-2",
                "japanese": "明日晴れることを願っています。",
                "reading": "Ashita hareru koto o negatte imasu.",
                "vietnamese": "Tôi mong ngày mai thời tiết sẽ nắng đẹp."
            },
            {
                "id": "ex-negau-3",
                "japanese": "どうぞよろしくお願いします。",
                "reading": "Douzo yoroshiku onegai shimasu.",
                "vietnamese": "Trăm sự xin nhờ anh chị giúp đỡ."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-genzai",
        "deckId": "deck-n5-basic",
        "title": "現在 (Genzai) - Hiện tại, hiện nay, bây giờ",
        "japanese": "現在",
        "reading": "げんざい (Genzai)",
        "meaning": "Hiện tại, hiện nay, thời điểm này",
        "jlpt": "N3",
        "category": "Từ vựng",
        "description": "Từ vựng chỉ mốc thời gian phổ biến trong văn bản, công việc, tin tức và truyền thông.\n\n• Cấu thành chữ Hán:\n- 現 (HIỆN): Xuất hiện, hiện hữu, trước mắt (bộ Ngọc 玉/王 và chữ Kiến 見).\n- 在 (TẠI): Tồn tại, ở tại, có mặt (bộ Thổ 土).\n\n• So sánh với \"今\" (Ima):\n- 今 (Ima): Dùng trong đàm thoại hàng ngày mang nghĩa \"bây giờ\" (thời điểm ngay lúc nói).\n- 現在 (Genzai): Trang trọng hơn, dùng trong văn viết, báo cáo, thông số thống kê (\"hiện nay\", \"tính đến nay\").\n\n• Cụm từ hay gặp:\n- 過去・現在・未来 (Kako - Genzai - Mirai): Quá khứ - Hiện tại - Tương lai\n- 現在の状況 (Genzai no joukyou): Tình hình hiện tại\n- 2026年現在 (Nisen nijuurokunen genzai): Tính đến thời điểm năm 2026",
        "imageUrl": "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-timelapse-of-tokyo-crossing-at-night-42416-large.mp4",
        "thumbnailUrl": "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-genzai-1",
                "japanese": "現在の時刻は午前10時です。",
                "reading": "Genzai no jikoku wa gozen juuji desu.",
                "vietnamese": "Giờ hiện tại đang là 10 giờ sáng."
            },
            {
                "id": "ex-genzai-2",
                "japanese": "彼は現在、東京の大学で日本語を勉強しています。",
                "reading": "Kare wa genzai, Toukyou no daigaku de Nihongo o benkyou shite imasu.",
                "vietnamese": "Hiện tại anh ấy đang học tiếng Nhật tại một trường đại học ở Tokyo."
            },
            {
                "id": "ex-genzai-3",
                "japanese": "過去にとらわれず、現在を大切に生きよう。",
                "reading": "Kako ni torawarezu, genzai o taisetsu ni ikiyou.",
                "vietnamese": "Đừng vướng bận quá khứ, hãy trân trọng và sống trọn vẹn ở hiện tại."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-kaihatsu",
        "deckId": "deck-n5-basic",
        "title": "開発 (Kaihatsu) - Phát triển (sản phẩm, phần mềm, công nghệ)",
        "japanese": "開発",
        "reading": "かいはつ (Kaihatsu)",
        "meaning": "Phát triển (nghiên cứu, chế tạo sản phẩm, lập trình phần mềm)",
        "jlpt": "N3",
        "category": "Từ vựng",
        "description": "Thuật ngữ trọng yếu trong lĩnh vực IT, công nghệ thông tin, kỹ thuật và sản xuất chế tạo.\n\n• Cấu thành chữ Hán:\n- 開 (KHAI): Mở ra, bắt đầu, khai mở (bộ Môn 門 mở rộng hai cánh cửa).\n- 発 (PHÁT): Bắn ra, xuất phát, phát minh, phát sinh.\n\n• Cụm từ chuyên môn IT & Doanh nghiệp:\n- アプリ開発 (Apuri kaihatsu): Phát triển ứng dụng di động/web\n- ソフトウェア開発 (Sofutowea kaihatsu): Phát triển phần mềm\n- 開発者 (かいはつしゃ - Kaihatsusha): Developer / Lập trình viên / Nhà phát triển\n- 研究開発 (Kenkyuu kaihatsu / R&D): Nghiên cứu và phát triển sản phẩm\n- 開発中 (Kaihatsuchuu): Đang trong giai đoạn phát triển",
        "imageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-typing-on-a-laptop-41642-large.mp4",
        "thumbnailUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-kaihatsu-1",
                "japanese": "新しいスマートフォンのアプリを開発しています。",
                "reading": "Atarashii sumaatofon no apuri o kaihatsu shite imasu.",
                "vietnamese": "Chúng tôi đang phát triển một ứng dụng mới cho điện thoại thông minh."
            },
            {
                "id": "ex-kaihatsu-2",
                "japanese": "AI技術の開発が急速に進んでいます。",
                "reading": "Ei-ai gijutsu no kaihatsu ga kyuusoku ni susunde imasu.",
                "vietnamese": "Sự phát triển của công nghệ trí tuệ nhân tạo (AI) đang tiến bộ nhanh chóng."
            },
            {
                "id": "ex-kaihatsu-3",
                "japanese": "当社は環境に優しい新エネルギーの開発に注力しています。",
                "reading": "Tousha wa kankyou ni yasashii shin-enerugii no kaihatsu ni chuuryoku shite imasu.",
                "vietnamese": "Công ty chúng tôi đang tập trung phát triển nguồn năng lượng mới thân thiện với môi trường."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-ureshii",
        "deckId": "deck-n5-basic",
        "title": "嬉しい (Ureshii) - Vui mừng, sung sướng, hạnh phúc",
        "japanese": "嬉しい",
        "reading": "うれしい (Ureshii)",
        "meaning": "Vui mừng, sung sướng, hạnh phúc",
        "jlpt": "N5",
        "category": "Từ vựng",
        "description": "Tính từ đuôi い (I-adjective) diễn tả cảm xúc vui sướng, hân hoan khi đón nhận tin vui, quà tặng, lời khen hoặc ước muốn thành hiện thực.\n\n• Cấu thành chữ Hán:\n- 嬉 (HI): Vui sướng, hoan hỷ (bộ Nữ 女 kết hợp chữ Hỷ 喜 mang lại điềm lành hạnh phúc).\n\n• Biến đổi ngữ pháp tính từ đuôi い:\n- Khẳng định: 嬉しい (Vui)\n- Phủ định: 嬉しくない (Không vui)\n- Quá khứ: 嬉しかった (Đã rất vui)\n- Phủ định quá khứ: 嬉しくなかった (Đã không vui)\n\n• Phân biệt với \"楽しい\" (Tanoshii):\n- 楽しい (Tanoshii): Vui vẻ do hoạt động khách quan (như đi picnic vui, xem phim hài vui nhộn).\n- 嬉しい (Ureshii): Niềm vui xuất phát từ nội tâm chủ quan (khi đỗ kỳ thi, được ai đó quan tâm giúp đỡ).",
        "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-in-a-park-42289-large.mp4",
        "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-ureshii-1",
                "japanese": "JLPT試験に合格できて、本当に嬉しいです！",
                "reading": "JLPT shiken ni goukaku dekite, hontou ni ureshii desu!",
                "vietnamese": "Đỗ được kỳ thi JLPT khiến tôi thật sự vô cùng sung sướng!"
            },
            {
                "id": "ex-ureshii-2",
                "japanese": "お祝いのメッセージをいただいて、とても嬉しかったです。",
                "reading": "Oiwai no messeeji o itadaite, totemo ureshikatta desu.",
                "vietnamese": "Nhận được tin nhắn chúc mừng từ bạn, tôi cảm thấy rất đỗi vui mừng."
            },
            {
                "id": "ex-ureshii-3",
                "japanese": "そう言ってもらえると嬉しいです。",
                "reading": "Sou itte moraeru to ureshii desu.",
                "vietnamese": "Được bạn khen và động viên như vậy tôi vui lắm."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-kaisha",
        "deckId": "deck-n5-basic",
        "title": "会社 (Kaisha) - Công ty",
        "japanese": "会社",
        "reading": "かいしゃ (Kaisha)",
        "meaning": "Công ty, doanh nghiệp",
        "jlpt": "N5",
        "category": "Từ vựng",
        "description": "Từ vựng thiết yếu trong giao tiếp đời sống và công việc hàng ngày.\n\n• Chữ Hán cấu thành:\n- 会 (HỘI): Gặp gỡ, tụ họp, hội ngộ (bộ Nhân 人 kết hợp chữ Vân 云).\n- 社 (XÃ): Thần đất, đền thờ làng, đoàn thể, xã hội (bộ Thị 礻 và chữ Thổ 土).\n\n• Mẹo ghi nhớ & Điểm thú vị:\n- Ghép \"Hội\" + \"Xã\" = nơi mọi người tụ họp làm việc chung, tức là Công ty (会社).\n- Khi đảo ngược lại thành 社会 (しゃかい - Shakai) thì lại có nghĩa là Xã hội!\n\n• Các cụm từ thông dụng:\n- 会社員 (かいしゃいん - Kaishain): Nhân viên công ty\n- 会社に行く (かいしゃにいく - Kaisha ni iku): Đi làm / Đến công ty\n- 株式会社 (かぶしきがいしゃ - Kabushiki gaisha): Công ty cổ phần\n- 親会社 (おやがいしゃ - Oyagaisha): Công ty mẹ\n- 子会社 (こがいしゃ - Kogaisha): Công ty con",
        "imageUrl": "/assets/kaisha-office.svg",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-and-traffic-time-lapse-40544-large.mp4",
        "thumbnailUrl": "/assets/kaisha-office.svg",
        "examples": [
            {
                "id": "ex-kaisha-1",
                "japanese": "毎朝８時半に会社へ行きます。",
                "reading": "Maiasa hachijihan ni kaisha e ikimasu.",
                "vietnamese": "Mỗi buổi sáng tôi đến công ty lúc 8 giờ rưỡi."
            },
            {
                "id": "ex-kaisha-2",
                "japanese": "父は日本のIT会社で働いています。",
                "reading": "Chichi wa Nihon no aiti- kaisha de hataraite imasu.",
                "vietnamese": "Bố tôi đang làm việc ở một công ty công nghệ thông tin của Nhật."
            },
            {
                "id": "ex-kaisha-3",
                "japanese": "将来、自分の会社を作りたいです。",
                "reading": "Shourai, jibun no kaisha o tsukuritai desu.",
                "vietnamese": "Trong tương lai, tôi muốn tự thành lập công ty của riêng mình."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-sakura",
        "deckId": "deck-n5-basic",
        "title": "桜 (Sakura) - Hoa anh đào",
        "japanese": "桜",
        "reading": "さくら (Sakura)",
        "meaning": "Hoa anh đào - Quốc hoa biểu tượng mùa xuân",
        "jlpt": "N5",
        "category": "Từ vựng",
        "description": "Hoa anh đào tượng trưng cho sự thuần khiết, tươi mới và tinh thần võ sĩ đạo Nhật Bản. Cây nở rộ vào cuối tháng 3 đầu tháng 4, thời điểm mở màn năm học và tài khóa mới. Người Nhật thường tụ họp cùng bạn bè, gia đình dưới tán cây để thưởng rượu và ngắm hoa (Lễ hội Hanami - 花見).",
        "imageUrl": "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=800&q=80",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-blooming-cherry-blossom-branches-42023-large.mp4",
        "thumbnailUrl": "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-1",
                "japanese": "春になると、桜が綺麗に咲きます。",
                "reading": "Haru ni naru to, sakura ga kirei ni sakimasu.",
                "vietnamese": "Khi mùa xuân đến, hoa anh đào nở rất đẹp."
            },
            {
                "id": "ex-2",
                "japanese": "週末に友だちと花見に行きましょう。",
                "reading": "Shuumatsu ni tomodachi to hanami ni ikimashou.",
                "vietnamese": "Cuối tuần này hãy cùng bạn bè đi ngắm hoa anh đào nhé."
            }
        ],
        "status": "mastered",
        "reviewCount": 5,
        "lastReviewedAt": now,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-taberu",
        "deckId": "deck-n5-basic",
        "title": "食べる (Taberu) - Ăn uống",
        "japanese": "食べる",
        "reading": "たべる (Taberu)",
        "meaning": "Ăn (Động từ nhóm 2)",
        "jlpt": "N5",
        "category": "Từ vựng",
        "description": "Một trong những động từ quan trọng nhất trong tiếng Nhật. Thuộc động từ nhóm 2 (Ichidan verb):\n- Thể lịch sự: 食べます (Tabemasu - Ăn)\n- Thể phủ định: 食べない (Tabenai - Không ăn)\n- Thể nối tiếp: 食べて (Tabete - Hãy ăn / Đang ăn)\n- Thể quá khứ: 食べた (Tabeta - Đã ăn)\nChữ Hán Thực (食) gồm bộ Nhân (人) và chữ Lương (良), thể hiện thức ăn lành mạnh nuôi dưỡng thân tâm.",
        "imageUrl": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-ramen-soup-bowl-with-chopsticks-43093-large.mp4",
        "thumbnailUrl": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-taberu-1",
                "japanese": "朝ごはんは何を食べましたか。",
                "reading": "Asagohan wa nani o tabemashita ka.",
                "vietnamese": "Sáng nay bạn đã ăn gì thế?"
            },
            {
                "id": "ex-taberu-2",
                "japanese": "日本料理をたくさん食べたいです。",
                "reading": "Nihon ryouri o takusan tabetai desu.",
                "vietnamese": "Tôi muốn thưởng thức thật nhiều món ăn Nhật Bản."
            }
        ],
        "status": "learning",
        "reviewCount": 2,
        "lastReviewedAt": now,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-fujisan",
        "deckId": "deck-kanji-starter",
        "title": "富士山 (Fujisan) - Núi Phú Sĩ",
        "japanese": "富士山",
        "reading": "ふじさん (Fujisan)",
        "meaning": "Núi Phú Sĩ (Ngọn núi thiêng cao 3.776m)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "Núi Phú Sĩ là biểu tượng thiêng liêng và di sản văn hóa thế giới UNESCO của Nhật Bản. Chữ Hán cấu thành:\n- 富 (Phú): giàu sang, sung túc\n- 士 (Sĩ): chiến sĩ, bậc trí dũng\n- 山 (Sơn): ngọn núi cao\n*Lưu ý ngữ âm*: Trong tiếng Nhật gọi là \"Fujisan\", chữ 山 ở đây đọc theo âm On là \"San\", không gọi là \"Fujiyama\".",
        "imageUrl": "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-fuji-1",
                "japanese": "新幹線の窓から富士山が見えました。",
                "reading": "Shinkansen no mado kara Fujisan ga miemashita.",
                "vietnamese": "Từ cửa sổ tàu Shinkansen, tôi đã ngắm nhìn được núi Phú Sĩ."
            }
        ],
        "status": "learning",
        "reviewCount": 3,
        "lastReviewedAt": now,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-ichigo-ichie",
        "deckId": "deck-culture-phrases",
        "title": "一期一会 (Ichigo Ichie) - Nhất kỳ nhất hội",
        "japanese": "一期一会",
        "reading": "いちごいちえ (Ichigo Ichie)",
        "meaning": "Trân quý từng cuộc gặp gỡ trong đời",
        "jlpt": "N3",
        "category": "Thành ngữ",
        "description": "Triết lý sâu sắc bắt nguồn từ Trà đạo (Chado) của thiền sư Sen no Rikyu. \"Nhất kỳ\" nghĩa là một đời người, \"Nhất hội\" nghĩa là một lần gặp gỡ. Dù là người quen hay người lạ, khoảnh khắc này sẽ không bao giờ diễn ra thêm lần nào nữa trong vũ trụ, vì vậy hãy đối đãi nhau trọn vẹn và chân tình.",
        "imageUrl": "https://images.unsplash.com/photo-1545048702-793607ce028b?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1545048702-793607ce028b?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-ichigo-1",
                "japanese": "旅の出会いは一期一会だから、大切にしたい。",
                "reading": "Tabi no deai wa ichigo ichie dakara, taisetsu ni shitai.",
                "vietnamese": "Gặp gỡ trên chuyến hành trình là nhất kỳ nhất hội, nên tôi muốn nâng niu trân trọng."
            }
        ],
        "status": "learning",
        "reviewCount": 1,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-itadakimasu",
        "deckId": "deck-culture-phrases",
        "title": "いただきます (Itadakimasu) - Lời chào trước bữa ăn",
        "japanese": "いただきます",
        "reading": "いただきます (Itadakimasu)",
        "meaning": "Xin phép được dùng bữa (Tạ ơn thức ăn)",
        "jlpt": "N5",
        "category": "Giao tiếp",
        "description": "Cử chỉ nét đẹp văn hóa Nhật Bản. Trước khi ăn, người Nhật chắp hai tay trước ngực và nói \"いただきます\". Bắt nguồn từ khiêm nhường ngữ của nhận lãnh (頂く - đưa lên đỉnh đầu tôn kính). Mang hàm ý cảm tạ sinh mệnh của động thực vật đã tạo nên món ăn và công sức người nông dân, đầu bếp.",
        "imageUrl": "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-ita-1",
                "japanese": "みんなで「いただきます」と言って食べ始めました。",
                "reading": "Minna de \"itadakimasu\" to itte tabehajimemashita.",
                "vietnamese": "Mọi người cùng nói \"Itadakimasu\" rồi bắt đầu dùng bữa."
            }
        ],
        "status": "mastered",
        "reviewCount": 4,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-neko",
        "deckId": "deck-kanji-starter",
        "title": "猫 (Neko) - Con mèo",
        "japanese": "猫",
        "reading": "ねこ (Neko)",
        "meaning": "Con mèo",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "Chữ Hán 猫 có bộ Khuyển (犭 - loài thú 4 chân) kết hợp với chữ Miêu (苗 - cây mạ non, vừa là tượng thanh tiếng mèo kêu meo meo). Mèo rất được yêu chuộng tại Nhật Bản, nổi tiếng với chú mèo may mắn Maneki-neko (招き猫) vẫy tay gọi tài lộc.",
        "imageUrl": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
        "examples": [
            {
                "id": "ex-neko-1",
                "japanese": "我が家には黒い猫が二匹います。",
                "reading": "Wagaya ni wa kuroi neko ga nihiki imasu.",
                "vietnamese": "Nhà tôi có hai chú mèo màu đen."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-01-kaisha",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "会社 (かいしゃ) - HỘI XÃ: Công ty",
        "japanese": "会社",
        "reading": "かいしゃ",
        "meaning": "Công ty",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HỘI XÃ\n• Ý nghĩa: Công ty\n\n• Phân tích & Cấu thành chữ Hán:\n• 会 (HỘI): Gặp gỡ, tụ họp, hội tụ.\n• 社 (XÃ): Xã hội, nơi chốn, đoàn thể, đền thờ.\n→ Nơi mọi người tụ họp cùng làm việc tạo thành Công ty.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTrọng tâm JLPT N5 trong câu hỏi cách đọc (かいしゃ) và phân biệt với 社会 (しゃかい - Xã hội).",
        "examples": [
            {
                "id": "ex-n5-01-1",
                "japanese": "兄は日本の会社で働いています。",
                "reading": "Ani wa Nihon no kaisha de hataraite imasu.",
                "vietnamese": "Anh trai tôi đang làm việc tại một công ty Nhật Bản."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-02-ashi",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "足 (あし) - TÚC: Chân",
        "japanese": "足",
        "reading": "あし",
        "meaning": "Chân",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TÚC\n• Ý nghĩa: Chân\n\n• Phân tích & Cấu thành chữ Hán:\n• 足 tượng hình chiếc cẳng chân và bàn chân người đang bước đi. Chữ này còn mang nghĩa 'đầy đủ' (Túc trong sung túc, túc số).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun là あし (chân), âm On là ソク (trong lượng từ đếm đôi tất/giày 一足 いっそく).",
        "examples": [
            {
                "id": "ex-n5-02-1",
                "japanese": "たくさん歩いたので、足が痛くなりました。",
                "reading": "Takusan aruita node, ashi ga itaku narimashita.",
                "vietnamese": "Vì đã đi bộ rất nhiều nên chân tôi bị đau."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-03-okuni",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "お国 (おくに) - QUỐC: Đất nước, quê hương",
        "japanese": "お国",
        "reading": "おくに",
        "meaning": "Đất nước, quê hương",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: QUỐC\n• Ý nghĩa: Đất nước, quê hương\n\n• Phân tích & Cấu thành chữ Hán:\n• お (tiền tố kính ngữ / mỹ từ) + 国 (QUỐC).\n• 国: Bên ngoài là bộ Vi 囗 tượng trưng biên giới lãnh thổ, bên trong là chữ Ngọc 玉 (báu vật quốc gia).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTrong giao tiếp lịch sự thường hỏi: 'お国はどちらですか' (Quê hương/đất nước bạn ở đâu?).",
        "examples": [
            {
                "id": "ex-n5-03-1",
                "japanese": "お国はどちらですか。ベトナムです。",
                "reading": "Okuni wa dochira desu ka. Betonamu desu.",
                "vietnamese": "Đất nước của bạn ở đâu vậy? - Là Việt Nam."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-04-doyoubi-1",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "土ようび (どようび) - THỔ: Thứ bảy",
        "japanese": "土ようび",
        "reading": "どようび",
        "meaning": "Thứ bảy",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THỔ\n• Ý nghĩa: Thứ bảy\n\n• Phân tích & Cấu thành chữ Hán:\n• 土 (THỔ): Đất đai, mặt đất có mầm cây nhô lên.\n• Thuộc hệ thống Thất diệu chỉ ngày trong tuần: Nhật, Nguyệt, Hỏa, Thủy, Mộc, Kim, Thổ.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐề thi N5 có thể viết dạng 土ようび hoặc 土曜日 (どようび).",
        "examples": [
            {
                "id": "ex-n5-04-1",
                "japanese": "土曜日の夜、友達と映画を見に行きます。",
                "reading": "Doyoubi no yoru, tomodachi to eiga o mi ni ikimasu.",
                "vietnamese": "Tối thứ bảy tôi sẽ đi xem phim cùng bạn bè."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-05-yasumu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "休む (やすむ) - HƯU: Nghỉ, nghỉ ngơi, vắng mặt",
        "japanese": "休む",
        "reading": "やすむ",
        "meaning": "Nghỉ, nghỉ ngơi, vắng mặt",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HƯU\n• Ý nghĩa: Nghỉ, nghỉ ngơi, vắng mặt\n\n• Phân tích & Cấu thành chữ Hán:\n• Bộ Nhân đứng 亻(con người) dựa vào chữ Mộc 木 (gốc cây to) để nghỉ mát -> HƯU (nghỉ ngơi).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐộng từ nhóm 1. Nghỉ học/làm: 学校／会社を休む. Danh từ: 休み (Kỳ nghỉ).",
        "examples": [
            {
                "id": "ex-n5-05-1",
                "japanese": "熱があるので、今日会社を休みます。",
                "reading": "Netsu ga aru node, kyou kaisha o yasumimasu.",
                "vietnamese": "Vì bị sốt nên hôm nay tôi xin nghỉ làm ở công ty."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-06-sukunai",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "少ない (すくない) - THIỂU: Ít, hiếm",
        "japanese": "少ない",
        "reading": "すくない",
        "meaning": "Ít, hiếm",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THIỂU\n• Ý nghĩa: Ít, hiếm\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Tiểu 小 (nhỏ bé) thêm nét phẩy bên dưới tạo thành Thiểu 少 (số lượng ít ỏi).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÍt khi bổ nghĩa trực tiếp cho danh từ (không dùng 少ない人 mà dùng 人が少ない).",
        "examples": [
            {
                "id": "ex-n5-06-1",
                "japanese": "雨の日、公園に人が少ないです。",
                "reading": "Ame no hi, kouen ni hito ga sukunai desu.",
                "vietnamese": "Vào ngày mưa, ở công viên có rất ít người."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-07-dasu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "出す (だす) - XUẤT: Gửi, rút ra, lấy ra, nộp",
        "japanese": "出す",
        "reading": "だす",
        "meaning": "Gửi, rút ra, lấy ra, nộp",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: XUẤT\n• Ý nghĩa: Gửi, rút ra, lấy ra, nộp\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Xuất 出 vẽ hình ngọn mầm vượt qua khỏi mặt đất, vươn ra bên ngoài.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTha động từ: 手紙を出す (gửi thư), 宿題を出す (nộp bài tập), お金を出す (rút/trả tiền).",
        "examples": [
            {
                "id": "ex-n5-07-1",
                "japanese": "授業の前に宿題を出してください。",
                "reading": "Jugyou no mae ni shukudai o dashite kudasai.",
                "vietnamese": "Xin hãy nộp bài tập về nhà trước giờ học."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-08-tomodachi",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "友達 (ともだち) - HỮU ĐẠT: Bạn bè",
        "japanese": "友達",
        "reading": "ともだち",
        "meaning": "Bạn bè",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HỮU ĐẠT\n• Ý nghĩa: Bạn bè\n\n• Phân tích & Cấu thành chữ Hán:\n• 友 (HỮU): Hai bàn tay cùng nắm chặt lấy nhau làm bạn tri kỷ.\n• 達 (ĐẠT): Hậu tố chỉ số nhiều, thông suốt.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTừ vựng trọng tâm N5, chú ý âm Kun とも (Hữu) kết hợp đuôi だち (biến âm từ たち).",
        "examples": [
            {
                "id": "ex-n5-08-1",
                "japanese": "日曜日に友達と新宿へ買い物に行きました。",
                "reading": "Nichiyoubi ni tomodachi to Shinjuku e kaimono ni ikimashita.",
                "vietnamese": "Vào chủ nhật tôi đã đi mua sắm ở Shinjuku cùng với bạn bè."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-09-taberu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "食べる (たべる) - THỰC: Ăn",
        "japanese": "食べる",
        "reading": "たべる",
        "meaning": "Ăn",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THỰC\n• Ý nghĩa: Ăn\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Thực 食 tượng hình cái hộp/liễn đựng thức ăn có nắp đậy (nhân hợp 亼 + cấn 艮).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐộng từ nhóm 2 (Ichidan): 食べます, 食べて, 食べた, 食べない.",
        "examples": [
            {
                "id": "ex-n5-09-1",
                "japanese": "毎朝パンとバナナを食べます。",
                "reading": "Maiasa pan to banana o tabemasu.",
                "vietnamese": "Mỗi sáng tôi đều ăn bánh mì và chuối."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-10-eigo",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "英語 (えいご) - ANH NGỮ: Tiếng Anh",
        "japanese": "英語",
        "reading": "えいご",
        "meaning": "Tiếng Anh",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ANH NGỮ\n• Ý nghĩa: Tiếng Anh\n\n• Phân tích & Cấu thành chữ Hán:\n• 英 (ANH): Nước Anh, tài ba, tinh anh.\n• 語 (NGỮ): Ngôn ngữ (Bộ Ngôn 言 + Ngũ 五 + Khẩu 口).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐề thi N5 hay kiểm tra chữ 英 (dễ nhầm với 映 - ánh, trong 映画 eiga).",
        "examples": [
            {
                "id": "ex-n5-10-1",
                "japanese": "英語で簡単な手紙を書くことができます。",
                "reading": "Eigo de kantan na tegami o kaku koto ga dekimasu.",
                "vietnamese": "Tôi có thể viết một bức thư đơn giản bằng tiếng Anh."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-11-naka",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "中 (なか) - TRUNG: Bên trong, ở giữa",
        "japanese": "中",
        "reading": "なか",
        "meaning": "Bên trong, ở giữa",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TRUNG\n• Ý nghĩa: Bên trong, ở giữa\n\n• Phân tích & Cấu thành chữ Hán:\n• Hình một hồng tâm bị một mũi tên xuyên qua chính giữa -> TRUNG (ở giữa, trong lòng).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: なか (bên trong). Âm On: チュウ (trong 中国 Chuugoku, 一日中 ichinichijuu).",
        "examples": [
            {
                "id": "ex-n5-11-1",
                "japanese": "かばんの中に財布と鍵が入っています。",
                "reading": "Kaban no naka ni saifu to kagi ga haitte imasu.",
                "vietnamese": "Trong cặp sách có để ví tiền và chìa khóa."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-12-maishuu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "毎週 (まいしゅう) - MỖI CHU: Mỗi tuần, hàng tuần",
        "japanese": "毎週",
        "reading": "まいしゅう",
        "meaning": "Mỗi tuần, hàng tuần",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: MỖI CHU\n• Ý nghĩa: Mỗi tuần, hàng tuần\n\n• Phân tích & Cấu thành chữ Hán:\n• 毎 (MỖI): Từng cái một, mỗi một.\n• 週 (CHU): Vòng chu kỳ một tuần (bộ Quai xước 辶 đi một vòng 周).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nNhóm từ chỉ tần suất: 毎日 (mỗi ngày), 毎週 (mỗi tuần), 毎月 (mỗi tháng), 毎年 (mỗi năm).",
        "examples": [
            {
                "id": "ex-n5-12-1",
                "japanese": "毎週水曜日にプールで泳ぎます。",
                "reading": "Maishuu suiyoubi ni puuru de oyogimasu.",
                "vietnamese": "Hàng tuần vào thứ tư tôi đều đi bơi ở hồ bơi."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-13-mise",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "店 (みせ) - ĐIẾM: Cửa hàng, tiệm",
        "japanese": "店",
        "reading": "みせ",
        "meaning": "Cửa hàng, tiệm",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ĐIẾM\n• Ý nghĩa: Cửa hàng, tiệm\n\n• Phân tích & Cấu thành chữ Hán:\n• Bộ Quảng 广 (mái nhà che) + Chiếm 占 (chiếm giữ chỗ để buôn bán) -> ĐIẾM (quán xá, tiệm).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: みせ (cửa tiệm). Âm On: テン (trong 店員 ten'in: nhân viên bán hàng, 喫茶店 kissaten: quán trà).",
        "examples": [
            {
                "id": "ex-n5-13-1",
                "japanese": "駅の前に新しいカフェの店ができました。",
                "reading": "Eki no mae ni atarashii kafe no mise ga dekimashita.",
                "vietnamese": "Ở trước nhà ga vừa mới mở một quán cà phê mới."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-14-gaikoku",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "外国 (がいこく) - NGOẠI QUỐC: Nước ngoài",
        "japanese": "外国",
        "reading": "がいこく",
        "meaning": "Nước ngoài",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NGOẠI QUỐC\n• Ý nghĩa: Nước ngoài\n\n• Phân tích & Cấu thành chữ Hán:\n• 外 (NGOẠI): Bên ngoài.\n• 国 (QUỐC): Quốc gia, đất nước.\n→ Đất nước nằm bên ngoài lãnh thổ.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTừ ghép hay gặp: 外国人 (がいこくじん - Người nước ngoài), 外国語 (がいこくご - Ngoại ngữ).",
        "examples": [
            {
                "id": "ex-n5-14-1",
                "japanese": "将来、外国で日本語を教えたいです。",
                "reading": "Shourai, gaikoku de Nihongo o oshietai desu.",
                "vietnamese": "Trong tương lai, tôi muốn dạy tiếng Nhật ở nước ngoài."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-15-hanashi",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "話 (はなし) - THOẠI: Câu chuyện, cuộc trò chuyện",
        "japanese": "話",
        "reading": "はなし",
        "meaning": "Câu chuyện, cuộc trò chuyện",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THOẠI\n• Ý nghĩa: Câu chuyện, cuộc trò chuyện\n\n• Phân tích & Cấu thành chữ Hán:\n• Bộ Ngôn 言 (lời nói) kết hợp chữ Thiệt 舌 (cái lưỡi). Dùng lưỡi cất lời nói -> Câu chuyện, chuyện trò.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nDanh từ là 話 (はなし - câu chuyện). Động từ là 話す (はなす - nói chuyện).",
        "examples": [
            {
                "id": "ex-n5-15-1",
                "japanese": "祖父から昔の面白い話を聞きました。",
                "reading": "Sofu kara mukashi no omoshiroi hanashi o kikimashita.",
                "vietnamese": "Tôi đã được nghe một câu chuyện ngày xưa rất thú vị từ ông nội."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-16-yomu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "読む (よむ) - ĐỘC: Đọc",
        "japanese": "読む",
        "reading": "よむ",
        "meaning": "Đọc",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ĐỘC\n• Ý nghĩa: Đọc\n\n• Phân tích & Cấu thành chữ Hán:\n• Bộ Ngôn 言 (ngôn từ) + chữ Mại 賣 (đổi, bán). Xướng ngôn từ ngữ to thành tiếng -> ĐỌC.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐộng từ nhóm 1: 読みます (yomimasu), 読んで (yonde), 読まない (yomanai).",
        "examples": [
            {
                "id": "ex-n5-16-1",
                "japanese": "寝る前に日本の漫画を読みます。",
                "reading": "Neru mae ni Nihon no manga o yomimasu.",
                "vietnamese": "Trước khi đi ngủ tôi thường đọc truyện tranh Nhật Bản."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-17-kitagawa",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "北側 (きたがわ) - BẮC TRẮC: Phía bắc, hướng bắc",
        "japanese": "北側",
        "reading": "きたがわ",
        "meaning": "Phía bắc, hướng bắc",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: BẮC TRẮC\n• Ý nghĩa: Phía bắc, hướng bắc\n\n• Phân tích & Cấu thành chữ Hán:\n• 北 (BẮC): Hướng bắc (hình hai người đứng tựa lưng tránh gió lạnh phương bắc).\n• 側 (TRẮC): Phía, bên cạnh (bộ Nhân 亻 + Tắc 則).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nBốn hướng trong N5: 東 (Đông), 西 (Tây), 南 (Nam), 北 (Bắc). Thêm 側 (がわ) để chỉ phương hướng phía bên.",
        "examples": [
            {
                "id": "ex-n5-17-1",
                "japanese": "駅の北側に大きな公園があります。",
                "reading": "Eki no kitagawa ni ookina kouen ga arimasu.",
                "vietnamese": "Ở phía bắc của nhà ga có một công viên lớn."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-18-kugatsu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "九月 (くがつ) - CỬU NGUYỆT: Tháng 9",
        "japanese": "九月",
        "reading": "くがつ",
        "meaning": "Tháng 9",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: CỬU NGUYỆT\n• Ý nghĩa: Tháng 9\n\n• Phân tích & Cấu thành chữ Hán:\n• 九 (CỬU): Số 9.\n• 月 (NGUYỆT): Tháng, mặt trăng.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nCỰC KỲ QUAN TRỌNG: Tháng 9 đọc là くがつ (kugatsu), đề thi hay bẫy きゅうがつ (sai).",
        "examples": [
            {
                "id": "ex-n5-18-1",
                "japanese": "私の誕生日は九月十日です。",
                "reading": "Watashi no tanjoubi wa kugatsu tooka desu.",
                "vietnamese": "Sinh nhật của tôi là vào ngày 10 tháng 9."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-19-konai",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "来ない (こない) - LAI: Không đến",
        "japanese": "来ない",
        "reading": "こない",
        "meaning": "Không đến",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: LAI\n• Ý nghĩa: Không đến\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Lai 来 tượng hình ngọn lúa mì từ phương xa đưa tới -> Đến.\n• Thể ngắn phủ định của động từ bất quy tắc くる (Kuru).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nBiến âm động từ Kuru nhóm 3: くる (kuru) -> きます (kimasu) -> こない (konai) -> こられた (korareta). Đề thi N5 rất hay kiểm tra chữ 来 khi đọc là こ trong 来ない.",
        "examples": [
            {
                "id": "ex-n5-19-1",
                "japanese": "約束の時間ですが、田中さんがまだ来ないです。",
                "reading": "Yakusoku no jikan desu ga, Tanaka-san ga mada konai desu.",
                "vietnamese": "Đã đến giờ hẹn rồi nhưng anh Tanaka vẫn chưa đến."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-20-tenki-1",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "天気 (てんき) - THIÊN KHÍ: Thời tiết",
        "japanese": "天気",
        "reading": "てんき",
        "meaning": "Thời tiết",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THIÊN KHÍ\n• Ý nghĩa: Thời tiết\n\n• Phân tích & Cấu thành chữ Hán:\n• 天 (THIÊN): Trời, cõi trời bao la.\n• 気 (KHÍ): Khí quyển, luồng không khí, tâm trạng.\n→ Trạng thái khí hậu của trời đất.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nCâu hỏi phổ biến: 天気予報 (てんきよほう - Dự báo thời tiết), いい天気 (thời tiết đẹp).",
        "examples": [
            {
                "id": "ex-n5-20-1",
                "japanese": "今日はいい天気ですから、洗濯物を干しましょう。",
                "reading": "Kyou wa ii tenki desu kara, sentakumono o hoshimashou.",
                "vietnamese": "Hôm nay thời tiết đẹp nên hãy phơi quần áo nhé."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-21-sora",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "空 (そら) - KHÔNG: Bầu trời, khoảng không",
        "japanese": "空",
        "reading": "そら",
        "meaning": "Bầu trời, khoảng không",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: KHÔNG\n• Ý nghĩa: Bầu trời, khoảng không\n\n• Phân tích & Cấu thành chữ Hán:\n• Bộ Huyệt 穴 (cửa hang) + chữ Công 工. Khoảng không gian trống trải phía trên vòm trời -> Bầu trời.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: そら (bầu trời). Âm On: クウ (trong 空気 kuuki: không khí, 空港 kuukou: sân bay).",
        "examples": [
            {
                "id": "ex-n5-21-1",
                "japanese": "見上げると、青い空に鳥が飛んでいました。",
                "reading": "Miageru to, aoi sora ni tori ga tonde imashita.",
                "vietnamese": "Khi ngước nhìn lên, từng đàn chim đang bay liệng trên bầu trời xanh."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-22-tatsu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "立つ (たつ) - LẬP: Đứng, dựng lên",
        "japanese": "立つ",
        "reading": "たつ",
        "meaning": "Đứng, dựng lên",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: LẬP\n• Ý nghĩa: Đứng, dựng lên\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Lập 立 vẽ hình một người đang đứng thẳng vững chãi bằng cả hai chân trên mặt đất ngang.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐộng từ nhóm 1: 立ちます (tachimasu), 立って (tatte), 立たない (tatanai).",
        "examples": [
            {
                "id": "ex-n5-22-1",
                "japanese": "危ないですから、電車のドアの前に立たないでください。",
                "reading": "Abunai desu kara, densha no doa no mae ni tatanaide kudasai.",
                "vietnamese": "Vì nguy hiểm nên xin đừng đứng trước cửa tàu điện."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-23-gakusei",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "学生 (がくせい) - HỌC SINH: Học sinh, sinh viên",
        "japanese": "学生",
        "reading": "がくせい",
        "meaning": "Học sinh, sinh viên",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HỌC SINH\n• Ý nghĩa: Học sinh, sinh viên\n\n• Phân tích & Cấu thành chữ Hán:\n• 学 (HỌC): Học tập, kiến thức.\n• 生 (SINH): Con người, người đang sinh hoạt / sinh sống học tập.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTrong tiếng Nhật, 学生 (gakusei) thường dùng chỉ học sinh từ cấp 3 / sinh viên đại học. Học sinh tiểu học là 小学生.",
        "examples": [
            {
                "id": "ex-n5-23-1",
                "japanese": "私はさくら大学の学生です。",
                "reading": "Watashi wa Sakura daigaku no gakusei desu.",
                "vietnamese": "Tôi là sinh viên của trường đại học Sakura."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-24-oriru",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "下りる (おりる) - HẠ: Xuống (xe, tàu, cầu thang)",
        "japanese": "下りる",
        "reading": "おりる",
        "meaning": "Xuống (xe, tàu, cầu thang)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HẠ\n• Ý nghĩa: Xuống (xe, tàu, cầu thang)\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Hạ 下 là chữ chỉ sự, nét ngang làm chuẩn, nét đứng và móc hướng xuống phía dưới.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐộng từ nhóm 2. Đi với trợ từ を: 電車を下りる (xuống tàu điện), バスを下りる (xuống xe buýt).",
        "examples": [
            {
                "id": "ex-n5-24-1",
                "japanese": "次のバス停でバスを下ります。",
                "reading": "Tsugi no basutei de basu o orimasu.",
                "vietnamese": "Tôi sẽ xuống xe buýt ở trạm dừng tiếp theo."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-25-mizu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "水 (みず) - THỦY: Nước (nước lã, nước lạnh)",
        "japanese": "水",
        "reading": "みず",
        "meaning": "Nước (nước lã, nước lạnh)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THỦY\n• Ý nghĩa: Nước (nước lã, nước lạnh)\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Thủy 水 tượng hình dòng nước cuộn chảy với những gợn sóng bắn ra hai bên.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nNước lạnh/thường là 水 (みず). Nước nóng đun sôi là お湯 (おゆ).",
        "examples": [
            {
                "id": "ex-n5-25-1",
                "japanese": "冷たい水を一杯飲んでもいいですか。",
                "reading": "Tsumetai mizu o ippai nonde mo ii desu ka.",
                "vietnamese": "Tôi có thể uống một cốc nước lạnh được không ạ?"
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-26-hairu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "入る (はいる) - NHẬP: Đi vào, bước vào",
        "japanese": "入る",
        "reading": "はいる",
        "meaning": "Đi vào, bước vào",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NHẬP\n• Ý nghĩa: Đi vào, bước vào\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Nhập 入 tượng hình ngọn rễ đâm sâu vào lòng đất hoặc cửa hầm bước vào trong (nét phải dài hơn nét trái).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nLƯU Ý ĐẶC BIỆT: Mặc dù đuôi iru nhưng 入る (hairu) là động từ nhóm 1 (入ります / hairimasu, 入って / haitte).",
        "examples": [
            {
                "id": "ex-n5-26-1",
                "japanese": "靴を脱いで、部屋に入ってください。",
                "reading": "Kutsu o nuide, heya ni haitte kudasai.",
                "vietnamese": "Xin hãy cởi giày ra rồi bước vào phòng."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-27-shakai",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "社会 (しゃかい) - XÃ HỘI: Xã hội",
        "japanese": "社会",
        "reading": "しゃかい",
        "meaning": "Xã hội",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: XÃ HỘI\n• Ý nghĩa: Xã hội\n\n• Phân tích & Cấu thành chữ Hán:\n• 社 (XÃ): Cộng đồng, đền thờ thổ thần bảo hộ.\n• 会 (HỘI): Tụ họp, gắn kết đông đảo.\n→ Cộng đồng cùng chung sống gắn bó.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nRất hay bẫy hoán đổi với 会社 (かいしゃ - công ty). Hãy nhớ: 社 đứng trước là Xã hội (しゃかい), 会 đứng trước là Công ty (かいしゃ).",
        "examples": [
            {
                "id": "ex-n5-27-1",
                "japanese": "大学で現代の日本社会について学んでいます。",
                "reading": "Daigaku de gendai no Nihon shakai ni tsuite manande imasu.",
                "vietnamese": "Ở đại học, tôi đang học về xã hội Nhật Bản hiện đại."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-28-okaasan",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "お母さん (おかあさん) - MẪU: Mẹ (kính xưng / mẹ người khác)",
        "japanese": "お母さん",
        "reading": "おかあさん",
        "meaning": "Mẹ (kính xưng / mẹ người khác)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: MẪU\n• Ý nghĩa: Mẹ (kính xưng / mẹ người khác)\n\n• Phân tích & Cấu thành chữ Hán:\n• お (tiền tố kính ngữ) + 母 (MẪU - hình tượng người mẹ cho hai con bú với hai giọt sữa) + さん.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nKhi nói về mẹ mình với người ngoài dùng 母 (はは - haha). Khi nói về mẹ người khác hoặc gọi mẹ ơi dùng お母さん.",
        "examples": [
            {
                "id": "ex-n5-28-1",
                "japanese": "お母さんはお元気ですか。",
                "reading": "Okaasan wa ogenki desu ka.",
                "vietnamese": "Bác gái (mẹ của bạn) có khỏe không?"
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-29-shigatsu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "四月 (しがつ) - TỨ NGUYỆT: Tháng 4",
        "japanese": "四月",
        "reading": "しがつ",
        "meaning": "Tháng 4",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TỨ NGUYỆT\n• Ý nghĩa: Tháng 4\n\n• Phân tích & Cấu thành chữ Hán:\n• 四 (TỨ): Số 4.\n• 月 (NGUYỆT): Tháng.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐIỂM NHẤN ĐỀ THI: Tháng 4 BẮT BUỘC đọc là しがつ (shigatsu), KHÔNG BAO GIỜ đọc là よんがつ.",
        "examples": [
            {
                "id": "ex-n5-29-1",
                "japanese": "日本では四月から新しい学校の年が始まります。",
                "reading": "Nihon de wa shigatsu kara atarashii gakkou no toshi ga hajimarimasu.",
                "vietnamese": "Ở Nhật Bản năm học mới bắt đầu từ tháng tư."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-30-kikimasu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "聞きます (ききます) - VĂN: Nghe, hỏi",
        "japanese": "聞きます",
        "reading": "ききます",
        "meaning": "Nghe, hỏi",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: VĂN\n• Ý nghĩa: Nghe, hỏi\n\n• Phân tích & Cấu thành chữ Hán:\n• Bộ Môn 門 (cánh cổng) + bộ Nhĩ 耳 (cái tai). Ghé sát vành tai vào khe cửa để lắng nghe tin tức.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nMang cả 2 nghĩa quan trọng: 音楽を聞く (nghe nhạc) và 先生に聞く (hỏi giáo viên). Thể từ điển là 聞く.",
        "examples": [
            {
                "id": "ex-n5-30-1",
                "japanese": "分からない言葉があれば、先生に聞きます。",
                "reading": "Wakaranai kotoba ga areba, sensei ni kikimasu.",
                "vietnamese": "Nếu có từ nào không hiểu, tôi sẽ hỏi giáo viên."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-31-rokuban",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "六番 (ろくばん) - LỤC PHIÊN: Số 6, thứ tự số 6",
        "japanese": "六番",
        "reading": "ろくばん",
        "meaning": "Số 6, thứ tự số 6",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: LỤC PHIÊN\n• Ý nghĩa: Số 6, thứ tự số 6\n\n• Phân tích & Cấu thành chữ Hán:\n• 六 (LỤC): Số 6.\n• 番 (PHIÊN): Số thứ tự, phiên hiệu, lượt.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nHay gặp ở bến xe buýt, sân ga đường ray (六番線 - đường ray số 6).",
        "examples": [
            {
                "id": "ex-n5-31-1",
                "japanese": "六番の窓口へ書類を持って行ってください。",
                "reading": "Rokuban no madoguchi e shorui o motte itte kudasai.",
                "vietnamese": "Xin vui lòng mang giấy tờ đến quầy số 6."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-32-konshuu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "今週 (こんしゅう) - KIM CHU: Tuần này",
        "japanese": "今週",
        "reading": "こんしゅう",
        "meaning": "Tuần này",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: KIM CHU\n• Ý nghĩa: Tuần này\n\n• Phân tích & Cấu thành chữ Hán:\n• 今 (KIM): Hiện tại, bây giờ (âm Kun là いま).\n• 週 (CHU): Tuần lễ (âm On là しゅう).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTrục thời gian tuần: 先週 (senshuu - tuần trước) → 今週 (konshuu - tuần này) → 来週 (raishuu - tuần sau).",
        "examples": [
            {
                "id": "ex-n5-32-1",
                "japanese": "今週の金曜日に日本語の試験があります。",
                "reading": "Konshuu no kin'youbi ni Nihongo no shiken ga arimasu.",
                "vietnamese": "Thứ sáu tuần này sẽ có kỳ thi tiếng Nhật."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-33-nishiguchi",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "西口 (にしぐち) - TÂY KHẨU: Cửa tây, lối ra phía tây",
        "japanese": "西口",
        "reading": "にしぐち",
        "meaning": "Cửa tây, lối ra phía tây",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TÂY KHẨU\n• Ý nghĩa: Cửa tây, lối ra phía tây\n\n• Phân tích & Cấu thành chữ Hán:\n• 西 (TÂY): Hướng tây, mặt trời lặn (âm Kun: にし).\n• 口 (KHẨU): Cửa ngõ, lối ra vào (biến âm thành ぐち).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nBiến âm liên thanh: nishi + kuchi → nishiguchi. Ngược lại có 東口 (higashiguchi - cửa đông).",
        "examples": [
            {
                "id": "ex-n5-33-1",
                "japanese": "駅の西口を出たところで待っています。",
                "reading": "Eki no nishiguchi o deta tokoro de matte imasu.",
                "vietnamese": "Tôi đang đợi ở ngay chỗ bước ra từ cửa tây nhà ga."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-34-kaku",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "書く (かく) - THƯ: Viết",
        "japanese": "書く",
        "reading": "かく",
        "meaning": "Viết",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THƯ\n• Ý nghĩa: Viết\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Duật 聿 (tay cầm bút lông) + Nhật 日 (ngày). Cầm bút ghi chép nhật ký hàng ngày -> Viết sách, viết chữ.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐộng từ nhóm 1: 書きます (kakimasu), 書いて (kaite), 書かない (kakanai). Chú ý thể Te chia là かいて.",
        "examples": [
            {
                "id": "ex-n5-34-1",
                "japanese": "黒板に漢字を大きく書きました。",
                "reading": "Kokuban ni kanji o ookiku kakimashita.",
                "vietnamese": "Tôi đã viết chữ Hán thật to lên bảng đen."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-35-otousan",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "お父さん (おとうさん) - PHỤ: Bố, người cha (kính xưng / bố người khác)",
        "japanese": "お父さん",
        "reading": "おとうさん",
        "meaning": "Bố, người cha (kính xưng / bố người khác)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: PHỤ\n• Ý nghĩa: Bố, người cha (kính xưng / bố người khác)\n\n• Phân tích & Cấu thành chữ Hán:\n• お (kính ngữ) + 父 (PHỤ - hình ảnh hai bàn tay nâng cây rìu đá lao động nuôi sống gia đình) + さん.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nNói về bố mình: 父 (ちち - chichi). Nói về bố người khác hoặc gọi bố: お父さん (otousan).",
        "examples": [
            {
                "id": "ex-n5-35-1",
                "japanese": "田中さんのお父さんは医者です。",
                "reading": "Tanaka-san no otousan wa isha desu.",
                "vietnamese": "Bố của bạn Tanaka là một bác sĩ."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-36-hyakunin",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "百人 (ひゃくにん) - BÁCH NHÂN: 100 người",
        "japanese": "百人",
        "reading": "ひゃくにん",
        "meaning": "100 người",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: BÁCH NHÂN\n• Ý nghĩa: 100 người\n\n• Phân tích & Cấu thành chữ Hán:\n• 百 (BÁCH): Số 100.\n• 人 (NHÂN): Người (trong lượng từ đếm người đọc là にん: 一人 ひとり, 二人 ふたり, 三人 さんにん... 百人 ひゃくにん).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nLượng từ chỉ số lượng người lớn, chú ý phát âm chuẩn ひゃくにん (hyakunin).",
        "examples": [
            {
                "id": "ex-n5-36-1",
                "japanese": "ホールには百人以上の留学生がいます。",
                "reading": "Hooru ni wa hyakunin ijou no ryuugakusei ga imasu.",
                "vietnamese": "Trong hội trường có hơn 100 du học sinh."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-37-gofun",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "五分 (ごふん) - NGŨ PHÂN: 5 phút",
        "japanese": "五分",
        "reading": "ごふん",
        "meaning": "5 phút",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NGŨ PHÂN\n• Ý nghĩa: 5 phút\n\n• Phân tích & Cấu thành chữ Hán:\n• 五 (NGŨ): Số 5.\n• 分 (PHÂN): Phút (âm ふん / ぷん).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nQuy tắc đếm phút N5: Số 5 đọc là ごふん (gofun - đuôi fun, không biến âm thành pun).",
        "examples": [
            {
                "id": "ex-n5-37-1",
                "japanese": "五分待ってください、すぐ準備します。",
                "reading": "Gofun matte kudasai, sugu junbi shimasu.",
                "vietnamese": "Xin đợi 5 phút, tôi sẽ chuẩn bị ngay lập tức."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-38-deru",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "出る (でる) - XUẤT: Đi ra, rời khỏi, xuất hiện",
        "japanese": "出る",
        "reading": "でる",
        "meaning": "Đi ra, rời khỏi, xuất hiện",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: XUẤT\n• Ý nghĩa: Đi ra, rời khỏi, xuất hiện\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Xuất 出 vẽ hình ngọn cây non nhô lên trên mặt đất.\n• Tự động từ (đi ra khỏi một nơi nào đó).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTự động từ: 部屋を出る (bước ra khỏi phòng - dùng trợ từ を cho địa điểm rời khỏi). Động từ nhóm 2.",
        "examples": [
            {
                "id": "ex-n5-38-1",
                "japanese": "毎朝七時にうちを出て、会社へ向かいます。",
                "reading": "Maiasa shichiji ni uchi o dete, kaisha e mukaimasu.",
                "vietnamese": "Mỗi sáng tôi rời khỏi nhà lúc 7 giờ để đi đến công ty."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-39-densha",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "電車 (でんしゃ) - ĐIỆN XA (Tài liệu in nhầm ĐIỆN XÃ): Tàu điện, xe điện",
        "japanese": "電車",
        "reading": "でんしゃ",
        "meaning": "Tàu điện, xe điện",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ĐIỆN XA (Tài liệu in nhầm ĐIỆN XÃ)\n• Ý nghĩa: Tàu điện, xe điện\n\n• Phân tích & Cấu thành chữ Hán:\n• 電 (ĐIỆN): Điện năng, tia sét (Vũ 雨 sấm chớp + Thân 申).\n• 車 (XA): Chiếc xe có hai bánh xe và trục ngang.\n→ Chiếc xe chạy bằng năng lượng điện.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm On: でん + しゃ = でんしゃ. Lưu ý trong đề thi chữ Hán chuẩn là 電車 (Điện Xa).",
        "examples": [
            {
                "id": "ex-n5-39-1",
                "japanese": "電車が混んでいるので、一本見送りました。",
                "reading": "Densha ga konde iru node, ippon miokurimashita.",
                "vietnamese": "Vì tàu điện quá đông nên tôi đã để chuyến này đi qua và chờ chuyến sau."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-40-te",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "手 (て) - THỦ: Bàn tay, tay",
        "japanese": "手",
        "reading": "て",
        "meaning": "Bàn tay, tay",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THỦ\n• Ý nghĩa: Bàn tay, tay\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Thủ 手 tượng hình bàn tay xòe ra với 5 ngón tay.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: て. Ghép từ: 上手 (じょうず - giỏi giang), 下手 (へた - kém cỏi), 手紙 (てがみ - bức thư).",
        "examples": [
            {
                "id": "ex-n5-40-1",
                "japanese": "外から帰ったら、石鹸で手を洗いましょう。",
                "reading": "Soto kara kaettara, sekken de te o araimashou.",
                "vietnamese": "Khi đi từ ngoài về, chúng ta hãy rửa tay bằng xà phòng nhé."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-41-kayoubi",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "火曜日 (かようび) - HỎA DIỆU NHẬT: Thứ 3",
        "japanese": "火曜日",
        "reading": "かようび",
        "meaning": "Thứ 3",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HỎA DIỆU NHẬT\n• Ý nghĩa: Thứ 3\n\n• Phân tích & Cấu thành chữ Hán:\n• 火 (HỎA): Lửa bùng cháy.\n• 曜日 (DIỆU NHẬT): Ngày trong tuần.\n→ Ngày ứng với sao Hỏa (Thứ Ba).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nCác ngày trong tuần N5: 月 (2), 火 (3), 水 (4), 木 (5), 金 (6), 土 (7), 日 (CN).",
        "examples": [
            {
                "id": "ex-n5-41-1",
                "japanese": "火曜日の午後に日本語のクラスがあります。",
                "reading": "Kayoubi no gogo ni Nihongo no kurasu ga arimasu.",
                "vietnamese": "Vào chiều thứ ba tôi có lớp học tiếng Nhật."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-42-yasui",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "安い (やすい) - AN: Rẻ (giá cả), an tâm",
        "japanese": "安い",
        "reading": "やすい",
        "meaning": "Rẻ (giá cả), an tâm",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: AN\n• Ý nghĩa: Rẻ (giá cả), an tâm\n\n• Phân tích & Cấu thành chữ Hán:\n• Bộ Miên 宀 (mái nhà che chở) + Nữ 女 (người phụ nữ). Phụ nữ yên bình dưới mái ấm gia đình -> An toàn, bình yên, giá cả nhẹ nhàng, rẻ.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTính từ đuôi い. Trái nghĩa với 高い (たかい - đắt). Ghép từ: 安心 (あんしん - an tâm).",
        "examples": [
            {
                "id": "ex-n5-42-1",
                "japanese": "この店の服は安くて質もいいです。",
                "reading": "Kono mise no fuku wa yasukute shitsu mo ii desu.",
                "vietnamese": "Quần áo của cửa hàng này vừa rẻ mà chất lượng lại tốt."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-43-ame",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "雨 (あめ) - VŨ: Mưa, cơn mưa",
        "japanese": "雨",
        "reading": "あめ",
        "meaning": "Mưa, cơn mưa",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: VŨ\n• Ý nghĩa: Mưa, cơn mưa\n\n• Phân tích & Cấu thành chữ Hán:\n• Nét ngang trên chỉ vòm trời, khung chữ bao lấy đám mây, 4 chấm nhỏ bên trong tượng hình những giọt mưa tuôn rơi.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nMưa rơi dùng cụm 雨が降る (あめがふる). Phân biệt với 飴 (あめ - kẹo ngọt, khác dấu nhấn âm điệu).",
        "examples": [
            {
                "id": "ex-n5-43-1",
                "japanese": "雨が降っていますから、傘を持って行きましょう。",
                "reading": "Ame ga futte imasu kara, kasa o motte ikimashou.",
                "vietnamese": "Trời đang mưa đấy nên chúng ta hãy mang ô theo nhé."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-44-chiisai",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "小さい (ちいさい) - TIỂU: Nhỏ, bé",
        "japanese": "小さい",
        "reading": "ちいさい",
        "meaning": "Nhỏ, bé",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TIỂU\n• Ý nghĩa: Nhỏ, bé\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Tiểu 小 tượng hình chia một vật ra thành các mảnh nhỏ bé li ti.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTính từ đuôi い: 小さい (chiisai). Trái nghĩa với 大きい (ookii - to lớn).",
        "examples": [
            {
                "id": "ex-n5-44-1",
                "japanese": "この靴は私には少し小さいです。",
                "reading": "Kono kutsu wa watashi ni wa sukoshi chiisai desu.",
                "vietnamese": "Đôi giày này hơi nhỏ so với chân tôi một chút."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-45-sakana",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "魚 (さかな) - NGƯ: Con cá",
        "japanese": "魚",
        "reading": "さかな",
        "meaning": "Con cá",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NGƯ\n• Ý nghĩa: Con cá\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Ngư 魚 tượng hình phần đầu cá 𠂊, thân cá có vảy xếp lớp 田, và 4 chấm đuôi cá quẫy sóng nước 灬.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: さかな. Âm On: ギョ (trong 金魚 きんぎょ - cá vàng, 人魚 にんぎょ - người cá).",
        "examples": [
            {
                "id": "ex-n5-45-1",
                "japanese": "市場で新鮮な魚を買って料理しました。",
                "reading": "Ichiba de shinsen na sakana o katte ryouri shimashita.",
                "vietnamese": "Tôi đã mua cá tươi ở chợ và nấu ăn."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-46-hanbun",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "半分 (はんぶん) - BÁN PHÂN: Một nửa",
        "japanese": "半分",
        "reading": "はんぶん",
        "meaning": "Một nửa",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: BÁN PHÂN\n• Ý nghĩa: Một nửa\n\n• Phân tích & Cấu thành chữ Hán:\n• 半 (BÁN): Một nửa (hình con bò bị chia đôi).\n• 分 (PHÂN): Phần, phân chia (bộ Bát 八 phân tách bằng dao 刀).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nThường dùng chỉ lượng: 半分食べる (ăn một nửa), 半分あげる (cho một nửa).",
        "examples": [
            {
                "id": "ex-n5-46-1",
                "japanese": "ケーキを半分ずつ分けて食べましょう。",
                "reading": "Keeki o hanbun zutsu wakete tabemashou.",
                "vietnamese": "Chúng ta hãy chia đôi chiếc bánh kem ra rồi cùng ăn nhé."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-47-aida",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "間 (あいだ) - GIAN: Ở giữa, khoảng cách, thời gian",
        "japanese": "間",
        "reading": "あいだ",
        "meaning": "Ở giữa, khoảng cách, thời gian",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: GIAN\n• Ý nghĩa: Ở giữa, khoảng cách, thời gian\n\n• Phân tích & Cấu thành chữ Hán:\n• Bộ Môn 門 (hai cánh cửa) hé mở cho ánh nắng mặt trời 日 lọt qua khe giữa -> GIAN (khoảng trống ở giữa).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nMẫu câu N5: AとBの間 (ở giữa A và B). Âm On: カン (trong 時間 jikan: thời gian, 一週間 isshuukan: một tuần).",
        "examples": [
            {
                "id": "ex-n5-47-1",
                "japanese": "本屋と銀行の間に郵便局があります。",
                "reading": "Hon'ya to ginkou no aida ni yuubinkyoku ga arimasu.",
                "vietnamese": "Ở giữa hiệu sách và ngân hàng có một bưu điện."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-48-mittsu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "三つ (みっつ) - TAM: Ba cái (lượng từ đếm đồ vật thuần Nhật)",
        "japanese": "三つ",
        "reading": "みっつ",
        "meaning": "Ba cái (lượng từ đếm đồ vật thuần Nhật)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TAM\n• Ý nghĩa: Ba cái (lượng từ đếm đồ vật thuần Nhật)\n\n• Phân tích & Cấu thành chữ Hán:\n• 三 (TAM): Ba vạch ngang tượng trưng số 3.\n• つ: Hậu tố đếm đồ vật thuần Nhật (ひとつ、ふたつ、みっつ...).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nSố đếm đồ vật N5 có âm ngắt: みっつ (mittsu), rất hay gặp trong bài thi nghe và chọn lượng từ.",
        "examples": [
            {
                "id": "ex-n5-48-1",
                "japanese": "りんごを三つください。",
                "reading": "Ringo o mittsu kudasai.",
                "vietnamese": "Làm ơn cho tôi 3 quả táo."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-49-tenki-2",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "天気 (てんき) - THIÊN KHÍ: Thời tiết (Lưu ý trong đề thi JLPT N5)",
        "japanese": "天気",
        "reading": "てんき",
        "meaning": "Thời tiết (Lưu ý trong đề thi JLPT N5)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THIÊN KHÍ\n• Ý nghĩa: Thời tiết (Lưu ý trong đề thi JLPT N5)\n\n• Phân tích & Cấu thành chữ Hán:\n• 天 (THIÊN): Bầu trời, ông trời.\n• 気 (KHÍ): Khí hậu, không khí.\n→ Hiện tượng thời tiết.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTừ này xuất hiện 2 lần trong bảng đề cương N5 vì đây là câu hỏi kinh điển về nhận biết chữ Hán của 天 (khác 夫) và 気.",
        "examples": [
            {
                "id": "ex-n5-49-1",
                "japanese": "週末の天気はどうでしょうか。晴れるといいですね。",
                "reading": "Shuumatsu no tenki wa dou deshou ka. Hareru to ii desu ne.",
                "vietnamese": "Thời tiết cuối tuần thế nào nhỉ? Nắng đẹp thì tốt biết mấy."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-50-senshuu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "先週 (せんしゅう) - TIÊN CHU: Tuần trước",
        "japanese": "先週",
        "reading": "せんしゅう",
        "meaning": "Tuần trước",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TIÊN CHU\n• Ý nghĩa: Tuần trước\n\n• Phân tích & Cấu thành chữ Hán:\n• 先 (TIÊN): Trước đây, đi trước.\n• 週 (CHU): Tuần lễ.\n→ Tuần lễ trước tuần này.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nDấu hiệu nhận biết thì quá khứ (chia đuôi ました): 先週、映画を見ました.",
        "examples": [
            {
                "id": "ex-n5-50-1",
                "japanese": "先週の日曜日、家族と京都へ旅行しました。",
                "reading": "Senshuu no nichiyoubi, kazoku to Kyouto e ryokou shimashita.",
                "vietnamese": "Chủ nhật tuần trước, tôi đã đi du lịch Kyoto cùng gia đình."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-51-atode",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "後で (あとで) - HẬU: Sau đó, lát nữa",
        "japanese": "後で",
        "reading": "あとで",
        "meaning": "Sau đó, lát nữa",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HẬU\n• Ý nghĩa: Sau đó, lát nữa\n\n• Phân tích & Cấu thành chữ Hán:\n• Bộ Xích 彳(bước chân) + Yêu 幺 (nhỏ mảnh) + Trĩ 夂 (bước chậm tụt lại đằng sau) -> HẬU (phía sau, sau này).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nNgữ pháp N5: V-た + 後で (Sau khi làm V xong thì...). Ví dụ: ご飯を食べた後で (sau khi ăn cơm xong).",
        "examples": [
            {
                "id": "ex-n5-51-1",
                "japanese": "今忙しいですから、後でお電話します。",
                "reading": "Ima isogashii desu kara, ato de odenwa shimasu.",
                "vietnamese": "Bây giờ tôi đang bận nên lát nữa tôi sẽ gọi lại cho bạn nhé."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-52-iu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "言う (いう) - NGÔN: Nói",
        "japanese": "言う",
        "reading": "いう",
        "meaning": "Nói",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NGÔN\n• Ý nghĩa: Nói\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Ngôn 言 tượng hình chiếc lưỡi vươn ra nói từng lời rành mạch.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐộng từ nhóm 1: 言います (iimasu), 言って (itte), 言わない (iwanai). Mẫu trích dẫn: と言う (nói rằng...).",
        "examples": [
            {
                "id": "ex-n5-52-1",
                "japanese": "田中さんは「明日休む」と言いました。",
                "reading": "Tanaka-san wa \"ashita yasumu\" to iimashita.",
                "vietnamese": "Anh Tanaka đã nói là 'Ngày mai tôi nghỉ'."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-53-yama",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "山 (やま) - SƠN: Núi, ngọn núi",
        "japanese": "山",
        "reading": "やま",
        "meaning": "Núi, ngọn núi",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: SƠN\n• Ý nghĩa: Núi, ngọn núi\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Sơn 山 tượng hình 3 đỉnh núi cao sừng sững trên mặt đất.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: やま. Âm On: サン (trong 富士山 Fujisan - Núi Phú Sĩ). Leo núi là 山に登る.",
        "examples": [
            {
                "id": "ex-n5-53-1",
                "japanese": "秋になると、山が赤や黄色に変わります。",
                "reading": "Aki ni naru to, yama ga aka ya kiiro ni kawarimasu.",
                "vietnamese": "Khi mùa thu đến, núi non chuyển sang sắc đỏ và vàng."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-54-ooi-1",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "多い (おおい) - ĐA: Nhiều",
        "japanese": "多い",
        "reading": "おおい",
        "meaning": "Nhiều",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ĐA\n• Ý nghĩa: Nhiều\n\n• Phân tích & Cấu thành chữ Hán:\n• Hai chữ Tịch 夕 (đêm tối) xếp chồng lên nhau. Đêm này qua đêm khác trôi qua -> Rất nhiều, đa số.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐIỂM NGỮ PHÁP QUAN TRỌNG: Thường làm vị ngữ 'N が多い' (vd: 人が多い). Không nói '多い人' mà nói '多くの人'.",
        "examples": [
            {
                "id": "ex-n5-54-1",
                "japanese": "東京には高いビルが多いです。",
                "reading": "Toukyou ni wa takai biru ga ooi desu.",
                "vietnamese": "Ở Tokyo có rất nhiều tòa nhà cao tầng."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-55-gakkou",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "学校 (がっこう) - HỌC HIỆU: Trường học",
        "japanese": "学校",
        "reading": "がっこう",
        "meaning": "Trường học",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HỌC HIỆU\n• Ý nghĩa: Trường học\n\n• Phân tích & Cấu thành chữ Hán:\n• 学 (HỌC): Học hành, tri thức.\n• 校 (HIỆU): Trường sở, nơi giao thoa kiến thức (Mộc 木 + Giao 交).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm ngắt: がく + こう → がっこう (gakkou).",
        "examples": [
            {
                "id": "ex-n5-55-1",
                "japanese": "毎朝八時半に学校へ着きます。",
                "reading": "Maiasa hachijihan ni gakkou e tsukimasu.",
                "vietnamese": "Mỗi sáng tôi đều đến trường học vào lúc 8 giờ rưỡi."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-56-roppon",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "六本 (ろっぽん) - LỤC BẢN: 6 cái, 6 cây (lượng từ đếm vật thon dài)",
        "japanese": "六本",
        "reading": "ろっぽん",
        "meaning": "6 cái, 6 cây (lượng từ đếm vật thon dài)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: LỤC BẢN\n• Ý nghĩa: 6 cái, 6 cây (lượng từ đếm vật thon dài)\n\n• Phân tích & Cấu thành chữ Hán:\n• 六 (LỤC): Số 6.\n• 本 (BẢN): Đơn vị đếm các vật thon dài như bút, chai nước, cây dù, cái cây.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nBIẾN ÂM N5 CỰC KỲ QUAN TRỌNG: ろく + ほん → ろっぽん (Roppon có âm ngắt và biến âm P). Tương tự: 1本 いっぽん, 3本 さんぼん, 6本 ろっぽん, 8本 はっぽん, 10本 じゅっぽん.",
        "examples": [
            {
                "id": "ex-n5-56-1",
                "japanese": "ビールを六本買ってきました。",
                "reading": "Biiru o roppon katte kimashita.",
                "vietnamese": "Tôi đã đi mua về 6 chai bia."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-57-shinbun",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "新聞 (しんぶん) - TÂN VĂN: Báo chí, tờ báo",
        "japanese": "新聞",
        "reading": "しんぶん",
        "meaning": "Báo chí, tờ báo",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TÂN VĂN\n• Ý nghĩa: Báo chí, tờ báo\n\n• Phân tích & Cấu thành chữ Hán:\n• 新 (TÂN): Mới (Lập + Mộc + Cân 斤 chiếc rìu đẵn cây mới).\n• 聞 (VĂN): Nghe ngóng tin tức.\n→ Nghe ngóng những tin tức mới mẻ nhất mỗi ngày -> Tờ báo.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm On: しん + ぶん = しんぶん. Người phát báo: 新聞配達 (しんぶんはいたつ).",
        "examples": [
            {
                "id": "ex-n5-57-1",
                "japanese": "父は毎朝コーヒーを飲みながら新聞を読みます。",
                "reading": "Chichi wa maiasa koohii o nominagara shinbun o yomimasu.",
                "vietnamese": "Bố tôi mỗi sáng vừa uống cà phê vừa đọc báo."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-58-soto",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "外 (そと) - NGOẠI: Bên ngoài, ngoài trời",
        "japanese": "外",
        "reading": "そと",
        "meaning": "Bên ngoài, ngoài trời",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NGOẠI\n• Ý nghĩa: Bên ngoài, ngoài trời\n\n• Phân tích & Cấu thành chữ Hán:\n• Tịch 夕 (chiều tà) + Bặc 卜 (quẻ bói). Xem quẻ bói lúc chiều tà bên ngoài sân -> NGOẠI (bên ngoài).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: そと (bên ngoài). Âm On: ガイ (trong 外国 gaikoku: nước ngoài). Trái nghĩa với 中 (なか - bên trong).",
        "examples": [
            {
                "id": "ex-n5-58-1",
                "japanese": "外はとても寒いですから、コートを着てください。",
                "reading": "Soto wa totemo samui desu kara, kooto o kite kudasai.",
                "vietnamese": "Ngoài trời lạnh lắm nên bạn hãy mặc áo khoác vào nhé."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-59-ue",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "上 (うえ) - THƯỢNG: Bên trên, phía trên",
        "japanese": "上",
        "reading": "うえ",
        "meaning": "Bên trên, phía trên",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THƯỢNG\n• Ý nghĩa: Bên trên, phía trên\n\n• Phân tích & Cấu thành chữ Hán:\n• Nét ngang làm chuẩn mặt đất, nét đứng và nét ngang ngắn chỉ phía bên trên mốc chuẩn.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: うえ. Trái nghĩa: 下 (した - bên dưới). Ghép từ: 上手 (じょうず - giỏi giang).",
        "examples": [
            {
                "id": "ex-n5-59-1",
                "japanese": "机の上に日本語の教科書が置いてあります。",
                "reading": "Tsukue no ue ni Nihongo no kyoukasho ga oite arimasu.",
                "vietnamese": "Trên bàn có đặt sẵn cuốn sách giáo khoa tiếng Nhật."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-60-me",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "目 (め) - MỤC: Mắt, đôi mắt",
        "japanese": "目",
        "reading": "め",
        "meaning": "Mắt, đôi mắt",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: MỤC\n• Ý nghĩa: Mắt, đôi mắt\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Mục 目 tượng hình hốc mắt và con ngươi mắt người được dựng đứng lên.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: め. Thường gặp: 目が痛い (đau mắt), 目薬 (thuốc nhỏ mắt), 一つ目 (thứ nhất).",
        "examples": [
            {
                "id": "ex-n5-60-1",
                "japanese": "テレビを近くで見ると、目が悪くなりますよ。",
                "reading": "Terebi o chikaku de miru to, me ga waruku narimasu yo.",
                "vietnamese": "Nếu nhìn tivi ở cự ly gần thì mắt sẽ bị kém đi đấy nhé."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-61-chichi",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "父 (ちち) - PHỤ: Bố (của tôi)",
        "japanese": "父",
        "reading": "ちち",
        "meaning": "Bố (của tôi)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: PHỤ\n• Ý nghĩa: Bố (của tôi)\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Phụ 父 tượng hình bàn tay nắm ngọn roi chỉ dạy, người cha gánh vác gia đình.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nCách xưng hô gia đình N5: Nói về bố mình dùng 父 (ちち), nói về bố người khác dùng お父さん (おとうさん).",
        "examples": [
            {
                "id": "ex-n5-61-1",
                "japanese": "父は今年五十五歳になります。",
                "reading": "Chichi wa kotoshi gojuugosai ni narimasu.",
                "vietnamese": "Bố tôi năm nay bước sang tuổi 55."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-62-onnanoko",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "女の子 (おんなのこ) - NỮ TỬ (Tài liệu in lỗi ĐÔNG): Bé gái, người con gái",
        "japanese": "女の子",
        "reading": "おんなのこ",
        "meaning": "Bé gái, người con gái",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NỮ TỬ (Tài liệu in lỗi ĐÔNG)\n• Ý nghĩa: Bé gái, người con gái\n\n• Phân tích & Cấu thành chữ Hán:\n• 女 (NỮ): Phụ nữ, con gái.\n• の: Trợ từ sở hữu / liên kết.\n• 子 (TỬ): Đứa trẻ con.\n→ Đứa trẻ mang giới tính nữ = Bé gái.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nHán Việt chuẩn là NỮ TỬ. Tài liệu gốc có lỗi in ấn ghi chữ ĐÔNG. Phân biệt với 男の子 (おとこのこ - bé trai).",
        "examples": [
            {
                "id": "ex-n5-62-1",
                "japanese": "公園で小さな女の子が人形と遊んでいます。",
                "reading": "Kouen de chiisana onnanoko ga ningyou to asonde imasu.",
                "vietnamese": "Ở công viên có một bé gái nhỏ đang chơi với búp bê."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-63-nannin",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "何人 (なんにん) - HÀ NHÂN: Mấy người, bao nhiêu người",
        "japanese": "何人",
        "reading": "なんにん",
        "meaning": "Mấy người, bao nhiêu người",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HÀ NHÂN\n• Ý nghĩa: Mấy người, bao nhiêu người\n\n• Phân tích & Cấu thành chữ Hán:\n• 何 (HÀ): Cái gì, bao nhiêu (Nhân 亻 + Khả 可).\n• 人 (NHÂN): Người.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐọc là なんにん khi hỏi số lượng người. Chú ý: nếu mang nghĩa 'người nước nào' đọc là なにじん (vd: 何人ですか = bạn là người nước nào).",
        "examples": [
            {
                "id": "ex-n5-63-1",
                "japanese": "クラスに学生は何人いますか。二十人います。",
                "reading": "Kurasu ni gakusei wa nannin imasu ka. Nijuunin imasu.",
                "vietnamese": "Trong lớp học có bao nhiêu học sinh? - Có 20 người."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-64-happyakuen",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "八百円 (はっぴゃくえん) - BÁT BÁCH VIÊN: 800 yên (Tài liệu in lỗi 100 yên)",
        "japanese": "八百円",
        "reading": "はっぴゃくえん",
        "meaning": "800 yên (Tài liệu in lỗi 100 yên)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: BÁT BÁCH VIÊN\n• Ý nghĩa: 800 yên (Tài liệu in lỗi 100 yên)\n\n• Phân tích & Cấu thành chữ Hán:\n• 八 (BÁT): Số 8.\n• 百 (BÁCH): 100.\n• 円 (VIÊN): Đồng Yên Nhật.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nBIẾN ÂM QUAN TRỌNG: はち + ひゃく → はっぴゃく (Happyaku). Tài liệu gốc in nhầm nghĩa là 100 yên, chuẩn nghĩa là 800 yên.",
        "examples": [
            {
                "id": "ex-n5-64-1",
                "japanese": "このラーメンは一杯八百円です。",
                "reading": "Kono raamen wa ippai happyakuen desu.",
                "vietnamese": "Bát mì ramen này có giá là 800 yên."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-65-doyoubi-2",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "土曜日 (どようび) - THỔ DIỆU NHẬT: Thứ bảy",
        "japanese": "土曜日",
        "reading": "どようび",
        "meaning": "Thứ bảy",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THỔ DIỆU NHẬT\n• Ý nghĩa: Thứ bảy\n\n• Phân tích & Cấu thành chữ Hán:\n• 土 (THỔ): Đất đai (sao Thổ).\n• 曜日 (DIỆU NHẬT): Ngày thứ trong tuần.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nKhác với STT 4 (viết 土ようび), ở đây viết đầy đủ cả chữ Hán 曜日.",
        "examples": [
            {
                "id": "ex-n5-65-1",
                "japanese": "土曜日は仕事が休みなので、家でゆっくり休みます。",
                "reading": "Doyoubi wa shigoto ga yasumi na node, ie de yukkuri yasumimasu.",
                "vietnamese": "Vì thứ bảy được nghỉ làm việc nên tôi thong thả nghỉ ngơi ở nhà."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-66-yoji",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "四時 (よじ) - TỨ THỜI: 4 giờ",
        "japanese": "四時",
        "reading": "よじ",
        "meaning": "4 giờ",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TỨ THỜI\n• Ý nghĩa: 4 giờ\n\n• Phân tích & Cấu thành chữ Hán:\n• 四 (TỨ): Số 4.\n• 時 (THỜI): Giờ giấc (Nhật 日 mặt trời + Tự 寺 chùa chiền gõ chuông báo giờ).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nBẪY KINH ĐIỂN JLPT N5: 4 giờ ĐỘC NHẤT VÔ NHỊ chỉ đọc là よじ (yoji). KHÔNG BAO GIỜ đọc là よんじ hay しじ.",
        "examples": [
            {
                "id": "ex-n5-66-1",
                "japanese": "今日の会議は午後四時に終わります。",
                "reading": "Kyou no kaigi wa gogo yoji ni owarimasu.",
                "vietnamese": "Cuộc họp hôm nay sẽ kết thúc vào lúc 4 giờ chiều."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-67-hidari",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "左 (ひだり) - TẢ: Bên trái, phía trái",
        "japanese": "左",
        "reading": "ひだり",
        "meaning": "Bên trái, phía trái",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TẢ\n• Ý nghĩa: Bên trái, phía trái\n\n• Phân tích & Cấu thành chữ Hán:\n• Nét 𠂇 tượng hình bàn tay trái, bên dưới là chữ Công 工 (cái thước đo). Tay trái cầm thước thợ hồ.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: ひだり. Phân biệt với 右 (みぎ - bên phải, có chữ Khẩu 口 tay phải cầm muỗng đưa vào miệng).",
        "examples": [
            {
                "id": "ex-n5-67-1",
                "japanese": "銀行は郵便局の左側にあります。",
                "reading": "Ginkou wa yuubinkyoku no hidarigawa ni arimasu.",
                "vietnamese": "Ngân hàng nằm ở phía bên trái của bưu điện."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-68-sanbon",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "三本 (さんぼん) - TAM BẢN: 3 cái, 3 cây (lượng từ đếm vật thon dài)",
        "japanese": "三本",
        "reading": "さんぼん",
        "meaning": "3 cái, 3 cây (lượng từ đếm vật thon dài)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TAM BẢN\n• Ý nghĩa: 3 cái, 3 cây (lượng từ đếm vật thon dài)\n\n• Phân tích & Cấu thành chữ Hán:\n• 三 (TAM): Số 3.\n• 本 (BẢN): Đơn vị đếm vật dài.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nBIẾN ÂM ĐẦU B: さん + ほん → さんぼん (Sanbon đuôi bon). Hãy nhớ: 1, 6, 8, 10 đi với ぽん (pon); riêng 3 đi với ぼん (bon); các số khác đi với ほん (hon).",
        "examples": [
            {
                "id": "ex-n5-68-1",
                "japanese": "机の上にペンが三本あります。",
                "reading": "Tsukue no ue ni pen ga sanbon arimasu.",
                "vietnamese": "Trên bàn có 3 cây bút."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-69-sengetsu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "先月 (せんげつ) - TIÊN NGUYỆT: Tháng trước",
        "japanese": "先月",
        "reading": "せんげつ",
        "meaning": "Tháng trước",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TIÊN NGUYỆT\n• Ý nghĩa: Tháng trước\n\n• Phân tích & Cấu thành chữ Hán:\n• 先 (TIÊN): Trước đây.\n• 月 (NGUYỆT): Tháng.\n→ Tháng vừa qua.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTrục thời gian tháng: 先月 (sengetsu - tháng trước) → 今月 (kongetsu - tháng này) → 来月 (raigetsu - tháng sau).",
        "examples": [
            {
                "id": "ex-n5-69-1",
                "japanese": "先月、ベトナムの両親から荷物が届きました。",
                "reading": "Sengetsu, Betonamu no ryoushin kara nimotsu ga todokimashita.",
                "vietnamese": "Tháng trước, kiện hàng từ bố mẹ ở Việt Nam đã gửi tới chỗ tôi."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-70-kokonotsu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "九つ (ここのつ) - CỬU: 9 cái (lượng từ đếm đồ vật thuần Nhật)",
        "japanese": "九つ",
        "reading": "ここのつ",
        "meaning": "9 cái (lượng từ đếm đồ vật thuần Nhật)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: CỬU\n• Ý nghĩa: 9 cái (lượng từ đếm đồ vật thuần Nhật)\n\n• Phân tích & Cấu thành chữ Hán:\n• 九 (CỬU): Số 9.\n• つ: Đuôi đếm đồ vật chung.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nChuỗi số đếm đồ vật N5: ひとつ (1), ふたつ (2), みっつ (3), よっつ (4), いつつ (5), むっつ (6), ななつ (7), やっつ (8), ここのつ (9), とお (10). Chú ý 9 cái đọc là こ obscure ここのつ.",
        "examples": [
            {
                "id": "ex-n5-70-1",
                "japanese": "みかんが九つ入った袋を買いました。",
                "reading": "Mikan ga kokonotsu haitta fukuro o kaimashita.",
                "vietnamese": "Tôi đã mua một túi có chứa 9 quả quýt."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-71-okane",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "お金 (おかね) - KIM: Tiền, tiền bạc",
        "japanese": "お金",
        "reading": "おかね",
        "meaning": "Tiền, tiền bạc",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: KIM\n• Ý nghĩa: Tiền, tiền bạc\n\n• Phân tích & Cấu thành chữ Hán:\n• お (tiền tố lịch sự) + 金 (KIM - vàng bạc, kim loại quý).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: かね (trong お金 okane). Âm On: キン (trong 金曜日 kin'youbi - thứ sáu, 金きん - vàng).",
        "examples": [
            {
                "id": "ex-n5-71-1",
                "japanese": "財布の中にお金があまり入っていません。",
                "reading": "Saifu no naka ni okane ga amari haitte imasen.",
                "vietnamese": "Trong ví tôi không có mấy tiền."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-72-nomu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "飲む (のむ) - ẨM: Uống",
        "japanese": "飲む",
        "reading": "のむ",
        "meaning": "Uống",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ẨM\n• Ý nghĩa: Uống\n\n• Phân tích & Cấu thành chữ Hán:\n• Khẩu 口 (miệng) + Thực 食 (ăn uống) + Khiếm 欠 (há miệng). Há to miệng nuốt nước uống vào lòng -> ẨM (Uống).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐộng từ nhóm 1: 飲みます (nomimasu), 飲んで (nonde), 飲まない (nomanai). Chú ý thuốc uống tiếng Nhật cũng dùng 薬を飲む.",
        "examples": [
            {
                "id": "ex-n5-72-1",
                "japanese": "毎朝起きてすぐにコップ一杯の水を飲みます。",
                "reading": "Maiasa okite sugu ni koppu ippai no mizu o nomimasu.",
                "vietnamese": "Mỗi sáng thức dậy tôi đều uống ngay một cốc nước đầy."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-73-takai",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "高い (たかい) - CAO: Cao (chiều cao), đắt (giá cả)",
        "japanese": "高い",
        "reading": "たかい",
        "meaning": "Cao (chiều cao), đắt (giá cả)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: CAO\n• Ý nghĩa: Cao (chiều cao), đắt (giá cả)\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Cao 高 tượng hình tòa lầu các cao tầng có chóp mái nhọn vươn lên bầu trời.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTính từ đuôi い mang 2 nghĩa then chốt: 背が高い (dáng người cao), 値段が高い (giá cả đắt đỏ). Trái nghĩa chiều cao là 低い (hikui - thấp), trái nghĩa giá cả là 安い (yasui - rẻ).",
        "examples": [
            {
                "id": "ex-n5-73-1",
                "japanese": "このカメラは性能がいいですが、値段がとても高いです。",
                "reading": "Kono kamera wa seinou ga ii desu ga, nedan ga totemo takai desu.",
                "vietnamese": "Chiếc máy ảnh này tính năng rất tốt nhưng giá thì vô cùng đắt."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-74-umareru",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "生まれる (うまれる) - SINH: Sinh ra, chào đời",
        "japanese": "生まれる",
        "reading": "うまれる",
        "meaning": "Sinh ra, chào đời",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: SINH\n• Ý nghĩa: Sinh ra, chào đời\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Sinh 生 tượng hình mầm cây non nhô lên trên mặt đất, biểu tượng cho mầm sống ra đời.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTự động từ nhóm 2: 生まれます, 生まれて. Nơi sinh dùng trợ từ で: ハノイで生まれた.",
        "examples": [
            {
                "id": "ex-n5-74-1",
                "japanese": "妹は2010年に東京で生まれました。",
                "reading": "Imouto wa nisenjuunen ni Toukyou de umaremashita.",
                "vietnamese": "Em gái tôi được sinh ra tại Tokyo vào năm 2010."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-75-ooi-2",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "多い (おおい) - ĐA: Nhiều (chú ý cách dùng trong câu)",
        "japanese": "多い",
        "reading": "おおい",
        "meaning": "Nhiều (chú ý cách dùng trong câu)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ĐA\n• Ý nghĩa: Nhiều (chú ý cách dùng trong câu)\n\n• Phân tích & Cấu thành chữ Hán:\n• Hai chữ Tịch 夕 (đêm tối) chồng lên nhau -> số lượng nhiều.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nMẫu câu so sánh hay gặp: AはBより〜が多い (A có nhiều ~ hơn B).",
        "examples": [
            {
                "id": "ex-n5-75-1",
                "japanese": "今年は去年より雨の日が多いです。",
                "reading": "Kotoshi wa kyonen yori ame no hi ga ooi desu.",
                "vietnamese": "Năm nay số ngày mưa nhiều hơn so với năm ngoái."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-76-kuruma",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "車 (くるま) - XA: Xe ô tô, xe cộ",
        "japanese": "車",
        "reading": "くるま",
        "meaning": "Xe ô tô, xe cộ",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: XA\n• Ý nghĩa: Xe ô tô, xe cộ\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Xa 車 nhìn từ trên cao mô phỏng chiếc xe có trục xe ở giữa và hai bánh xe hai bên.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: くるま. Âm On: シャ (trong 電車 densha - tàu điện, 自転車 jitensha - xe đạp). Lái xe: 車を運転する.",
        "examples": [
            {
                "id": "ex-n5-76-1",
                "japanese": "父は週末に自分の車をきれいに洗います。",
                "reading": "Chichi wa shuumatsu ni jibun no kuruma o kirei ni araimasu.",
                "vietnamese": "Bố tôi vào cuối tuần thường rửa chiếc xe ô tô của mình thật sạch sẽ."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "card-n5-kanji-77-au",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "会う (あう) - HỘI: Gặp, gặp gỡ",
        "japanese": "会う",
        "reading": "あう",
        "meaning": "Gặp, gặp gỡ",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: HỘI\n• Ý nghĩa: Gặp, gặp gỡ\n\n• Phân tích & Cấu thành chữ Hán:\n• Mái nhà che phía trên, các nét hợp lại bên dưới -> nhiều người tụ hội gặp nhau.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐộng từ nhóm 1: 会います, 会って, 会わない. Gặp ai đó dùng trợ từ に: 友達に会う (gặp bạn bè).",
        "examples": [
            {
                "id": "ex-n5-77-1",
                "japanese": "明日、駅の改札口で友達に会う予定です。",
                "reading": "Ashita, eki no kaisatsuguchi de tomodachi ni au yotei desu.",
                "vietnamese": "Ngày mai tôi có dự định sẽ gặp bạn ở cổng soát vé nhà ga."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-78-onaji",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "同じ (おなじ) - ĐỒNG: Giống nhau, cùng một",
        "japanese": "同じ",
        "reading": "おなじ",
        "meaning": "Giống nhau, cùng một",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ĐỒNG\n• Ý nghĩa: Giống nhau, cùng một\n\n• Phân tích & Cấu thành chữ Hán:\n• Khung chữ Huynh 冂 bao quanh chữ Nhất 一 và Khẩu 口. Mọi người đều chung một tiếng nói -> Giống nhau, đồng lòng.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐIỂM ĐẶC BIỆT: Là từ loại tính từ đặc biệt bổ nghĩa trực tiếp cho danh từ mà không cần な (vd: 同じクラス - cùng lớp, không nói 同じなくらす).",
        "examples": [
            {
                "id": "ex-n5-78-1",
                "japanese": "私とルームメイトは同じ会社で働いています。",
                "reading": "Watashi to ruumumeito wa onaji kaisha de hataraite imasu.",
                "vietnamese": "Tôi và bạn cùng phòng đang làm việc tại cùng một công ty."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-79-osaki",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "お先 (おさき) - TIÊN: Trước (trong câu chào xin phép đi trước)",
        "japanese": "お先",
        "reading": "おさき",
        "meaning": "Trước (trong câu chào xin phép đi trước)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TIÊN\n• Ý nghĩa: Trước (trong câu chào xin phép đi trước)\n\n• Phân tích & Cấu thành chữ Hán:\n• お (kính ngữ) + 先 (TIÊN - đi trước, trước đây).\n→ Hành động đi trước hoặc về trước.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nCÂU CHÀO CÔNG SỞ N5 KINH ĐIỂN: お先に失礼します (Osaki ni shitsurei shimasu - Tôi xin phép về trước ạ).",
        "examples": [
            {
                "id": "ex-n5-79-1",
                "japanese": "お先に失礼します。明日もよろしくお願いします。",
                "reading": "Osaki ni shitsurei shimasu. Ashita mo yoroshiku onegai shimasu.",
                "vietnamese": "Tôi xin phép về trước ạ. Ngày mai lại nhờ mọi người giúp đỡ."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-80-juubun",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "十分 (じゅうぶん) - THẬP PHÂN: Đầy đủ, trọn vẹn (hoặc 10 phút)",
        "japanese": "十分",
        "reading": "じゅうぶん",
        "meaning": "Đầy đủ, trọn vẹn (hoặc 10 phút)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THẬP PHÂN\n• Ý nghĩa: Đầy đủ, trọn vẹn (hoặc 10 phút)\n\n• Phân tích & Cấu thành chữ Hán:\n• 十 (THẬP): Mười phần viên mãn.\n• 分 (PHÂN): Phần, tỷ lệ.\n→ Mười phần trọn vẹn không thiếu sót -> Đầy đủ.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nĐọc là じゅうぶん mang nghĩa 'đầy đủ'. Nếu chỉ thời gian '10 phút' thì phát âm là じゅっぷん (juppun / jippun).",
        "examples": [
            {
                "id": "ex-n5-80-1",
                "japanese": "試験の時間は十分にありますから、落ち着いて解いてください。",
                "reading": "Shiken no jikan wa juubun ni arimasu kara, ochitsuite toite kudasai.",
                "vietnamese": "Thời gian làm bài thi còn rất đầy đủ nên xin hãy bình tĩnh làm bài."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-81-higashi",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "東 (ひがし) - ĐÔNG: Phía đông, hướng đông",
        "japanese": "東",
        "reading": "ひがし",
        "meaning": "Phía đông, hướng đông",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ĐÔNG\n• Ý nghĩa: Phía đông, hướng đông\n\n• Phân tích & Cấu thành chữ Hán:\n• Mặt trời Nhật 日 mọc lên từ chân trời xuyên qua lùm cây Mộc 木 ở đằng đông -> Phương Đông.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: ひがし. Âm On: トウ (trong 東京 Toukyou - Đông Kinh). Phía đông: 東側 (ひがしがわ).",
        "examples": [
            {
                "id": "ex-n5-81-1",
                "japanese": "毎朝、太陽が東の空から昇ってきます。",
                "reading": "Maiasa, taiyou ga higashi no sora kara nobotte kimasu.",
                "vietnamese": "Mỗi buổi sáng, mặt trời đều mọc lên từ bầu trời phía đông."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-82-nagai",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "長い (ながい) - TRƯỜNG: Dài (khoảng cách, độ dài thời gian)",
        "japanese": "長い",
        "reading": "ながい",
        "meaning": "Dài (khoảng cách, độ dài thời gian)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TRƯỜNG\n• Ý nghĩa: Dài (khoảng cách, độ dài thời gian)\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Trường 長 tượng hình người già tóc dài chống gậy -> dài lâu, trưởng bối.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nTính từ đuôi い: 長い (nagai). Trái nghĩa là 短い (みじかい - ngắn). Âm On: チョウ (trong 社長 shachou - giám đốc).",
        "examples": [
            {
                "id": "ex-n5-82-1",
                "japanese": "夏休みは一か月くらいあって、とても長いです。",
                "reading": "Natsuyasumi wa ikkagetsu kurai atte, totemo nagai desu.",
                "vietnamese": "Kỳ nghỉ hè kéo dài khoảng một tháng, rất là dài."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-83-gogo",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "午後 (ごご) - NGỌ HẬU: Buổi chiều (sau 12h trưa / P.M.)",
        "japanese": "午後",
        "reading": "ごご",
        "meaning": "Buổi chiều (sau 12h trưa / P.M.)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NGỌ HẬU\n• Ý nghĩa: Buổi chiều (sau 12h trưa / P.M.)\n\n• Phân tích & Cấu thành chữ Hán:\n• 午 (NGỌ): Giữa trưa (12 giờ trưa).\n• 後 (HẬU): Phía sau.\n→ Thời gian sau 12 giờ trưa = Buổi chiều.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nCặp từ thời gian N5: 午前 (ごぜん - A.M. buổi sáng) và 午後 (ごご - P.M. buổi chiều).",
        "examples": [
            {
                "id": "ex-n5-83-1",
                "japanese": "午後三時に友達とお茶を飲む約束があります。",
                "reading": "Gogo sanji ni tomodachi to ocha o nomu yakusoku ga arimasu.",
                "vietnamese": "Lúc 3 giờ chiều tôi có hẹn uống trà với bạn bè."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-84-gozen",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "午前 (ごぜん) - NGỌ TIỀN: Buổi sáng (trước 12h trưa / A.M.)",
        "japanese": "午前",
        "reading": "ごぜん",
        "meaning": "Buổi sáng (trước 12h trưa / A.M.)",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NGỌ TIỀN\n• Ý nghĩa: Buổi sáng (trước 12h trưa / A.M.)\n\n• Phân tích & Cấu thành chữ Hán:\n• 午 (NGỌ): Giữa trưa (12 giờ trưa).\n• 前 (TIỀN): Phía trước, trước đây.\n→ Thời gian trước 12 giờ trưa = Buổi sáng.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nVí dụ ghép giờ: 午前九時 (9h sáng), 午前中 (ごぜんちゅう - trong suốt buổi sáng).",
        "examples": [
            {
                "id": "ex-n5-84-1",
                "japanese": "明日の午前中に郵便物が届く予定です。",
                "reading": "Ashita no gozenchuu ni yuubinbutsu ga todoku yotei desu.",
                "vietnamese": "Dự kiến bưu phẩm sẽ được giao tới trong buổi sáng ngày mai."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-85-mimi",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "耳 (みみ) - NHĨ: Tai, đôi tai",
        "japanese": "耳",
        "reading": "みみ",
        "meaning": "Tai, đôi tai",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: NHĨ\n• Ý nghĩa: Tai, đôi tai\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Nhĩ 耳 tượng hình vành tai con người với các đường sụn uốn lượn để đón nhận âm thanh.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nÂm Kun: みみ. Thành ngữ / cụm từ: 耳が痛い (nghe rát tai / trúng tim đen), 耳を澄ます (lắng tai nghe).",
        "examples": [
            {
                "id": "ex-n5-85-1",
                "japanese": "音楽の音量が大きすぎて、耳が痛くなりました。",
                "reading": "Ongaku no onryou ga ookisugite, mimi ga itaku narimashita.",
                "vietnamese": "Âm lượng bài nhạc to quá khiến tai tôi bị đau."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-86-yuushoku",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "夕食 (ゆうしょく) - TỊCH THỰC (Tài liệu in nhầm TỊCH PHƯƠNG): Cơm tối, bữa ăn tối",
        "japanese": "夕食",
        "reading": "ゆうしょく",
        "meaning": "Cơm tối, bữa ăn tối",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: TỊCH THỰC (Tài liệu in nhầm TỊCH PHƯƠNG)\n• Ý nghĩa: Cơm tối, bữa ăn tối\n\n• Phân tích & Cấu thành chữ Hán:\n• 夕 (TỊCH): Buổi chiều tà, hoàng hôn.\n• 食 (THỰC): Ăn uống, bữa ăn.\n→ Bữa ăn khi hoàng hôn buông xuống = Cơm tối.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nHán Việt chuẩn là TỊCH THỰC. Tài liệu gốc in nhầm TỊCH PHƯƠNG. Đồng nghĩa với 晩ご飯 (ばんごはん).",
        "examples": [
            {
                "id": "ex-n5-86-1",
                "japanese": "今夜は家族揃って夕食を食べます。",
                "reading": "Kon'ya wa kazoku sorotte yuushoku o tabemasu.",
                "vietnamese": "Tối nay cả gia đình tôi sẽ sum họp ăn cơm tối cùng nhau."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-87-kiku",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "聞く (きく) - VĂN: Nghe, lắng nghe, hỏi",
        "japanese": "聞く",
        "reading": "きく",
        "meaning": "Nghe, lắng nghe, hỏi",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: VĂN\n• Ý nghĩa: Nghe, lắng nghe, hỏi\n\n• Phân tích & Cấu thành chữ Hán:\n• Chữ Môn 門 (cánh cổng) kẹp chữ Nhĩ 耳 (vành tai). Ghé tai nghe âm thanh ngoài cửa.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nDạng từ điển của 聞きます (STT 30). Động từ nhóm 1: 聞く (kiku), 聞いて (kiite), 聞かない (kikanai).",
        "examples": [
            {
                "id": "ex-n5-87-1",
                "japanese": "毎晩寝る前に好きなクラシック音楽を聞きます。",
                "reading": "Maiban neru mae ni suki na kurashikku ongaku o kikimasu.",
                "vietnamese": "Mỗi tối trước khi ngủ tôi đều nghe bản nhạc cổ điển mình yêu thích."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-88-kau",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "買う (かう) - MÃI: Mua",
        "japanese": "買う",
        "reading": "かう",
        "meaning": "Mua",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: MÃI\n• Ý nghĩa: Mua\n\n• Phân tích & Cấu thành chữ Hán:\n• Võng 罒 (tấm lưới gom lại) + Bối 貝 (vỏ sò - tiền tệ cổ). Dùng tiền gom đồ vật vào lưới -> MÃI (Mua hàng).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nPhân biệt với 賣／売 (MẠI - Bán): Mua là Mãi 買う (kau), Bán là Mại 売る (uru). Đi với trợ từ を.",
        "examples": [
            {
                "id": "ex-n5-88-1",
                "japanese": "帰る途中でコンビニに寄って牛乳を買いました。",
                "reading": "Kaeru tochuu de konbini ni yotte gyuunyuu o kaimashita.",
                "vietnamese": "Trên đường về tôi đã ghé vào cửa hàng tiện lợi mua một hộp sữa bò."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-89-kasu",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "貸す (かす) - THẢI: Cho mượn, cho vay",
        "japanese": "貸す",
        "reading": "かす",
        "meaning": "Cho mượn, cho vay",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: THẢI\n• Ý nghĩa: Cho mượn, cho vay\n\n• Phân tích & Cấu thành chữ Hán:\n• Đại 代 (thay thế, chuyển giao tạm thời) + Bối 貝 (tiền tài, bảo vật). Giao tài sản cho người khác dùng tạm -> THẢI (Cho mượn).\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nPHÂN BIỆT RÕ: 貸す (かす - mình cho người khác mượn) >< 借りる (かりる - mình mượn từ người khác). Mẫu: Aさんにペンを貸す.",
        "examples": [
            {
                "id": "ex-n5-89-1",
                "japanese": "消しゴムを忘れたので、隣の席の人に貸してもらいました。",
                "reading": "Keshigomu o wasureta node, tonari no seki no hito ni kashite moraimashita.",
                "vietnamese": "Vì quên đem theo tẩy nên tôi đã được người bạn bàn bên cho mượn."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now
    },
    {
        "id": "card-n5-kanji-90-daigaku",
        "deckId": "deck-kanji-n5-jlpt",
        "title": "大学 (だいがく) - ĐẠI HỌC: Trường đại học",
        "japanese": "大学",
        "reading": "だいがく",
        "meaning": "Trường đại học",
        "jlpt": "N5",
        "category": "Kanji",
        "description": "• Âm Hán Việt: ĐẠI HỌC\n• Ý nghĩa: Trường đại học\n\n• Phân tích & Cấu thành chữ Hán:\n• 大 (ĐẠI): To lớn, bậc cao, vĩ đại.\n• 学 (HỌC): Học vấn, trường học.\n→ Cơ sở giáo dục đại học bậc cao.\n\n• Trọng tâm thi JLPT N5 & Lưu ý:\nCác cấp trường N5: 小学校 (tiểu học), 中学校 (THCS), 高校 (THPT), 大学 (đại học). Sinh viên: 大学生 (daigakusei).",
        "examples": [
            {
                "id": "ex-n5-90-1",
                "japanese": "高校を卒業したら、日本の大学に進学したいです。",
                "reading": "Koukou o sotsugyou shitara, Nihon no daigaku ni shingaku shitai desu.",
                "vietnamese": "Sau khi tốt nghiệp cấp ba, tôi muốn học lên đại học ở Nhật Bản."
            }
        ],
        "status": "new",
        "reviewCount": 0,
        "createdAt": now,
        "updatedAt": now,
        "imageUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
    }
];

  return {
    decks: DECKS,
    cards: CARDS,
  };
}
