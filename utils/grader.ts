import { TeaType, Grade, Language } from '../types';

interface GradeResult {
  grade: Grade;
  pricePerGram: number;
  reasoning: Record<Language, string>;
}

export const calculateTeaGrade = (
  teaType: TeaType, 
  priceYen: number, 
  weightGrams: number
): GradeResult | null => {
  if (!priceYen || !weightGrams || weightGrams <= 0) return null;

  const yenPerGram = priceYen / weightGrams;
  let grade: Grade = Grade.STANDARD;
  let reasoning: Record<Language, string> = { en: '', jp: '', cn: '' };

  if (teaType === TeaType.SENCHA) {
    if (yenPerGram >= 30) {
      grade = Grade.IMPERIAL; // Master
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Competition grade level. Requires precise low-temp brewing.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。品評会クラスの高級茶です。低温で丁寧に抽出を。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。竞赛级煎茶。需用低温精准冲泡以引出极致鲜味。`
      };
    } else if (yenPerGram >= 15) {
      grade = Grade.HIGH; // Premium
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. High quality Sencha ideal for guests.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。来客用にも最適な上級煎茶です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。适合待客的高级煎茶，色香味俱佳。`
      };
    } else {
      grade = Grade.STANDARD;
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Refreshing everyday Sencha.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。日常的に楽しめる爽やかな煎茶です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。适合日常饮用的清爽煎茶。`
      };
    }
  } else if (teaType === TeaType.GYOKURO) {
    if (yenPerGram >= 60) {
      grade = Grade.IMPERIAL; // Master
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. A rare masterpiece. "Dew drops" extraction recommended.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。至高の芸術品。「雫出し」で濃厚な旨味を。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。稀世珍品。建议采用“滴露法”萃取天赐甘露。`
      };
    } else if (yenPerGram >= 30) {
      grade = Grade.HIGH; // Premium
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Excellent Gyokuro with rich ooika aroma.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。豊かな覆い香を持つ素晴らしい玉露です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。具有浓郁覆盖香的优质玉露。`
      };
    } else {
      grade = Grade.STANDARD;
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. An accessible entry to the world of Gyokuro.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。玉露の世界への入り口として最適です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。玉露世界的入门之选，体验鲜味的基础。`
      };
    }
  }

  return { grade, pricePerGram: yenPerGram, reasoning };
};