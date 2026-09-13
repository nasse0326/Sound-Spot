import fs from 'fs';
import path from 'path';

export interface NoahLoginResult {
  success: boolean;
  cookieHeader: string;
  message?: string;
}

/**
 * Logs in to Studio NOAH using pure Node fetch (no browser needed).
 * Obtains CSRF token and session cookies, submits credentials, and updates storageState.json.
 */
export async function loginNoah(
  email?: string,
  password?: string
): Promise<NoahLoginResult> {
  const loginEmail = email || process.env.NOAH_LOGIN_ID;
  const loginPassword = password || process.env.NOAH_PASSWORD;

  if (!loginEmail || !loginPassword) {
    return {
      success: false,
      cookieHeader: '',
      message: 'NOAH_LOGIN_ID または NOAH_PASSWORD が未設定です。',
    };
  }

  const loginUrl = 'https://www.studionoah.jp/noahweb/SysMembers/login/true';
  const refererUrl = 'https://www.studionoah.jp/noahweb/webs/chart/';
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

  try {
    console.log('🔑 [NOAH Login] ログインCSRFトークンを取得中...');
    const resGet = await fetch(loginUrl, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': refererUrl,
      },
    });

    if (!resGet.ok) {
      return {
        success: false,
        cookieHeader: '',
        message: `CSRFトークン取得に失敗しました (HTTP ${resGet.status})`,
      };
    }

    const html = await resGet.text();
    const csrfMatch = html.match(/name="_csrfToken"[^>]*value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';

    if (!csrfToken) {
      return {
        success: false,
        cookieHeader: '',
        message: 'CSRFトークンがHTML内に見つかりませんでした。',
      };
    }

    // Extract initial cookies (csrfToken, PHPSESSID)
    const initialCookies: { name: string; value: string; domain: string; path: string }[] = [];
    const getSetCookieHeaders = (resGet.headers as any).getSetCookie
      ? (resGet.headers as any).getSetCookie()
      : [resGet.headers.get('set-cookie') || ''];

    for (const cookieStr of getSetCookieHeaders) {
      if (!cookieStr) continue;
      const parts = cookieStr.split(';')[0].trim().split('=');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        initialCookies.push({
          name,
          value,
          domain: 'www.studionoah.jp',
          path: '/',
        });
      }
    }

    const initialCookieHeader = initialCookies.map(c => `${c.name}=${c.value}`).join('; ');

    console.log('🔑 [NOAH Login] 認証情報を送信中...');
    const params = new URLSearchParams();
    params.append('_csrfToken', csrfToken);
    params.append('email', loginEmail);
    params.append('web_login_password', loginPassword);

    const resPost = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': refererUrl,
        'Cookie': initialCookieHeader,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: params.toString(),
    });

    const postBody = await resPost.text();
    const postSetCookies = (resPost.headers as any).getSetCookie
      ? (resPost.headers as any).getSetCookie()
      : [resPost.headers.get('set-cookie') || ''];

    const mergedCookiesMap = new Map<string, { name: string; value: string; domain: string; path: string }>();
    for (const c of initialCookies) {
      mergedCookiesMap.set(c.name, c);
    }
    for (const cookieStr of postSetCookies) {
      if (!cookieStr) continue;
      const parts = cookieStr.split(';')[0].trim().split('=');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        mergedCookiesMap.set(name, {
          name,
          value,
          domain: 'www.studionoah.jp',
          path: '/',
        });
      }
    }

    const allCookies = Array.from(mergedCookiesMap.values());
    const finalCookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');

    const isSuccess = postBody.trim() === '1' || finalCookieHeader.includes('CAKEPHP');

    if (!isSuccess && postBody.trim() === '0') {
      return {
        success: false,
        cookieHeader: '',
        message: 'ログインに失敗しました（IDまたはパスワードが不正です）。',
      };
    }

    // Playwright互換のstorageState.jsonを保存
    const storageState = {
      cookies: allCookies.map(c => ({
        name: c.name,
        value: c.value,
        domain: c.domain,
        path: c.path,
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax' as const,
      })),
      origins: [],
    };

    const storagePath = path.resolve(process.cwd(), 'storageState.json');
    fs.writeFileSync(storagePath, JSON.stringify(storageState, null, 2), 'utf-8');
    console.log(`✅ [NOAH Login] ログインに成功しました。Cookieを ${storagePath} に保存しました。`);

    return {
      success: true,
      cookieHeader: finalCookieHeader,
      message: 'ログイン成功',
    };
  } catch (error: any) {
    return {
      success: false,
      cookieHeader: '',
      message: `通信例外: ${error?.message}`,
    };
  }
}
