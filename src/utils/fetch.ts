/**
 * Fetch utility with configurable API URL and proper error handling
 * Fixes: https://github.com/wangtsiao/pulse-cn-mcp/issues/5
 */

const BASE_URL = process.env.VVHAN_API_URL || 'https://api.vvhan.com/api';
const FETCH_TIMEOUT_MS = Number(process.env.VVHAN_TIMEOUT_MS) || 8000;

/**
 * Fetch with timeout and error handling
 * @param url API URL (relative to base URL)
 * @param options Fetch options
 */
export async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${FETCH_TIMEOUT_MS}ms for ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function get(url: string, options: RequestInit = {}): Promise<any> {
  return fetchWithTimeout(url, { ...options, method: 'GET' });
}
