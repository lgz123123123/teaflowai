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
    // Master: > 30 Yen/g
    if (yenPerGram > 30) {
      grade = Grade.IMPERIAL; 
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Competition grade. The pinnacle of Sencha.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。品評会・競技会クラス。煎茶の頂点です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。品鉴/竞赛级。煎茶之巅峰，风味极致。`
      };
    } 
    // Premium: 15 - 30 Yen/g
    else if (yenPerGram >= 15) {
      grade = Grade.HIGH; 
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Premium grade ideal for serving guests.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。来客用にも最適な上級煎茶です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。待客级高级煎茶。色香味俱佳。`
      };
    } 
    // Standard: < 15 Yen/g
    else {
      grade = Grade.STANDARD;
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Refreshing everyday Sencha.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。日常的に楽しめる爽やかな煎茶です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。日常级煎茶。清爽宜人。`
      };
    }
  } else if (teaType === TeaType.GYOKURO) {
    // Master: >= 80 Yen/g
    if (yenPerGram >= 80) {
      grade = Grade.IMPERIAL;
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Ultimate competition grade. Supports concentrated 'drop' brewing (≤40°C).`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。極上の出品茶クラス。低温（≤40℃）・少量の「雫出し」に耐えうる品質です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。极品滴露级。适合在 ≤40℃ 极其严苛的条件下进行滴露萃取。`
      };
    } 
    // Premium: 45 - 80 Yen/g
    else if (yenPerGram >= 45) {
      grade = Grade.HIGH;
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Authentic high-grade Gyokuro. Rich umami and distinct aroma.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。正統派の高級玉露。濃厚な旨味と覆い香が楽しめます。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。正统高级玉露。覆盖香浓郁，鲜味醇厚。`
      };
    } 
    // Entry/Practice: < 45 Yen/g (Specifically 30-45 is practice, but <30 is also standard)
    else {
      grade = Grade.STANDARD; 
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g. Entry level Gyokuro. Good for practice and daily appreciation.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。玉露の練習用・入門用に適した等級です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。玉露练习级。适合作为入门体验或日常练习。`
      };
    }
  }

  return { grade, pricePerGram: yenPerGram, reasoning };
};