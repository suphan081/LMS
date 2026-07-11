import api from 'zmp-sdk';

// Configurable environment override stored in localStorage
const ZALO_ENV_KEY = 'zalo_mini_app_env_override';

export function isRealZalo(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes('zalo') || !!(window as any).ZaloMiniApp || !!(window as any).ZaloJavaScriptInterface;
}

export function getZaloEnvOverride(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(ZALO_ENV_KEY);
  if (stored !== null) {
    return stored === 'true';
  }
  // Default to true if inside real Zalo, otherwise false (web workspace demo mode)
  return isRealZalo();
}

export function setZaloEnvOverride(val: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ZALO_ENV_KEY, String(val));
  }
}

// Struct of our user object returned by Zalo Mini App or Mock
export interface ZaloUserProfile {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  gender?: string;
  birthday?: string;
  isMock: boolean;
}

// Primary Zalo API Service Wrapper
export const ZaloService = {
  isZaloMode(): boolean {
    return getZaloEnvOverride();
  },

  isRealZaloContainer(): boolean {
    return isRealZalo();
  },

  // 1. Zalo Login flow
  async login(): Promise<{ accessToken?: string }> {
    if (isRealZalo()) {
      return new Promise((resolve, reject) => {
        (api as any).login({
          success: (res: any) => {
            console.log('[Zalo SDK] Login Success:', res);
            resolve(res);
          },
          fail: (err: any) => {
            console.error('[Zalo SDK] Login Failed:', err);
            reject(err);
          }
        });
      });
    } else {
      console.log('[Zalo Mock] Simulating login sequence...');
      return { accessToken: 'mock_zalo_access_token_12345' };
    }
  },

  // 2. Fetch User Info
  async getUserInfo(): Promise<ZaloUserProfile> {
    if (isRealZalo()) {
      return new Promise((resolve, reject) => {
        (api as any).getUserInfo({
          success: (res: any) => {
            console.log('[Zalo SDK] GetUserInfo Success:', res);
            const user = res.userInfo || res;
            resolve({
              id: user.id || 'zalo-real-user',
              name: user.name || 'Người dùng Zalo',
              avatar: user.avatar || 'https://h5.zdn.vn/zmp-sdk/assets/avatar.svg',
              gender: user.gender,
              birthday: user.birthday,
              isMock: false
            });
          },
          fail: (err: any) => {
            console.warn('[Zalo SDK] GetUserInfo Failed, falling back to dummy user:', err);
            resolve({
              id: 'zalo-fallback-user',
              name: 'Nhoxnaruto12',
              avatar: '👩‍🎓',
              email: 'Nhoxnaruto12@gmail.com',
              isMock: true
            });
          }
        });
      });
    } else {
      return {
        id: 'zalo-mock-nhoxnaruto12',
        name: 'Nhoxnaruto12',
        avatar: '👩‍🎓',
        email: 'Nhoxnaruto12@gmail.com',
        gender: 'female',
        birthday: '12/04/2004',
        isMock: true
      };
    }
  },

  // 3. Show Native/Mock toast notifications
  showToast(message: string, type: 'success' | 'fail' = 'success') {
    if (isRealZalo()) {
      try {
        (api as any).showToast({
          message,
          type: type === 'success' ? 'success' : 'fail',
          duration: 2500
        } as any);
      } catch (err) {
        console.error('[Zalo SDK] Toast Error:', err);
      }
    } else {
      console.log(`[Zalo Toast Mock] [${type.toUpperCase()}] ${message}`);
    }
  },

  // 4. Change App Header Title dynamically inside Zalo
  setNavigationBarTitle(title: string) {
    if (isRealZalo()) {
      try {
        (api as any).setNavigationBarTitle({
          title,
          success: () => console.log('[Zalo SDK] Navbar title changed to:', title),
          fail: (err: any) => console.error('[Zalo SDK] Navbar title change failed:', err)
        });
      } catch (err) {
        console.error('[Zalo SDK] setNavigationBarTitle Error:', err);
      }
    } else {
      console.log('[Zalo Navbar Title Mock] Title changed to:', title);
    }
  },

  // 5. Trigger Device Vibration
  vibrate() {
    if (isRealZalo()) {
      try {
        (api as any).vibrate({
          success: () => console.log('[Zalo SDK] Vibration triggered'),
          fail: (err: any) => console.error('[Zalo SDK] Vibration failed', err)
        });
      } catch (err) {
        console.error('[Zalo SDK] vibrate Error:', err);
      }
    } else {
      console.log('[Zalo Vibration Mock] Device vibrated (bzzzz)');
    }
  },

  // 6. Get Safe Areas & System dimensions
  getSystemInfo(): { platform: string; safeArea?: { top: number; bottom: number }; version: string } {
    if (isRealZalo()) {
      try {
        let sysInfo: any = {};
        // Try sync call first, fallback to async if needed
        const result = (api as any).getSystemInfo ? (api as any).getSystemInfo() : null;
        if (result) {
          sysInfo = result;
        } else {
          (api as any).getSystemInfo({
            success: (res: any) => {
              sysInfo = res;
            }
          });
        }
        return {
          platform: sysInfo.platform || 'unknown',
          safeArea: sysInfo.safeArea || { top: 24, bottom: 20 },
          version: sysInfo.version || '1.0.0'
        };
      } catch (e) {
        return { platform: 'zalo-container', safeArea: { top: 24, bottom: 20 }, version: '1.0.0' };
      }
    } else {
      return {
        platform: 'web-browser-mock',
        safeArea: { top: 32, bottom: 16 },
        version: 'mock-1.0.0'
      };
    }
  },

  // 7. Request Phone Number Permission (Interactive Permission Mock)
  async getPhoneNumber(): Promise<string> {
    if (isRealZalo()) {
      return new Promise((resolve, reject) => {
        (api as any).getPhoneNumber({
          success: (res: any) => {
            console.log('[Zalo SDK] Phone Number Token Success:', res);
            resolve(res.token || '');
          },
          fail: (err: any) => {
            console.error('[Zalo SDK] Phone Number Token Failed:', err);
            reject(err);
          }
        });
      });
    } else {
      return 'mock_phone_token_0987654321';
    }
  }
};
