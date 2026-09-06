export interface NativeAdItem {
  id: string;
  badge: string;
  categoryName: string;
  title: string;
  tagline: string;
  description: string;
  features: {
    label: string;
    detail: string;
  }[];
  ctaText: string;
  ctaUrl: string;
  trackingPixel?: string;
  accentColor: 'amber' | 'cyan' | 'purple' | 'emerald';
}

export const NATIVE_ADS: NativeAdItem[] = [
  {
    id: 'ikebe-consumables',
    badge: 'PR・消耗品/機材',
    categoryName: 'イケベ楽器',
    title: 'スタジオ前の弦・スティック・シールド補充',
    tagline: 'リハ当日に「弦が切れた」「スティック折れた」を防ぐ！国内最大級の品揃え',
    description: '定番エリクサー・ダダリオ弦からVic Firth・Pearlスティック、CANAREシールドまで人気機材が即日手に入る。',
    features: [
      { label: '最大級の品揃え', detail: 'ギター・ベース弦からドラム周辺アクセサリまで網羅' },
      { label: '定番機材', detail: 'CANARE、Custom Audio、定番ペダルや消耗品も充実' },
      { label: '安心の専門店', detail: '渋谷・秋葉原等に実店舗も構えるプロ・アマ御用達ショップ' },
    ],
    ctaText: 'イケベ楽器で消耗品をチェック',
    ctaUrl: 'https://px.a8.net/svt/ejp?a8mat=4BC4QR+55R9IQ+5KFA+5YJRM',
    trackingPixel: 'https://www16.a8.net/0.gif?a8mat=4BC4QR+55R9IQ+5KFA+5YJRM',
    accentColor: 'amber',
  },
  {
    id: 'arrows-tradein',
    badge: 'PR・機材高価買取',
    categoryName: '楽器買取アローズ',
    title: '使わなくなったエフェクター・楽器を軍資金に',
    tagline: '自宅から詰めて送るだけ！スタジオ代・新機材の購入資金作り',
    description: '眠っている歪みペダルやサブギターを無料査定。送料・手数料・査定料・梱包材すべて完全無料で即日入金対応。',
    features: [
      { label: '完全無料', detail: '送料・手数料・査定料・梱包キット・キャンセル返送料0円' },
      { label: 'スピード査定', detail: '品物到着後、最短当日〜2日以内に査定結果＆振込' },
      { label: '1点からOK', detail: 'BOSS定番エフェクターや機材小物から高額査定' },
    ],
    ctaText: '無料の宅配買取査定を申し込む',
    ctaUrl: 'https://px.a8.net/svt/ejp?a8mat=4BC4QR+5FVMSY+3V2O+ZSKW2',
    trackingPixel: 'https://www19.a8.net/0.gif?a8mat=4BC4QR+5FVMSY+3V2O+ZSKW2',
    accentColor: 'purple',
  },
  {
    id: 'ishibashi-music',
    badge: 'PR・安心の楽器店',
    categoryName: '石橋楽器店 (イシバシ)',
    title: 'アフターサポートも安心！国内最大手楽器オンライン',
    tagline: 'スタジオ定番機材から最新エフェクター・アンプまで安心の正規保証',
    description: '創業70年以上の歴史を誇る石橋楽器店。新品ギター・ベースから中古名機、スタジオ周辺機材まで幅広くサポート。',
    features: [
      { label: '正規保証', detail: '安心のアフターサービス＆丁寧な梱包サポート' },
      { label: '豊富な中古', detail: '全国のイシバシ店舗から良質な中古エフェクター・楽器が集合' },
      { label: '定番スタジオ機材', detail: 'Roland JC-120やMarshallと相性抜群の機材が満載' },
    ],
    ctaText: '石橋楽器店オンラインを見る',
    ctaUrl: 'https://px.a8.net/svt/ejp?a8mat=4BC4QR+4W8BUA+F14+61JSI',
    trackingPixel: 'https://www11.a8.net/0.gif?a8mat=4BC4QR+4W8BUA+F14+61JSI',
    accentColor: 'cyan',
  },
  {
    id: 'tunecore-distribution',
    badge: 'PR・音源リリース',
    categoryName: '世界音楽配信 (TuneCore)',
    title: 'スタジオで練り上げた新曲をSpotify・Apple Musicへ',
    tagline: 'CDプレス不要！最短2日で世界185カ国・55以上の配信ストアへ一斉配信',
    description: 'バンドのスタジオテイクや新音源を世界中のリスナーへ。再生収益は100%アーティストに還元。スマホ1台で配信手続き完了。',
    features: [
      { label: '収益100%還元', detail: 'ストリーミング再生やSNS利用料がそのままバンドの売上に' },
      { label: 'スピード配信', detail: '最短2日で世界中の音楽サブスクに一斉リリース可能' },
      { label: 'TikTok/インスタ連動', detail: 'SNSの公式BGMとしても自動登録されバズを狙える' },
    ],
    ctaText: 'TuneCore Japanで配信を始める',
    ctaUrl: 'https://www.tunecore.co.jp/',
    accentColor: 'emerald',
  },
];
