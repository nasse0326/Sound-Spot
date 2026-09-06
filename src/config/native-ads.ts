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
  accentColor: 'amber' | 'cyan' | 'purple' | 'emerald';
}

export const NATIVE_ADS: NativeAdItem[] = [
  {
    id: 'soundhouse-consumables',
    badge: 'PR・必需品',
    categoryName: 'サウンドハウス',
    title: 'スタジオ前の弦・スティック・消耗品チェック',
    tagline: 'リハ当日に「弦が切れた」「スティック折れた」を防ぐ！',
    description: '定番エリクサー・ダダリオ弦からVic Firth・Pearlスティック、CANAREシールドまで国内最安値級で即日発送。',
    features: [
      { label: '即日発送', detail: '首都圏なら最短翌日午前中にスタジオ・自宅へ到着' },
      { label: '定番機材', detail: 'Elixir弦、CANAREシールド、Custom Audioケーブル完備' },
      { label: 'まとめ買い', detail: 'バンド定期購入でスタジオ消耗品代を大幅節約' },
    ],
    ctaText: 'サウンドハウスで消耗品をチェック',
    ctaUrl: 'https://www.soundhouse.co.jp/',
    accentColor: 'amber',
  },
  {
    id: 'earplugs-crescendo',
    badge: 'PR・耳鳴り防止',
    categoryName: 'スタジオ・ライブ用耳栓',
    title: '大音量リハでも音質が籠もらない「音楽用耳栓」',
    tagline: 'スタジオ後の耳鳴り・音響外傷から大切な耳を守る新定番',
    description: 'シンバルやMarshall直前の爆音を均等に減衰（-15〜20dB）。ボーカルの抜けやピッチはクリアに聴こえるプロ愛用フィルター。',
    features: [
      { label: '音質保持', detail: '一般的な耳栓と違い高域が籠もらずクリアに会話可能' },
      { label: '疲労激減', detail: '3〜4時間の長時間スタジオ後も耳鳴りや頭痛が起きない' },
      { label: '水洗いOK', detail: 'イヤーチップは水洗い可能で衛生的＆専用ケース付属' },
    ],
    ctaText: '人気の音楽用イヤープロテクターを見る',
    ctaUrl: 'https://www.amazon.co.jp/s?k=%E3%83%A9%E3%82%A4%E3%83%96%E7%94%A8%E8%80%B3%E6%A0%93',
    accentColor: 'cyan',
  },
  {
    id: 'instrument-tradein',
    badge: 'PR・機材整理',
    categoryName: '楽器高価買取・下取り',
    title: '使わなくなったエフェクター・ギターを軍資金に',
    tagline: '自宅から詰めて送るだけ！スタジオ代・新アンプの購入資金作り',
    description: '眠っている歪みペダルやサブギターを無料査定。宅配キット無料送付＆キャンセル返送料無料で手軽に機材整理。',
    features: [
      { label: '送料無料', detail: '梱包キット・集荷・キャンセル返送料すべて完全無料' },
      { label: '即日入金', detail: '査定承諾後、24時間以内に指定口座へスピード振込' },
      { label: 'エフェクター1点〜', detail: 'BOSS定番からブティック系ペダルまで高額査定' },
    ],
    ctaText: '無料の宅配買取査定を申し込む',
    ctaUrl: 'https://www.ishibashi.co.jp/kaitori/',
    accentColor: 'purple',
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
