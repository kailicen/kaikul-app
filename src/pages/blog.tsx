import BlogPostCard from "@/components/BlogPostCard";
import { createClient } from "contentful";
import React, { useState, useEffect } from "react";
import { Document } from "@contentful/rich-text-types";
import Link from "next/link";

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY!,
  });

  const res = await client.getEntries({
    content_type: "blog",
    order: ["-fields.date"], // Sort in descending order based on the "date" field
  });

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
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(posts.map((post) => post.fields.category))
    );
    setCategories(uniqueCategories);
  }, [posts]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

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
              activeCategory === ""
                ? "bg-violet-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleCategoryClick("")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full ${
                activeCategory === category
                  ? "bg-violet-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {posts
          .filter((post) =>
            activeCategory ? post.fields.category === activeCategory : true
          )
          .map((post: Blog) => (
            <BlogPostCard key={post.sys.id} post={post} />
          ))}
      </div>
    </div>
  );
}

export default Blog;
