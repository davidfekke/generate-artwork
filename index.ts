import { promises as fsp } from 'fs';
import { DallEAPIWrapper } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Buffer } from 'buffer';
import { v4 as generateUUID } from 'uuid';

function generateFilename() {
    return `${generateUUID()}.png`;
}

const headline = `I Moved my Blog to Astro`;

const imagePrompt = PromptTemplate.fromTemplate(`
To generate a creative header image using Dall-E based on your blog post's headline and body text, we can design a flexible prompt that incorporates key elements of your blog. Here's how you can structure your prompt, making it adaptable to any blog post by substituting your specific headlines and text:

### Dall-E Prompt Template

**Title of the Blog Post**: {headline}

**Preferred Color Scheme and Art Style**: Bright and vibrant colors to emphasize growth and sustainability; a blend of digital art and watercolor styles for a modern yet organic feel

**Mood or Atmosphere of the Image**: Inspiring and uplifting, showcasing harmony between urban life and nature

Make sure to not include the Title of the Blog Post in the image. The image should be a visual representation of the blog post's content and theme.
`);

async function main() {
    const tool = new DallEAPIWrapper({
        n: 1, // Default
        modelName: "dall-e-3", // Default
        openAIApiKey: process.env.OPENAI_API_KEY, 
        size: "1792x1024"
    });
      
    const prompt = await imagePrompt.format({ headline }); 
    const imageURL = await tool.invoke(prompt);
    const filename = generateFilename();
    const arrayBuf = await fetch(imageURL).then(res => res.arrayBuffer());
    await fsp.writeFile(filename, Buffer.from(arrayBuf));
}

main().catch(console.error);
