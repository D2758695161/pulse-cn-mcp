import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchWeiboHot } from '../utils/fetch.js';

export function registerWeiboHotspotsTool(server: McpServer) {
  server.tool("get-weibo-hotspots", 
    "获取微博最新热搜榜单，返回包含排名、话题标题和热度值的实时数据。数据来源于微博官方，通过API实时获取。", 
    {}, // No parameters for this tool
    async () => {
      const result = await fetchWeiboHot();
      
      // Check for error (success=false or empty data indicates failure)
      if (!result.success || !result.data || result.data.length === 0) {
        const errorMsg = ('_error' in result) 
          ? `获取微博热搜失败: ${result._error}`
          : "无法获取微博热搜数据，请稍后重试或检查网络连接";
        return {
          content: [
            {
              type: "text",
              text: errorMsg
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: result.data.map(item => `${item.index}. ${item.title} (${item.hot})`).join('\n')
          }
        ]
      };
    }
  );
}
