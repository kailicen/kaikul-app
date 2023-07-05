import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";

const shareProgress = async (req: NextApiRequest, res: NextApiResponse) => {
  const web = new WebClient(process.env.SLACK_BOT_TOKEN);

  if (req.method === "POST") {
    const { channel, text } = req.body;

    try {
      const result = await web.chat.postMessage({
        channel: channel,
        text: text,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error posting message" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default shareProgress;
