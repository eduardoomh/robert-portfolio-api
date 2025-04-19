
interface ImportMetaEnv {
    readonly RESEND_API_KEY: string;
    readonly ADMIN_EMAIL: string;
    readonly ALLOWED_ORIGIN: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }