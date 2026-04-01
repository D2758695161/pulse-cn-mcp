import {
  WeiboHotResponse,
  HoroscopeResponse,
  DailyEnglishResponse,
  AllHotspotsResponse,
  HeadlinesResponse,
  PaperNewsResponse
} from '../types/index.js';

/**
 * Wrapper around fetch with timeout support.
 * @param url - The URL to fetch
 * @param timeoutMs - Timeout in milliseconds (default: 10000)
 * @param options - Additional fetch options
 */
async function fetchWithTimeout(url: string, timeoutMs: number = 10000, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWeiboHot(): Promise<WeiboHotResponse> {
  try {
    const response = await fetchWithTimeout("https://api.vvhan.com/api/hotlist/wbHot");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    const data: WeiboHotResponse = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      name: '微博热搜',
      subtitle: '',
      update_time: new Date().toISOString(),
      data: [],
      _error: message,
    } as WeiboHotResponse & { _error: string };
  }
}

export async function fetchHoroscope(type: string, time: string): Promise<HoroscopeResponse> {
  try {
    const url = `https://api.vvhan.com/api/horoscope?type=${type}&time=${time}`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    const data: HoroscopeResponse = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: {
        title: '',
        time: '',
        todo: { yi: '', ji: '' },
        fortune: { all: 0, love: 0, work: 0, money: 0, health: 0 },
        index: { all: '', love: '', work: '', money: '', health: '' },
        shortcomment: `获取星座数据失败: ${message}`,
        fortunetext: { all: '', love: '', work: '', money: '', health: '' },
        type: '',
        uptype: '',
        luckynumber: '',
        luckycolor: '',
        luckyconstellation: '',
      },
      _error: message,
    } as HoroscopeResponse & { _error: string };
  }
}

export async function fetchDailyEnglish(random: boolean = false): Promise<DailyEnglishResponse> {
  try {
    const url = random
      ? 'https://api.vvhan.com/api/dailyEnglish?type=sj'
      : 'https://api.vvhan.com/api/dailyEnglish';
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    const data: DailyEnglishResponse = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: {
        zh: `获取每日英语失败: ${message}`,
        en: '',
        pic: '',
      },
      _error: message,
    } as DailyEnglishResponse & { _error: string };
  }
}

export async function fetchAllHotspots(): Promise<AllHotspotsResponse> {
  try {
    const url = 'https://api.vvhan.com/api/hotlist/all';
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    const data: AllHotspotsResponse = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: [],
      _error: message,
    } as AllHotspotsResponse & { _error: string };
  }
}

export async function fetchToutiaoHotspots(): Promise<HeadlinesResponse> {
  try {
    const url = 'https://api.vvhan.com/api/hotlist/toutiao';
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    const data: HeadlinesResponse = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: [],
      _error: message,
    } as HeadlinesResponse & { _error: string };
  }
}

export async function fetchPaperNews(): Promise<PaperNewsResponse> {
  try {
    const url = 'https://api.vvhan.com/api/hotlist/pengPai';
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    const data: PaperNewsResponse = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: [],
      _error: message,
    } as PaperNewsResponse & { _error: string };
  }
}
