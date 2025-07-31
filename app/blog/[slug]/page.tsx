import Image from "next/image";
import { IoMdAlarm } from "react-icons/io";
import { Avatar } from "flowbite-react";
import ClientBlog from "./ClientBlog"
import { headers } from "next/headers";
import CommentSection from "../../components/CommentSection"
import { Metadata } from "next";

type ParamsType = {
  slug: string;
};

interface BlogType {
  _id: string;
  title: string;
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  categoryId: string;
  category?: string;
  author?: string;
  image?: string;
  createdAt: string;
  content: string;
  slug: string;
}

async function getBlog(slug: string): Promise<BlogType | null> {
  try {
    const headersList = headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const res = await fetch(`${protocol}://${host}/api/blog/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: ParamsType }): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription,
  };
}

const Page = async ({ params }: { params: ParamsType }) => {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return;
  }

  return (
    <section className="mx-4 my-14 sm:mx-16">
      <div className="grid grid-cols-1 items-center gap-x-10 gap-y-5 py-5 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg">
          <Image
            src={blog.image || "/default.jpg"}
            alt={blog.title || "Blog image"}
            width={500}
            height={300}
            className="size-full"
          />
        </div>
        <div>
          <div className="flex flex-row items-center gap-3">
            <button className="inline-flex items-center rounded-lg bg-blue-950 px-3 py-2 text-center text-sm font-medium text-white dark:bg-red-500">
              {blog?.category || "Uncategorized"}
            </button>
            <div className="flex items-center gap-2">
              <IoMdAlarm fontSize={18} />
              <span>{new Date(blog?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <h1 className="mt-3 text-2xl font-bold sm:mt-5 sm:text-4xl">
            {blog?.h1 || blog?.metaTitle}
          </h1>
          <div className="mt-5 flex items-center gap-10">
            <div className="flex items-center gap-3">
              <Avatar size={"sm"} rounded />
              <span>{blog?.author || "Anonymous"}</span>
            </div>
            <ClientBlog slug={blog?.slug} />
          </div>
        </div>
      </div>

      <CommentSection slug={blog?.slug} />
    </section>
  );
};

export default Page;