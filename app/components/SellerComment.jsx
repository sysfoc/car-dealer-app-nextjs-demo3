import React from "react";
import { FaCommentDots } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SellerComment = ({ loadingState, car, translation: t }) => {
  const loading = loadingState;
  return (
    <div className="sticky top-1">
      <div className="mt-2 flex items-center gap-3 bg-blue-950 p-3 dark:bg-gray-700">
        <div>
          <FaCommentDots fontSize={25} className="text-white" />
        </div>
        <h3 className="text-lg font-bold uppercase text-white">
          {t("sellerComments")}
        </h3>
      </div>
      {loading ? (
        <div>
          <Skeleton height={400} />
        </div>
      ) : (
        <div className="p-4 text-gray-600 shadow-md dark:text-gray-300">
          {car?.sellerComments ||
            car?.sellercomments ||
            "No comments available"}
        </div>
      )}
    </div>
  );
};

export default SellerComment;
