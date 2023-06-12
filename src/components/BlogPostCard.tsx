import { Blog } from "@/pages/blog";
import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";

type Props = {
  post: Blog;
};

function BlogPostCard({ post }: Props) {
  const { title, date, content, photo } = post.fields;

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="my-4">{children}</p>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { url, details } = node.data.target.fields.file;
        const { width, height } = details.image;
        return (
          <Image
            src={`https:${url}`}
            width={width}
            height={height}
            alt="photo"
          />
        );
      },
    },
    renderMark: {
      [MARKS.BOLD]: (text: any) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text: any) => <em>{text}</em>,
    },
  };

  return (
    <>
      <div className="mt-4 space-x-2">
        {/* Add more buttons for additional categories */}
      </div>
      <div className="bg-gray-800/70 rounded shadow p-4 my-5">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-500 mb-2">{date}</p>
        <div className="prose">
          {content && documentToReactComponents(content, options)}
        </div>
        <div className="my-5">
          {photo && (
            <Image
              src={`https:${photo.fields.file.url}`}
              width={photo.fields.file.details.image.width}
              height={photo.fields.file.details.image.height}
              alt="photo"
            />
          )}
        </div>
      </div>
    </>
  );
}

export default BlogPostCard;
