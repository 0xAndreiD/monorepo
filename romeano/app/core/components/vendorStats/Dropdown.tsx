import { Template } from "db"

export function Dropdown(props: { data: Template[] }) {
  // console.log("hello")
  // console.log(props.data)
  // props.data.forEach(element => console.log(element))

  return (
    <select name="template" id="template" className="border rounded-md p-3 w-full font-light text-sm">
      <option key={-1} value="">
        {" "}
      </option>
      {props.data.map((element, index) => (
        <option key={index}>{element.name}</option>
      ))}
      {console.log(props.data)}
    </select>
  )
}
