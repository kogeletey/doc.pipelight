const isProd = process.env.NODE_ENV === "production";

const site = isProd
  ? "https://doc.pipelight.areskul.com"
  : "http://localhost:5000";

export const metaData = {
  title: "Pipelight",
  description: "A tiny automation tool.",
  site,
  image: `${site}/images/pipelight.png`
};
