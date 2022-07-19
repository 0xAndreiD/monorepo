import { forwardRef, PropsWithoutRef } from "react"
import { useFormContext } from "react-hook-form"
import Labeled from "app/core/components/generic/Labeled"

export interface LabeledSelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledSelectField = forwardRef<HTMLSelectElement, LabeledSelectFieldProps>(
  ({ label, outerProps, name, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext()
    const error = Array.isArray(errors[name]) ? errors[name].join(", ") : errors[name]?.message || errors[name]

    return (
      <div {...outerProps}>
        <Labeled label={label}>
          <select
            className="border rounded-md p-3 w-full font-light text-sm"
            disabled={isSubmitting}
            {...register(name)}
            {...props}
          >
            {props.children}
          </select>
        </Labeled>
        {error && (
          <div role="alert" style={{ color: "red" }}>
            {error}
          </div>
        )}
      </div>
    )
  }
)

export default LabeledSelectField
