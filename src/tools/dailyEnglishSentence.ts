import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchDailyEnglish } from '../utils/fetch.js';
import { DailyEnglishParams } from '../types/index.js';

export function registerDailyEnglishSentenceTool(server: McpServer) {
  server.tool("get-inspirational-english-sentence", 
    "获取每日一句励志英语句子，返回包含句子实时数据。通过API实时获取。", 
    {
      random: z.boolean().optional().describe("是否随机获取一句英语句子")
    },
    async (params: DailyEnglishParams) => {
      // Check if user wants a random sentence
      const random = params?.random === true;
      
      const data = await fetchDailyEnglish(random);
      
      if (!data.success) {
        const errorMsg = ('_error' in data)
          ? `获取每日英语句子失败: ${data._error}`
          : "无法获取每日英语句子数据，请稍后重试或检查网络连接";
        return {
          content: [
            {
              type: "text",
              text: errorMsg
            }
          ]
        };
      }
      
      // Format the result with the English sentence and Chinese translation
      const result = `${data.data.en}\n\n${data.data.zh}`;
      
      return {
        content: [
          {
            type: "text",
            text: result
          }
        ]
      };
    }
  );
}
