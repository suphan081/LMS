import { Organization, Course, StudentProfile } from './types';

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'TOEIC_CENTER',
    name: 'TOEIC Elite Academy',
    logo: '🎓',
    description: 'Chuyên luyện thi TOEIC Listening, Reading, Speaking & Writing chất lượng cao.',
    themeColor: 'indigo',
  },
  {
    id: 'JLPT_CENTER',
    name: 'JLPT Sakura Center',
    logo: '🌸',
    description: 'Trung tâm đào tạo Nhật ngữ từ N5 đến N1. Đội ngũ giáo viên bản xứ giàu kinh nghiệm.',
    themeColor: 'rose',
  },
];

export const COURSES_BY_ORG: { [key: string]: Course[] } = {
  TOEIC_CENTER: [
    {
      id: 'toeic-listening-master',
      title: 'TOEIC Listening Mastery (Target 750+)',
      thumbnail: '🎧',
      level: 'Intermediate',
      lessonsCount: 3,
      enrollments: 1420,
      lessons: [
        {
          id: 'toeic-l1',
          title: 'Part 1: Photos of People - Action & Posture',
          duration: '12 mins',
          contentType: 'video',
          contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          summary: 'Học cách nhận biết các động từ miêu tả hành động và tư thế của người trong ảnh. Các lỗi bẫy thường gặp về trạng thái tĩnh và động, nhầm lẫn danh từ chỉ đồ vật xung quanh.',
          contentBody: 'In TOEIC Listening Part 1 (Photographs), photos showing people are the most common. To score high, focus on: \n1. Present Continuous tense (e.g., "The man is working at the computer").\n2. Body posture and eye contact verbs (e.g., "gazing", "leaning over", "reaching for").\n3. Prepositions of place (e.g., "next to", "opposite", "underneath").\nWatch out for distractors where the action verb is correct but the object is incorrect, or vice versa.'
        },
        {
          id: 'toeic-l2',
          title: 'Part 2: Question-Response - Information Questions',
          duration: '15 mins',
          contentType: 'pdf',
          contentUrl: 'https://example.com/toeic-part2.pdf',
          summary: 'Phân tích cấu trúc câu hỏi Wh-questions (Who, Where, When, Why, What, How). Chiến thuật bắt từ khóa và nhận diện câu trả lời gián tiếp (Indirect Answers) thường dùng để bẫy điểm cao.',
          contentBody: 'TOEIC Part 2 features 25 question-response pairs. Information questions start with Wh-words: \n- Who: Look for names, job titles, or department names (e.g., "Who approved this?" -> "The board of directors").\n- Where: Look for locations, directions, or "On the desk".\n- When: Look for dates, times, or conditional events (e.g., "When will we start?" -> "As soon as the manager arrives").\nAvoid choosing options that sound like the question words or use repetitive words, as these are usually distractors.'
        },
        {
          id: 'toeic-l3',
          title: 'Part 3: Conversations - Office Scenario & Problems',
          duration: '18 mins',
          contentType: 'video',
          contentUrl: 'https://www.w3schools.com/html/movie.mp4',
          summary: 'Xử lý các đoạn đối thoại ngắn về chủ đề văn phòng (thiết bị hỏng, trễ lịch, đặt phòng). Học cách phân biệt vai trò người nói (Sự cố -> Đề xuất giải pháp -> Bước tiếp theo).',
          contentBody: 'Part 3 contains conversations between two or three people. A typical structure is: \n1. Introduction: Explaining the context or setting (e.g., a broken printer, a delayed flight).\n2. Problem details: Highlighting what is wrong and why it is urgent.\n3. Solution / Next step: Offering an action plan or requesting assistance.\nKeywords to listen for: "but", "however", "actually", "unfortunately", as they signal problems and answers.'
        }
      ],
      quizzes: [
        {
          id: 'q-toeic-l1',
          lessonId: 'toeic-l1',
          title: 'Quiz - Photos of People',
          questions: [
            {
              id: 'q-toeic-l1-1',
              question: 'A photo shows a woman sitting at her desk, holding a pen and looking at some documents. What is the most accurate description?',
              options: [
                'She is writing a letter on a computer.',
                'She is examining some papers at her desk.',
                'She is packing files into a box.',
                'She is leaning against a filing cabinet.'
              ],
              correctIndex: 1,
              explanation: '"She is examining some papers at her desk" accurately describes "looking at some documents". Option A is incorrect because she holds a pen, not typing. Option C and D describe actions not present in the photo.'
            },
            {
              id: 'q-toeic-l1-2',
              question: 'In a photo, a man is reaching for an item on a supermarket shelf. Which distractor is most likely to appear?',
              options: [
                'He is paying for his groceries at the cashier.',
                'He is reaching for some goods on the shelf.',
                'The shelves are being stocked by a worker.',
                'He is pushing a shopping cart down the aisle.'
              ],
              correctIndex: 1,
              explanation: '"Reaching for some goods on the shelf" matches the posture. paying (A), pushing a cart (D) are common distractors involving supermarket actions that are not happening.'
            },
            {
              id: 'q-toeic-l1-3',
              question: 'A photo shows several people seated around a table in a conference room. One man is standing and gesturing towards a screen. What is the correct option?',
              options: [
                'The meeting has already adjourned.',
                'A presentation is being delivered in the room.',
                'The chairs are being stacked in the corner.',
                'They are eating lunch in the cafeteria.'
              ],
              correctIndex: 1,
              explanation: '"A presentation is being delivered" is correct because the standing man is gesturing toward a screen, which indicates presenting to the seated audience.'
            }
          ]
        },
        {
          id: 'q-toeic-l2',
          lessonId: 'toeic-l2',
          title: 'Quiz - Information Questions',
          questions: [
            {
              id: 'q-toeic-l2-1',
              question: 'Question: "Who approved the budget proposal for the new marketing campaign?"',
              options: [
                'Yes, the budget was approved yesterday.',
                'Our regional director did, during the morning meeting.',
                'No, we need more campaigns.',
                'It is too expensive.'
              ],
              correctIndex: 1,
              explanation: 'A "Who" question cannot be answered with "Yes/No" (excluding options A and C). Option B identifies the person ("Our regional director") who did the action.'
            },
            {
              id: 'q-toeic-l2-2',
              question: 'Question: "When will the quarterly financial report be published?"',
              options: [
                'In the conference room upstairs.',
                'As soon as the auditors finish reviewing the numbers.',
                'The Chief Financial Officer published it.',
                'Yes, I read it this morning.'
              ],
              correctIndex: 1,
              explanation: '"When" questions ask for a time. "As soon as the auditors finish..." is an indirect time condition, which is extremely common in high-score TOEIC questions. Option A answers Where, C answers Who, D is a Yes response.'
            }
          ]
        },
        {
          id: 'q-toeic-l3',
          lessonId: 'toeic-l3',
          title: 'Quiz - Conversations Office Problems',
          questions: [
            {
              id: 'q-toeic-l3-1',
              question: 'What is the main problem discussed in a dialogue where the speaker says: "The projector in Room B keeps flickering, and the board members are arriving in 10 minutes"?',
              options: [
                'The board meeting was rescheduled.',
                'A piece of presentation equipment is malfunctioning.',
                'The room was booked by another department.',
                'There are not enough chairs for the board members.'
              ],
              correctIndex: 1,
              explanation: 'The projector "flickering" refers to a malfunctioning piece of presentation equipment. The board arriving soon indicates the urgency of the problem.'
            }
          ]
        }
      ]
    },
    {
      id: 'toeic-grammar-booster',
      title: 'Grammar Booster: Essential Clauses',
      thumbnail: '✍️',
      level: 'Beginner',
      lessonsCount: 2,
      enrollments: 980,
      lessons: [
        {
          id: 'toeic-g1',
          title: 'Subject-Verb Agreement Rules',
          duration: '10 mins',
          contentType: 'text',
          contentUrl: '',
          summary: 'Các quy tắc cốt lõi về hòa hợp chủ ngữ và động từ, đặc biệt chú ý danh từ tập hợp, liên từ (either...or, neither...nor) và các cụm danh từ dài có giới từ chen giữa.',
          contentBody: 'Subject-Verb Agreement (SVA) is heavily tested in TOEIC Parts 5 & 6. Core rules:\n1. Singular subjects require singular verbs; plural subjects require plural verbs.\n2. Prepositional phrases between subject and verb do NOT affect the verb number (e.g., "The box of chocolate candies IS on the table" -> subject is "box", not "candies").\n3. "Either A or B" and "Neither A nor B" make the verb agree with subject B (the closer one).\n4. Gerunds as subjects are always singular (e.g., "Analyzing reports takes time").'
        },
        {
          id: 'toeic-g2',
          title: 'Relative Clauses (Who, Which, That, Whose)',
          duration: '15 mins',
          contentType: 'video',
          contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          summary: 'Phân biệt mệnh đề quan hệ xác định và không xác định. Cách rút gọn mệnh đề quan hệ (V-ing, V-ed/V3) cực kỳ phổ biến trong đề thi TOEIC Part 5.',
          contentBody: 'Relative Clauses are used to define or give more information about nouns. \n- Who: For people as subjects ("The manager who hired me...").\n- Whom: For people as objects.\n- Which: For things/objects.\n- Whose: For possession.\n- Reduced Relative Clauses: If active, reduce to V-ing ("The man working here" instead of "The man who works here"). If passive, reduce to V3/Past Participle ("The report submitted yesterday" instead of "The report that was submitted yesterday").'
        }
      ],
      quizzes: [
        {
          id: 'q-toeic-g1',
          lessonId: 'toeic-g1',
          title: 'Quiz - Subject-Verb Agreement',
          questions: [
            {
              id: 'q-toeic-g1-1',
              question: 'Choose the correct form: "The delegation of international representatives ______ arriving at the airport at 5:00 PM today."',
              options: [
                'are',
                'is',
                'were',
                'have been'
              ],
              correctIndex: 1,
              explanation: 'The real subject is "delegation" (singular noun), not "representatives". Therefore, the singular verb "is" is correct.'
            },
            {
              id: 'q-toeic-g1-2',
              question: 'Choose the correct form: "Neither the manager nor the staff members ______ notified about the sudden schedule change."',
              options: [
                'was',
                'were',
                'has been',
                'is'
              ],
              correctIndex: 1,
              explanation: 'With "Neither... nor...", the verb agrees with the closer subject. "staff members" is plural, so we use the plural verb "were".'
            }
          ]
        }
      ]
    }
  ],
  JLPT_CENTER: [
    {
      id: 'jlpt-n3-grammar',
      title: 'JLPT N3 Grammar - Master Expressive Patterns',
      thumbnail: '🏮',
      level: 'N3',
      lessonsCount: 3,
      enrollments: 850,
      lessons: [
        {
          id: 'jlpt-g1',
          title: 'Expressing Intentions: つもり và ようと思う',
          duration: '15 mins',
          contentType: 'video',
          contentUrl: 'https://www.w3schools.com/html/movie.mp4',
          summary: 'Phân biệt cách dùng cấu trúc biểu đạt ý định và kế hoạch cá nhân. Sự khác nhau giữa 予定 (kế hoạch khách quan) và つもり / ようと思う (ý chí chủ quan).',
          contentBody: 'Trong tiếng Nhật N3, có 3 cách chính để biểu thị ý định:\n1. V-る / V-ない + つもりだ: Dự định làm/không làm một việc gì đó đã được suy nghĩ trước. (Ví dụ: 来年日本へ行くつもりです).\n2. V-ý chí (よう) + と思う: Ý chí vừa mới nảy ra hoặc dự định mang tính cá nhân, thân mật hơn. (Ví dụ: 今日、早く帰ろうと思います).\n3. V-る + 予定 (よてい) だ: Kế hoạch khách quan, đã được sắp xếp lịch trình sẵn (lịch tàu chạy, họp hành, sự kiện lịch trình).'
        },
        {
          id: 'jlpt-g2',
          title: 'Comparing: わけがない vs はずがない',
          duration: '12 mins',
          contentType: 'pdf',
          contentUrl: 'https://example.com/jlpt-n3.pdf',
          summary: 'Cú pháp phủ định mạnh mẽ mang tính phán đoán khách quan (không có lý nào, chắc chắn không). Luyện phản xạ ghép câu trong đề thi ngữ pháp N3.',
          contentBody: 'Cả 2 mẫu đều dịch là "Không có lý nào / Chắc chắn không thể...". Tuy nhiên:\n- わけがない (wake ga nai): Phủ định dựa trên logic thực tế, lý lẽ hiển nhiên của sự việc. (Ví dụ: 練習しないのだから, 上手になるわけがない - Không luyện tập thì làm sao giỏi lên được).\n- はずがない (hazu ga nai): Phủ định dựa trên niềm tin mạnh mẽ, sự tin tưởng khách quan của người nói. Thường dùng cho người thân hoặc thông tin đã biết rõ.'
        },
        {
          id: 'jlpt-g3',
          title: 'Adverbial Modifiers: ようになっている',
          duration: '10 mins',
          contentType: 'text',
          contentUrl: '',
          summary: 'Sử dụng cấu trúc miêu tả hoạt động tự động của máy móc hoặc một cơ chế tự nhiên được thiết lập sẵn.',
          contentBody: 'Mẫu câu [V-る / V-ない + ようになっている] biểu thị một cơ chế, thiết kế tự động của máy móc hoặc một hệ thống xã hội, tự nhiên nào đó sẽ tự động xảy ra khi có một tác động trước.\nVí dụ:\n- このボタンを押すと, ドアが開くようになっています。 (Khi nhấn nút này, cửa sẽ tự động mở).\n- 喉が渇くと, 水を飲みたくなるようになっている。 (Khi khát nước thì tự nhiên sẽ muốn uống nước - cơ chế sinh học).'
        }
      ],
      quizzes: [
        {
          id: 'q-jlpt-g1',
          lessonId: 'jlpt-g1',
          title: 'テスト - 意図の表現 (つもり・ようと思う)',
          questions: [
            {
              id: 'q-jlpt-g1-1',
              question: 'Điền vào chỗ trống: 「仕事が終わったら、ジムに______と思っています。」',
              options: [
                '行く',
                '行こう',
                '行って',
                '行きたい'
              ],
              correctIndex: 1,
              explanation: 'Mẫu ngữ pháp biểu đạt ý định: Thể ý chí + と思う. Thể ý chí của 行く là 行こう (ikou).'
            },
            {
              id: 'q-jlpt-g1-2',
              question: 'Chọn câu thể hiện kế hoạch khách quan đã được lên lịch sẵn bởi ban tổ chức:',
              options: [
                '日本へ行くつもりです。',
                '明日、会議が行われる予定です。',
                '今夜 là học, định họcしようと思います。',
                'ビールを飲まないつもりだ。'
              ],
              correctIndex: 1,
              explanation: '予定 (yotei) dùng cho các kế hoạch khách quan được ấn định sẵn (ví dụ: Hội nghị được tổ chức vào ngày mai). Các câu còn lại dùng つもり và と思う biểu thị ý định chủ quan.'
            }
          ]
        },
        {
          id: 'q-jlpt-g2',
          lessonId: 'jlpt-g2',
          title: 'テスト - わけがない vs はずがない',
          questions: [
            {
              id: 'q-jlpt-g2-1',
              question: 'Chọn câu đúng nhất: 「昨日あれだけたくさん食べたのだから、今日すぐにお腹が______。」',
              options: [
                '空くわけがない',
                '空く予定だ',
                '空くつもりだ',
                '空くようになっている'
              ],
              correctIndex: 0,
              explanation: 'Dựa vào logic thực tế: "Hôm qua ăn nhiều như thế thì hôm nay KHÔNG THỂ NÀO nhanh đói được". Vì vậy dùng わけがない (wake ga nai) là phù hợp nhất.'
            }
          ]
        }
      ]
    },
    {
      id: 'jlpt-n3-kanji',
      title: 'JLPT N3 Kanji Mastery - Office & Work life',
      thumbnail: '📝',
      level: 'N3',
      lessonsCount: 2,
      enrollments: 720,
      lessons: [
        {
          id: 'jlpt-k1',
          title: 'Hán tự chủ đề Công sở (役, 職, 員, 業)',
          duration: '11 mins',
          contentType: 'video',
          contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          summary: 'Học cách đọc Âm ôn, Âm kun và cách ghép từ các hán tự phổ biến trong môi trường làm việc: 役割 (vai trò), 職業 (nghề nghiệp), 社員 (nhân viên).',
          contentBody: 'Từ vựng và Kanji công sở N3 cực kỳ quan trọng:\n1. 役 (Dịch): 役割 (やくわり - vai trò), 役所 (やくしょ - văn phòng hành chính).\n2. 職 (Chức): 職業 (しょくぎょう - nghề nghiệp), 職場 (しょくば - nơi làm việc).\n3. 員 (Viên): 社員 (しゃいn - nhân viên công ty), 全員 (ぜんいん - tất cả mọi người).\n4. 業 (Nghiệp): 授業 (じゅぎょう - giờ học), 残業 (ざんぎょう - làm thêm giờ).'
        }
      ],
      quizzes: [
        {
          id: 'q-jlpt-k1',
          lessonId: 'jlpt-k1',
          title: 'テスト - 職場に関する漢字',
          questions: [
            {
              id: 'q-jlpt-k1-1',
              question: 'Cách đọc chính xác của từ 「残業」 là gì?',
              options: [
                'ざんぎょう (Zangyou)',
                'さんぎょう (Sangyou)',
                'せんぎょう (Sengyou)',
                'ぜんぎょう (Zengyou)'
              ],
              correctIndex: 0,
              explanation: '残業 (Tàn Nghiệp - Làm thêm giờ) đọc là ざんぎょう (zangyou) với âm đục ở chữ 残 (ざん).'
            },
            {
              id: 'q-jlpt-k1-2',
              question: 'Chữ Hán nào có nghĩa là "Nghề nghiệp" (Shokugyou)?',
              options: [
                '役割',
                '社員',
                '職業',
                '授業'
              ],
              correctIndex: 2,
              explanation: '職業 (しょくぎょう) nghĩa là Nghề nghiệp. 役割 (vai trò), 社員 (nhân viên), 授業 (tiết học).'
            }
          ]
        }
      ]
    }
  ]
};
