// components/Card.tsx

import Image from "next/image";
import React from "react";
import DeleteButton from "./DeleteButton";

interface CardProps {
  image: string;
  title: string;
  description: string;
  slug: string;
  buttonText?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  image,
  title,
  description,
  slug,
  buttonText = "Edit the Event",
  className = "",
}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <div
      className={`max-w-sm bg-gray-800 border border-gray-700 rounded-lg shadow-sm 
    flex flex-col justify-between overflow-hidden dark:bg-gray-800 dark:border-gray-700 ${className}`}
    >
      <a href={`${BASE_URL}/events/${slug}`}>
        <Image
          className="rounded-t-lg w-full object-cover"
          src={image}
          alt={title}
          width={400}
          height={250}
          style={{ width: "100%", height: "200px" }}
          loading="eager"
        />
      </a>

      <div className="flex flex-col justify-between flex-grow p-5">
        <div>
          <a href={`${BASE_URL}/events/${slug}`}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white line-clamp-2">
              {title}
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-400 line-clamp-3">
            {description}
          </p>
        </div>

        <div className="mt-auto flex gap-2">
          <a
            href={`${BASE_URL}/dashboard/edit/${slug}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center 
                   text-white bg-blue-600 rounded-lg hover:bg-blue-700 
                   focus:ring-4 focus:outline-none focus:ring-blue-800"
          >
            {buttonText}
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>

          <DeleteButton slug={slug} />
        </div>
      </div>
    </div>
  );
};

export default Card;
