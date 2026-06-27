import { createApp } from "./app.js";

async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

bootstrap();
