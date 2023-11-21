import * as React from "react";

import { cn } from "@utils/shadcn";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff, X } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          { "border-red-500 bg-red-50": error },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

type LabeledInputProps = {
  label?: string;
  name: string;
  rightIcon?: React.FC<{ className?: string }>;
  showClearField?: boolean;
  showPasswordButton?: boolean;
} & InputProps;

const LabeledInput = ({
  label,
  name,
  showClearField = false,
  type,
  ...props
}: LabeledInputProps) => {
  const {
    register,
    formState: { errors },
    resetField,
  } = useFormContext();
  const error = errors[name];
  const hasError = error !== undefined;
  const showPasswordButton = type === "password";
  const [actualType, setActualType] = useState(type);

  return (
    <div className="relative flex w-full flex-col gap-1 text-left">
      {label && (
        <label className="text-base font-normal text-slate-900">{label}</label>
      )}
      <Input
        error={hasError}
        {...register(name)}
        type={actualType}
        {...props}
      />
      <span className="text-sm text-red-500">{error?.message?.toString()}</span>

      <div className="absolute right-0 top-0 mr-2 flex h-10 appearance-none items-center justify-center">
        {showClearField && (
          <button type="button" onClick={() => resetField(name)}>
            <X className="h-3 w-3 text-slate-900" />
          </button>
        )}
        {showPasswordButton && (
          <button
            type="button"
            onClick={() => setActualType(actualType === type ? "" : "password")}
          >
            {actualType === type ? (
              <EyeOff className="h-3 w-3 text-slate-900" />
            ) : (
              <Eye className="h-3 w-3 text-slate-900" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export { Input, LabeledInput };
