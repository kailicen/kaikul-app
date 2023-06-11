import BlogPostCard from "@/components/BlogPostCard";
import { createClient } from "contentful";
import React, { useState } from "react";
import { Document } from "@contentful/rich-text-types";
import Link from "next/link";

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY!,
  });

  const res = await client.getEntries({ content_type: "blog" });

  return {
    props: {
      posts: res.items,
    },
    revalidate: 1,
  };
}

export type Blog = {
  fields: {
    title: string;
    date: string;
    category: string;
    content: Document;
    photo: {
      fields: {
        file: {
          url: string;
          details: {
            image: { width: number; height: number };
          };
        };
      };
    };
  };
  sys: {
    id: string;
  };
};

type Props = {
  posts: Blog[];
};

function Blog({ posts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.fields.category === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen z-0 font-sans bg-violet-950 text-violet-50">
      <header className="sticky top-0 left-0 right-0 p-5 flex justify-center px-5 md:px-20 mx-auto z-20 items-center max-w-2xl 2xl:max-w-3xl bg-violet-950">
        <Link href="/">
          <div className="absolute left-5 top-7 text-white flex flex-row">
            👈 Back <span className="hidden md:block md:ml-[6px]">to HOME</span>
          </div>
        </Link>
        <div className="font-bold text-2xl 2xl:text-3xl">
          KaiKul&apos;s Blog
        </div>
      </header>
      <div className="max-w-2xl 2xl:max-w-3xl mx-auto p-4">
        <div className="flex justify-center space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded-full ${
              selectedCategory === ""
                ? "bg-violet-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleCategoryClick("")}
          >
            All
          </button>
          {posts.map((post: Blog) => (
            <button
              key={post.sys.id}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === post.fields.category
                  ? "bg-violet-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleCategoryClick(post.fields.category)}
            >
              {post.fields.category}
            </button>
          ))}
        </div>
        {filteredPosts.map((post: Blog) => (
          <BlogPostCard key={post.sys.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Blog;
