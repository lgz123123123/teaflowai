import { TeaDefinition, Grade, TeaType } from './types';

export const TEA_DATA: Record<TeaType, TeaDefinition> = {
  [TeaType.SENCHA]: {
    id: 'sencha',
    name: {
      en: 'Sencha',
      jp: '煎茶',
      cn: '煎茶'
    },
    tagline: {
      en: 'Sun-grown harmony & refreshment',
      jp: '太陽が育んだ爽やかな調和',
      cn: '沐浴阳光的清爽和谐'
    },
    profiles: {
      [Grade.STANDARD]: {
        grade: Grade.STANDARD,
        description: {
          en: 'A harmonious balance of refreshing astringency and sweet umami.',
          jp: '爽やかな渋みと甘みのある旨味の調和。',
          cn: '清爽的涩味与甘甜的鲜味和谐交融。'
        },
        parameters: {
          waterTemperature: 75,
          leafAmount: 3,
          waterAmount: 100
        },
        steeps: [
          { 
            duration: 60, 
            temperature: 75,
            note: {
              en: 'Standard steep to open the leaves.',
              jp: '茶葉を開く標準的な抽出。',
              cn: '标准冲泡，舒展茶叶。'
            },
            flavor: {
              en: 'Refreshing grassy aroma with a crisp finish.',
              jp: '若草のような香りと、さっぱりとした後味。',
              cn: '清新的草香，口感爽利。'
            }
          },
          { 
            duration: 30, 
            temperature: 80, 
            note: {
              en: 'A quicker steep with warmer water.',
              jp: '少し熱めのお湯で、手早く。',
              cn: '稍高水温，快速出汤。'
            },
            flavor: {
              en: 'Bright astringency that cleanses the palate.',
              jp: '口の中をさっぱりさせる、心地よい渋み。',
              cn: '明亮的涩感，清洁口腔。'
            }
          }
        ]
      },
      [Grade.HIGH]: {
        grade: Grade.HIGH,
        description: {
          en: 'Deep, rich umami with a vibrant emerald color.',
          jp: '鮮やかな翡翠色、深く濃厚な旨味。',
          cn: '鲜艳的翡翠色，深沉浓郁的鲜味。'
        },
        parameters: {
          waterTemperature: 70,
          leafAmount: 4,
          waterAmount: 90
        },
        steeps: [
          { 
            duration: 60, 
            temperature: 70,
            note: {
              en: 'Lower temperature preserves sweetness.',
              jp: '低温で甘みを守ります。',
              cn: '低温保留甘甜。'
            },
            flavor: {
              en: 'Rich umami with a thick mouthfeel.',
              jp: '濃厚な旨味と、とろみのある食感。',
              cn: '鲜味浓郁，口感醇厚。'
            }
          },
          { 
            duration: 20, 
            temperature: 80,
            note: {
              en: 'Release the aroma.',
              jp: '香りを解き放ちます。',
              cn: '释放香气。'
            },
            flavor: {
              en: 'Balanced bitterness and sweetness.',
              jp: '苦みと甘みのバランス。',
              cn: '苦甜平衡。'
            }
          },
          { 
            duration: 45, 
            temperature: 90,
            note: {
              en: 'Hotter finish to extract everything.',
              jp: '最後は熱めのお湯で出し切ります。',
              cn: '高温收尾，萃取精华。'
            }
          }
        ]
      },
      [Grade.IMPERIAL]: {
        grade: Grade.IMPERIAL,
        description: {
          en: 'The pinnacle of Sencha. Hand-picked, needle-like leaves offering pure essence.',
          jp: '煎茶の極み。手摘みの針のような茶葉がもたらす純粋なエッセンス。',
          cn: '煎茶之巅峰。手采针形茶叶，呈现纯粹茶韵。'
        },
        parameters: {
          waterTemperature: 60,
          leafAmount: 5,
          waterAmount: 80
        },
        steeps: [
          { 
            duration: 90, 
            temperature: 60,
            note: {
              en: 'Gentle warmth to coax out the soul of the tea.',
              jp: '茶葉の魂を呼び覚ます、優しい温もり。',
              cn: '温柔的温度，唤醒茶叶的灵魂。'
            },
            flavor: {
              en: 'An explosion of savory umami, almost like soup.',
              jp: 'スープのような、爆発的な旨味。',
              cn: '如高汤般鲜味爆发。'
            }
          },
          { 
            duration: 10, 
            temperature: 70,
            note: {
              en: 'Flash brew. Instant extraction.',
              jp: '瞬間抽出。',
              cn: '闪电冲泡，瞬间萃取。'
            },
            flavor: {
              en: 'Crystal clear sweetness.',
              jp: '水晶のように透明な甘み。',
              cn: '水晶般剔透的甘甜。'
            }
          },
          { 
            duration: 30, 
            temperature: 80,
            note: {
              en: 'Rising intensity.',
              jp: '高まる強度。',
              cn: '强度递增。'
            }
          },
          { 
            duration: 60, 
            temperature: 95,
            note: {
              en: 'The final cleanse.',
              jp: '最後の浄化。',
              cn: '最后的洗礼。'
            }
          }
        ]
      }
    }
  },
  [TeaType.GYOKURO]: {
    id: 'gyokuro',
    name: {
      en: 'Gyokuro',
      jp: '玉露',
      cn: '玉露'
    },
    tagline: {
      en: 'Shade-grown essence of umami',
      jp: '覆い下で深まる旨味の極み',
      cn: '遮阴孕育的鲜味精髓'
    },
    profiles: {
      [Grade.STANDARD]: {
        grade: Grade.STANDARD,
        description: {
          en: 'Accessible Gyokuro with a characteristic shade-grown aroma.',
          jp: '覆い香を楽しめる、親しみやすい玉露。',
          cn: '易于入口的玉露，带有标志性的遮光香气。'
        },
        parameters: {
          waterTemperature: 60,
          leafAmount: 4,
          waterAmount: 80
        },
        steeps: [
          { duration: 120, temperature: 60, note: { en: 'Brew slowly.', jp: 'ゆっくりと。', cn: '慢煮。' }, flavor: { en: 'Mild savory sweetness.', jp: '穏やかな甘み。', cn: '温和的甘甜。' } },
          { duration: 30, temperature: 75, note: { en: 'Quick second steep.', jp: '二煎目は手早く。', cn: '二泡要快。' } },
          { duration: 60, temperature: 85, note: { en: 'Finish hot.', jp: '最後は熱く。', cn: '高温收尾。' } }
        ]
      },
      [Grade.HIGH]: {
        grade: Grade.HIGH,
        description: {
          en: 'Rich "ooika" fragrance and a creamy texture.',
          jp: '豊かな覆い香と、クリーミーな舌触り。',
          cn: '浓郁的覆盖香，口感如奶油般顺滑。'
        },
        parameters: {
          waterTemperature: 55,
          leafAmount: 6,
          waterAmount: 60
        },
        steeps: [
          { duration: 120, temperature: 55, note: { en: 'Patience reveals the creaminess.', jp: '忍耐がクリーミーさを生む。', cn: '耐心唤醒顺滑口感。' }, flavor: { en: 'Brothy and rich.', jp: '出汁のような濃厚さ。', cn: '汤感浓厚。' } },
          { duration: 30, temperature: 65, note: { en: 'Warm up slightly.', jp: '少し温める。', cn: '稍稍升温。' } },
          { duration: 90, temperature: 85, note: { en: 'Extract the herbal notes.', jp: '茶葉の香草感を引き出す。', cn: '萃取草本香气。' } }
        ]
      },
      [Grade.IMPERIAL]: {
        grade: Grade.IMPERIAL,
        description: {
          en: 'Competition grade. A few drops of concentrated nectar from the heavens.',
          jp: '出品茶クラス。天からの一滴のような、凝縮された甘露。',
          cn: '赛级玉露。犹如天赐甘露，滴滴浓缩精华。'
        },
        parameters: {
          waterTemperature: 40,
          leafAmount: 8, // Very high leaf ratio
          waterAmount: 40 // Very low water ratio
        },
        steeps: [
          { 
            duration: 180, 
            temperature: 40,
            note: {
              en: 'Lukewarm water. Complete silence. Watch the "drip".',
              jp: '人肌程度の湯。完全なる静寂。滴りを見守る。',
              cn: '温水静泡，静观滴落。'
            },
            flavor: {
              en: 'Thick, oily, intense umami bomb. Not a tea, but an experience.',
              jp: '濃厚でオイリー、旨味の爆弾。お茶というより体験。',
              cn: '浓稠油润，鲜味炸弹。不仅是茶，更是体验。'
            }
          },
          { 
            duration: 30, 
            temperature: 50,
            note: {
              en: 'Slightly warmer, still concentrated.',
              jp: '少し温度を上げても、まだ濃厚。',
              cn: '微温，依然浓缩。'
            },
            flavor: {
              en: 'Sweetness lingers for minutes.',
              jp: '甘みが数分間続く。',
              cn: '回甘持久不散。'
            }
          },
          { 
            duration: 60, 
            temperature: 70,
            note: {
              en: 'Opening up the leaves.',
              jp: '茶葉を開かせる。',
              cn: '舒展叶片。'
            }
          },
          { 
            duration: 120, 
            temperature: 90,
            note: {
              en: 'The final wash. Refreshing bitterness.',
              jp: '最後の洗い。爽やかな苦み。',
              cn: '最后的洗礼，清爽的苦韵。'
            }
          }
        ]
      }
    }
  }
};