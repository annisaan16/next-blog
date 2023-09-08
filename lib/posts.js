import { readdir, readFile } from "fs/promises";
import { marked } from "marked";
import matter from "gray-matter";

export async function getPost(slug) {
    const source = await readFile(`content/posts/${slug}.md`, 'utf8');
    const { data, content } = matter(source);
    const html = marked(content);
    return {
        title: data.title,
        body: html,
    };
}

export async function getPosts() {
    const slugs = await getSlugs();
    const posts = [];
    for (const slug of slugs) {
        const post = await getPost(slug);
        posts.push({ slug, ...post });
    }
    return posts;
}

export async function getSlugs() {
    const files = await readdir('content/posts');
    return files.filter((file) => file.endsWith('.md'))
        .map((file) => file.slice(0, -3));
}