import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface OrderTimerProps {
  createdAt: Date;
  estimatedReadyTime?: Date;
}

export const OrderTimer: React.FC<OrderTimerProps> = ({
  createdAt,
  estimatedReadyTime,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (new Date().getTime() - createdAt.getTime()) / 60000
      );
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  // Calculate estimated time in minutes if estimatedReadyTime is provided
  const estimatedTime = estimatedReadyTime
    ? Math.floor((estimatedReadyTime.getTime() - createdAt.getTime()) / 60000)
    : undefined;

  const isOverdue = estimatedTime && elapsedTime > estimatedTime;

  return (
    <div
      className={`flex items-center gap-1 text-sm ${
        isOverdue ? "text-red-600" : "text-gray-600"
      }`}
    >
      <Clock size={14} />
      <span className={isOverdue ? "font-bold" : ""}>
        {elapsedTime}m
        {estimatedTime && (
          <span className="text-gray-400"> / {estimatedTime}m</span>
        )}
      </span>
    </div>
  );
};
