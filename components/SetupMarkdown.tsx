import matter from "gray-matter";
import Markdown from "markdown-to-jsx";

export default function SetupMarkdown() {
  const mdx = matter("**TEST**");
  console.log(mdx);
  return (
    <main>
      <article>
        <Markdown>{mdx.content}</Markdown>
      </article>
    </main>
  );
}
