import { forwardRef, PropsWithoutRef } from "react"
import { useFormContext } from "react-hook-form"
import Labeled from "app/core/components/generic/Labeled"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ label, outerProps, name, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext()
    const error = Array.isArray(errors[name]) ? errors[name].join(", ") : errors[name]?.message || errors[name]

    return (
      <div {...outerProps}>
        <Labeled label={label}>
          <input
            className="border h-10 rounded-md p-3 w-full font-light text-sm"
            disabled={isSubmitting}
            {...register(name)}
            {...props}
          />
        </Labeled>
        {error && (
          <div role="alert" style={{ color: "red" }}>
            {error}
          </div>
        )}

        {/* <style jsx>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1rem;
          }
          input {
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            border: 1px solid purple;
            appearance: none;
            margin-top: 0.5rem;
          }
        `}</style> */}
      </div>
    )
  }
)

export default LabeledTextField
