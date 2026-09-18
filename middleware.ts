import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * VercelとCloudflare Workersが同じmainブランチをそれぞれ自動ビルドしているため、
 * アプリ本体にリダイレクトを組み込むと新しいCloudflare版も巻き添えでリダイレクトしてしまう。
 * Vercelが自動設定する`VERCEL`環境変数(Cloudflare側には存在しない)で分岐することで、
 * 旧Vercel環境でのみ新URLへリダイレクトする。
 */
export function middleware(request: NextRequest) {
  if (process.env.VERCEL === '1') {
    const url = `https://sound-spot.nasse0326.workers.dev${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
};
