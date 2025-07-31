import React from "react";
import { Table, TableBody, TableCell, TableRow } from "flowbite-react";
import { RxHamburgerMenu } from "react-icons/rx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Tables = ({ loadingState, carData, translation: t }) => {
  const loading = loadingState;
  return (
    <div>
      <div className="flex items-center gap-2 bg-blue-950 p-3 dark:bg-gray-700">
        <div>
          <RxHamburgerMenu fontSize={25} className="text-white" />
        </div>
        <h3 className="text-lg font-bold uppercase text-white">
          {t("vehicalDetail")}
        </h3>
      </div>
      <Table hoverable className="mt-3 dark:bg-gray-700">
        {loading ? (
          <TableBody className="divide-y">
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody className="divide-y">
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                Vehicle
              </TableCell>
              <TableCell>{carData.make}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                Doors
              </TableCell>
              <TableCell>{carData.doors || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                Seats
              </TableCell>
              <TableCell>{carData.seats || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                Cylinders
              </TableCell>
              <TableCell>{carData.cylinder || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                Fuel Type
              </TableCell>
              <TableCell>{carData.fuelType || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                Gearbox
              </TableCell>
              <TableCell>{carData.gearbox || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                Gears
              </TableCell>
              <TableCell>{carData.noOfGears || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-blue-950 dark:text-gray-200">
                Capacity
              </TableCell>
              <TableCell>{carData.engineCapacity || "Not provided"}</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default Tables;
