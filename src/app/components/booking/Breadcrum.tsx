import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

interface BreadcrumProps {
  currentStep?: number;
}

export default function Breadcrum({ currentStep = 1 }: BreadcrumProps) {
  return (
    <Breadcrumbs className="text-white">
      <BreadcrumbItem
        isDisabled={currentStep !== 1}
        isCurrent={currentStep === 1}
        className={currentStep >= 1 ? "text-blue-500" : "text-gray-400"}
      >
        Booking
      </BreadcrumbItem>
      <BreadcrumbItem
        isDisabled={currentStep !== 2}
        isCurrent={currentStep === 2}
        className={currentStep >= 2 ? "text-blue-500" : "text-gray-400"}
      >
        Service
      </BreadcrumbItem>
      <BreadcrumbItem
        isDisabled={currentStep !== 3}
        isCurrent={currentStep === 3}
        className={currentStep >= 3 ? "text-blue-500" : "text-gray-400"}
      >
        Professional
      </BreadcrumbItem>
      <BreadcrumbItem
        isDisabled={currentStep !== 4}
        isCurrent={currentStep === 4}
        className={currentStep >= 4 ? "text-blue-500" : "text-gray-400"}
      >
        Time & Date
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
