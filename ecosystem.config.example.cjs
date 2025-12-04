module.exports = {
  apps: [
    {
      name: "schale-backend",
      script: "./dist-server/index.js",
      env: {
        NODE_ENV: "production",
        
        // --- 基础配置 ---
        PORT: 4000,
        
        // --- Gemini AI 配置 ---
        GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE", 
        
        // 选填：如果不填则使用代码默认值
        GEMINI_MODEL: "gemini-2.5-flash",
        GEMINI_TEMPERATURE: 1.0,
        GEMINI_MAX_TOKENS: 5120,
        MAX_HISTORY_ITEMS: 12,

        // --- 网络配置 ---
        // 如果服务器在国内,并填入代理地址 (例如 http://127.0.0.1:7890)
        //HTTP_PROXY: "http://127.0.0.1:7890",
      }
    }
  ]
};
