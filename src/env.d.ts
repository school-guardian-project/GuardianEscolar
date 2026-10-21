declare interface Env {
  readonly API_URL: string;
  readonly API_FORGOT_INFORMATION_URL?: string;
  readonly API_APK_DOWNLOAD_URL: string;
  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}
