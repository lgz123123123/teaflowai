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
        en: `¥${yenPerGram.toFixed(0)}/g (> ¥30). Master/Competition Grade.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。品鑑・競技会級（Master）。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。品鉴/竞赛级。属于煎茶中的登峰造极之作。`
      };
    } 
    // Premium: 15 - 30 Yen/g
    else if (yenPerGram >= 15) {
      grade = Grade.HIGH; 
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g (¥15-30). Premium Grade for guests.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。待客級（Premium）。来客用に適した上級茶です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。待客级（Premium）。适合招待贵客的高级煎茶。`
      };
    } 
    // Standard: < 15 Yen/g
    else {
      grade = Grade.STANDARD;
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g (< ¥15). Standard Grade for daily use.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。日常級（Standard）。普段使いの煎茶です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。日常级（Standard）。适合每日饮用的清爽煎茶。`
      };
    }
  } else if (teaType === TeaType.GYOKURO) {
    // Master: >= 80 Yen/g
    if (yenPerGram >= 80) {
      grade = Grade.IMPERIAL;
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g (≥ ¥80). Competition/Drop-Brew Grade.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。極品・滴露成立級（Master）。40℃以下の少水量で真価を発揮します。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。极品/滴露成立级。需在 ≤40℃、极少水量条件下成立。`
      };
    } 
    // Premium: 45 - 80 Yen/g (Exclusive of 80)
    else if (yenPerGram >= 45) {
      grade = Grade.HIGH;
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g (¥45-80). Premium Grade.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。正統高級（Premium）。本格的な玉露の旨味。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。正统高级（Premium）。风味纯正的高级玉露。`
      };
    } 
    // Entry/Practice: < 45 Yen/g (Typically 30-45, but covers anything below 45)
    else {
      grade = Grade.STANDARD; 
      reasoning = {
        en: `¥${yenPerGram.toFixed(0)}/g (< ¥45). Entry/Practice Grade.`,
        jp: `g単価 ¥${yenPerGram.toFixed(0)}。練習級（Entry）。玉露の淹れ方の練習に最適です。`,
        cn: `单价 ¥${yenPerGram.toFixed(0)}/g。练习级（Entry）。适合作为玉露入门或冲泡练习。`
      };
    }
  }

  return { grade, pricePerGram: yenPerGram, reasoning };
};