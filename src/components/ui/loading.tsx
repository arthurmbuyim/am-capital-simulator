import * as React from "react";
import { cn } from "@/src/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Loader2 
      className={cn("animate-spin", sizeClasses[size], className)} 
    />
  );
};

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-current rounded-full animate-pulse",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.4s",
          }}
        />
      ))}
    </div>
  );
};

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className, lines = 1 }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-gray-200 rounded",
            i === 0 ? "h-4" : "h-3 mt-2"
          )}
          style={{
            width: i === lines - 1 ? "75%" : "100%",
          }}
        />
      ))}
    </div>
  );
};

interface LoadingCardProps {
  className?: string;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-gray-200 rounded-lg h-32 mb-4" />
      <div className="space-y-3">
        <div className="bg-gray-200 rounded h-4 w-3/4" />
        <div className="bg-gray-200 rounded h-3 w-full" />
        <div className="bg-gray-200 rounded h-3 w-5/6" />
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  children?: React.ReactNode;
  message?: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  children, 
  message = "Chargement...",
  className 
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
        className
      )}
    >
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 max-w-sm mx-4">
        <LoadingSpinner size="lg" className="text-blue-600" />
        <p className="text-gray-700 text-center">{message}</p>
        {children}
      </div>
    </div>
  );
};

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  className,
  disabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors",
        "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};

export {
  LoadingSpinner,
  LoadingDots,
  LoadingSkeleton,
  LoadingCard,
  LoadingOverlay,
  LoadingButton,
};