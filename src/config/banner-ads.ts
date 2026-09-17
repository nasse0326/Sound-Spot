export interface BannerAdItem {
  id: string;
  advertiserName: string;
  badge: string;
  imageUrl: string;
  width: number;
  height: number;
  clickUrl: string;
  trackingPixel?: string;
  accentColor: 'amber' | 'cyan' | 'purple' | 'emerald';
}

// PCサイドバー・カード用の画像バナー広告（A8.net）。
// 300x250（中量長方形）はサイドバー・カードどちらの枠にも使えるためこちらを優先採用。
// 468x60（フルバナー）は縦長サイドバーだと余白が大きく出るため、横長スロット向けに温存。
export const BANNER_ADS: BannerAdItem[] = [
  {
    id: 'kaitoriya-banner',
    advertiserName: '楽器の買取屋さん',
    badge: 'PR・楽器買取',
    imageUrl: 'https://www27.a8.net/svt/bgt?aid=260906499299&wid=001&eno=01&mid=s00000027408001011000&mc=1',
    width: 300,
    height: 250,
    clickUrl: 'https://px.a8.net/svt/ejp?a8mat=4BC4QR+4Y0MNM+5VHC+60OXD',
    trackingPixel: 'https://www18.a8.net/0.gif?a8mat=4BC4QR+4Y0MNM+5VHC+60OXD',
    accentColor: 'amber',
  },
  {
    id: 'arrows-banner',
    advertiserName: '楽器買取アローズ',
    badge: 'PR・機材買取',
    imageUrl: 'https://www25.a8.net/svt/bgt?aid=260906499329&wid=001&eno=01&mid=s00000018024006007000&mc=1',
    width: 300,
    height: 250,
    clickUrl: 'https://px.a8.net/svt/ejp?a8mat=4BC4QR+5FVMSY+3V2O+ZRIB5',
    trackingPixel: 'https://www12.a8.net/0.gif?a8mat=4BC4QR+5FVMSY+3V2O+ZRIB5',
    accentColor: 'purple',
  },
  {
    id: 'ikebe-banner-new',
    advertiserName: 'イケベ楽器',
    badge: 'PR・楽器店',
    imageUrl: 'https://www24.a8.net/svt/bgt?aid=260906499312&wid=001&eno=01&mid=s00000025975001004000&mc=1',
    width: 300,
    height: 250,
    clickUrl: 'https://px.a8.net/svt/ejp?a8mat=4BC4QR+55R9IQ+5KFA+5Z6WX',
    trackingPixel: 'https://www11.a8.net/0.gif?a8mat=4BC4QR+55R9IQ+5KFA+5Z6WX',
    accentColor: 'amber',
  },
  {
    id: 'ikebe-banner-used',
    advertiserName: 'イケベ楽器（中古)',
    badge: 'PR・中古楽器',
    imageUrl: 'https://www21.a8.net/svt/bgt?aid=260906499312&wid=001&eno=01&mid=s00000025975001003000&mc=1',
    width: 300,
    height: 250,
    clickUrl: 'https://px.a8.net/svt/ejp?a8mat=4BC4QR+55R9IQ+5KFA+5YZ75',
    trackingPixel: 'https://www17.a8.net/0.gif?a8mat=4BC4QR+55R9IQ+5KFA+5YZ75',
    accentColor: 'amber',
  },
  {
    id: 'ishibashi-banner',
    advertiserName: '石橋楽器店',
    badge: 'PR・安心の楽器店',
    imageUrl: 'https://www25.a8.net/svt/bgt?aid=260906499296&wid=001&eno=01&mid=s00000001948001001000&mc=1',
    width: 468,
    height: 60,
    clickUrl: 'https://px.a8.net/svt/ejp?a8mat=4BC4QR+4W8BUA+F14+5YJRL',
    trackingPixel: 'https://www18.a8.net/0.gif?a8mat=4BC4QR+4W8BUA+F14+5YJRL',
    accentColor: 'cyan',
  },
];

// サイドバー（300px幅想定）のローテーション対象は縦長比率が近い300x250のみ。
// 468x60はここでは使わず、横長スロットが用意でき次第そちらで使う。
export const SIDEBAR_ROTATION_ADS = BANNER_ADS.filter((ad) => ad.width === 300 && ad.height === 250);
