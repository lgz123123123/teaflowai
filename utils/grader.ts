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
    // Sencha: Standard < 15, Premium 15-30, Master > 30
    if (yenPerGram > 30) {
      grade = Grade.IMPERIAL; // Master
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Master grade (> ¥30/g). Requires precise low-temp brewing.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。品評会・競技会クラス（> ¥30/g）。低温で丁寧に抽出を。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。竞赛级煎茶（> ¥30/g）。需用低温精准冲泡以引出极致鲜味。`
      };
    } else if (yenPerGram >= 15) {
      grade = Grade.HIGH; // Premium
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Premium grade (¥15-30/g). Ideal for guests.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。上級煎茶（¥15-30/g）。来客用にも最適です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。待客级高级煎茶（¥15-30/g）。色香味俱佳。`
      };
    } else {
      grade = Grade.STANDARD; // Standard
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Standard grade (< ¥15/g). Refreshing for everyday enjoyment.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。並級（< ¥15/g）。日常的に楽しめる爽やかな煎茶です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。标准日常级（< ¥15/g）。清爽适口。`
      };
    }
  } else if (teaType === TeaType.GYOKURO) {
    // Gyokuro: Standard 30-45, Premium 45-80, Master >= 80
    if (yenPerGram >= 80) {
      grade = Grade.IMPERIAL; // Master
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Competition grade (≥ ¥80/g). "Dew drops" extraction recommended (≤40°C).`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。極品・滴露成立級（≥ ¥80/g）。40℃以下での「雫出し」で濃厚な旨味を。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。极品滴露级（≥ ¥80/g）。建议40℃以下采用“滴露法”萃取。`
      };
    } else if (yenPerGram >= 45) {
      grade = Grade.HIGH; // Premium
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Premium Gyokuro (¥45-80/g). Rich aroma and creamy texture.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。正統高級玉露（¥45-80/g）。豊かな覆い香とクリーミーな食感。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。正统高级玉露（¥45-80/g）。具有浓郁覆盖香和奶油般口感。`
      };
    } else {
      // Covers 30-45 range as Entry/Practice
      grade = Grade.STANDARD; 
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Entry/Practice level (¥30-45/g). A great introduction to Gyokuro.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。練習級（¥30-45/g）。玉露の世界への入り口として最適です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。练习级（¥30-45/g）。玉露世界的入门之选。`
      };
    }
  }

  return { grade, pricePerGram: yenPerGram, reasoning };
};